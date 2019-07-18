var express = require('express');
var grpc = require('grpc');
var path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();
var SERVICE_TWO_PROTO_PATH = path.join(__dirname + '/./protos/service_two.proto');
var serviceTwoRouterGuide = grpc.load(SERVICE_TWO_PROTO_PATH).serviceTwo;

var SERVICE_TWO_CLIENT;

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.post('/user', (req, res) => {
    SERVICE_TWO_CLIENT.addUser(req.body, (err, data) => {
        res.send(data);
    });
});

app.put('/user', (req, res) => {
    SERVICE_TWO_CLIENT.updateUser(req.body, (err, data) => {
        res.send(data);
    });
});

app.delete('/user', (req, res) => {
    SERVICE_TWO_CLIENT.deleteUser(req.body, (err, data) => {
        res.send(data);
    });
});

function startClient() {
    SERVICE_TWO_CLIENT = new serviceTwoRouterGuide('0.0.0.0:4600', grpc.credentials.createInsecure());
    console.log('[SERVICE_ONE]: SERVICE_TWO client connected successfully');
}

app.listen(4500, () => {
    console.log('Express server started on port 4500');
});
startClient();