var mongoose = require('mongoose');
const schema = mongoose.Schema;

const Users = new schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
},{
    versionKey: false
});

module.exports = mongoose.model('Users', Users);