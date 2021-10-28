const mongoose = require('mongoose');
const {wrapperConnection,rocketChatConnection} = require('../config/dbConnection'); 
const Schema = mongoose.Schema;
const {v4: uuidv4} = require('uuid');

let studentRelationSchema = new Schema({
    _id:{
        type: String,
        required: true,
        default: uuidv4()
    },
    rocket_user_id: {
        type: String,
        require: true,
        unique: true 
    },
    premium_id: {
        type: String,
        required: true,
    },
    user_type: {
        type: String,
        required: true
    },
    on_board:{
        type:Boolean,
        required:true,
        default:false
    }     

}, {
    collection: 'studentRelation'
})

studentRelationSchema.set("timestamps",true);

const studentRelationModel = wrapperConnection.model('studentRelation', studentRelationSchema);

module.exports = studentRelationModel 