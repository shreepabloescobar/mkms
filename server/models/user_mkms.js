const mongoose = require('mongoose');
const {wrapperConnection,rocketChatConnection} = require('../config/dbConnection'); 
const Schema = mongoose.Schema;
const {v4: uuidv4} = require('uuid');

let mkmsUserSchema = new Schema({
    _id:{
        type: String,
        required: true,
        default: uuidv4()
    },
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true
    },
    created:{
        type: Date,
        default: Date.now
    }

})

const userModel = wrapperConnection.model('userMkms', mkmsUserSchema);

module.exports = userModel 