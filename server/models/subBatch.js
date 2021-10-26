const mongoose = require('mongoose');
const {wrapperConnection,rocketChatConnection} = require('../config/dbConnection'); 
const Schema = mongoose.Schema;

let subBatchSchema = new Schema({

    
    createdAt : {
        type:Date,
        default: Date.now
    },
    updatedAt : {
        type:Date,
        default: Date.now
    },
    sub_batch_id : {
        type:Number
    },
    batch_id : {
        type: Number
    },
    premium_account_ids : {
        type : Array
    },
    topic_id : {
        type : Array
    }
}, {
    collection: 'subBatch'
});

const subBatchModel = wrapperConnection.model('subBatch', subBatchSchema);

module.exports = subBatchModel 
// module.exports = mongoose.model('subBatch',subBatchSchema)