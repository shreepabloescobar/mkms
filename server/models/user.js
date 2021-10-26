const mongoose = require('mongoose');
const {wrapperConnection,rocketChatConnection} = require('../config/dbConnection'); 
const Schema = mongoose.Schema;

let userSchema = new Schema({

    _id : {
        type:String
    },createdAt : {
        type:Date
    },
    services : {
        type:Object
    },
    emails : {
        type: Array
    },
    type : {
        type : String
    },
    status : {
        type : String
    }, 
    active : {
        type : Boolean
    },
    _updatedAt : {
        type : Date
    },
    roles : {
        type : Array
    },
    name : {
        type : String
    },
    lastLogin : {
        type : Date
    },
    statusConnection : {
        type : String
    },
    utcOffset : {
        type : mongoose.Types.Decimal128
    },
    username : {
        type : String
    },
    __rooms : {
        type : Array
    },
    phoneNumber : {
        type : Number
    }
}, {
    collection: 'users'
});


const userModel = rocketChatConnection.model('user', userSchema);

module.exports = userModel 
// module.exports = mongoose.model('user',userSchema)