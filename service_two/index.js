var grpc = require('grpc');
var path = require('path');
var mongoose = require('mongoose');
const Users = require('./schemas/users');

var PROTO_PATH = path.join(__dirname + '/./protos/service_two.proto');
var SERVICE_ONE_PROTO_PATH = path.join(__dirname + '/./protos/service_one.proto');
var routerGuide = grpc.load(PROTO_PATH).serviceTwo;
const serviceOneRouterGuide = grpc.load(SERVICE_ONE_PROTO_PATH).serviceOne;

var SERVICE_ONE_CLIENT;

class ServiceTwo {
    getData(call, callback) {
        callback(null, {
            status: 200,
            message: '[SERVICE_TWO]: DATA RECEIVED SUCCESSFULLY'
        });
    }

    addUser(call, callback) {
        connectDatabase(call.request.databaseName, (err, success) => {
            if (err) {
                sendResponse(500, err, callback);
            } else {
                const user = new Users({
                    name: call.request.name,
                    email: call.request.email
                });
                user.save((err, saved) => {
                    if (err) {
                        sendResponse(500, 'Error while storing the user', callback);
                    } else {
                        sendResponse(200, 'User saved successfully', callback);
                    }
                });
            }
        });
    }

    updateUser(call, callback) {
        connectDatabase(call.request.databaseName, (err, success) => {
            if (err) {
                sendResponse(500, err, callback);
            } else {
                const userData = call.request;
                delete userData.databaseName;
                Users.findOneAndUpdate({
                    email: call.request.email
                }, {
                    name: userData.name
                }, {
                    upsert: true,
                    returnNewDocument: true
                }, (err, updated) => {
                    if (err) {
                        sendResponse(500, 'Error in updating the user', callback);
                    } else {
                        sendResponse(200, 'User details updated successfully', callback);
                    }
                });
            }
        });
    }

    deleteUser(call, callback) {
        connectDatabase(call.request.databaseName, (err, success) => {
            if (err) {
                sendResponse(500, err, callback);
            } else {
                Users.findOneAndDelete({
                    email: call.request.email
                }, (err, deleted) => {
                    if (err) {
                        sendResponse(500, 'Error while deleting the user', callback);
                    } else {
                        sendResponse(200, 'User deleted successfully', callback);
                    }
                });
            }
        });
    }
}

function connectDatabase(databaseName, callback) {
    mongoose.connect(`mongodb://localhost:27017/${databaseName}`, {
        useNewUrlParser: true
    }).then((onfulfilled, onrejected) => {
        if (onfulfilled) {
            callback(null, true)
        } else {
            callback(`error in connecting to ${databaseName}`);
        }
    });
}

function sendResponse(status, message, callback) {
    callback(null, {
        status,
        message
    });
}


function startServer() {
    try {
        const server = new grpc.Server();
        server.addService(routerGuide.service, new ServiceTwo);
        server.bind('0.0.0.0:4600', grpc.ServerCredentials.createInsecure());
        server.start();
        console.log('[SERVICE_TWO]: GRPC server started on port 4600');
    } catch (error) {
        console.log('******************Error in starting the server***********************');
        console.log(error);
        console.log('*********************************************************************');
    }
}

startServer();