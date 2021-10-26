const mongoose = require('mongoose');
const {wrapperConnection,rocketChatConnection} = require('../config/dbConnection');
const Schema = mongoose.Schema;

let topicSchema = new Schema({

    
    createdAt : {
        type:Date,
        default: Date.now
    },
    updatedAt : {
        type:Date,
        default: Date.now
    },
    id : {
        type:Number
    },
    name : {
        type: String
    },
    subject : {
        type: String
    },
    type : {
        type: String
    },
    assessment_id : {
        type : Number
    },
    classroom_id : {
        type : String
    }
}, {
    collection: 'topic'
});
const topicModel = wrapperConnection.model('topic',topicSchema);
module.exports = topicModel; 
// module.exports = mongoose.model('topic',topicSchema)