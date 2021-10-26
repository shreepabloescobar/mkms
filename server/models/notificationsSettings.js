const mongoose = require('mongoose');
const {wrapperConnection} = require('../config/dbConnection'); 
const Schema = mongoose.Schema;


let notifSettingsSchema = new Schema({
    user_id : {
            type: String,
            required: true
    },
    name: {
        type: String,
        required: true
    },
    description:{
        type: String,
    }, 
    active: {
        type: Boolean,
        default: false
    },
    notifications: {
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
        },
        active: {
            type: Boolean,
            default: false
        },
        disabled:{
            type: Boolean,
            deafult: false
        }

    }
});


const notificationSettings = wrapperConnection.model('notification_settings', notifSettingsSchema);

module.exports = notificationSettings