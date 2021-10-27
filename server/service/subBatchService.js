const moment = require('moment');
const { isEmpty } = require('lodash');
const { OtpTransaction } = require('@byjus-orders/nexemplum/lms');
const { Cibil } = require('@byjus-orders/nexemplum/lms');

// const { isValidMobileNo } = require('./utils/dataValidators');

const { formatDateYMD } = require('./utils/helper');
const { fetchLoanDataService, fetchSalesPersonDetails } = require('./commonServices/dataService');

const logger = require('./logger')('User Service');
const axios = require('axios');
const subBatchModel = require('../models/subBatch');
const topicModel = require('../models/topic');

const createSubBatchService = async()=>{
    try{
        // let reqData = {...data};
        let reqData = await getSubBatchData();
        // console.log(reqData.data);
        let subBatchs = { ...reqData['data'] }

        await Promise.all(
            subBatchs['sub_batches'].map(async (subBatch) => {
                let createTopicRes = await topicModel.insertMany(subBatch['topics']);
                let insertedIds = createTopicRes.map(ctr=>{
                    return ctr['_id']
                })
                delete subBatch['topics'];
                subBatch['topic_id'] = insertedIds;
                let creatRes = new subBatchModel(subBatch);
                let resData = await creatRes.save();
            })
          )



        // let createTopic = new topicModel(reqData['topic_details'][0]);
        // let createTopicRes = await createTopic.save(); 
        // delete reqData['topic_details'];
        // reqData['topic_id'] = createTopicRes['_id'];
        // let creatRes = new subBatchModel(reqData);
        // let resData = await creatRes.save();
        logger.info(`sub batch data saved successfully.`);
        return {
            status: 'success',
            message: 'Sub Batch data saved successfully.'
        };
    }catch(err){
        console.log(err);
        logger.info(`Error sub batch data not saved.`);
                    return {
                        status: 'failure',
                        message: 'Error saving data!'
                    };
    }
}

const getSubBatchData = async()=>{
    try{
        // console.log("---inside----getSubBatchData  --- ");
          var reqConfig = {
            method: 'get',
            url: `${process.env.GET_SUB_BATCH_DATA_URL}=${formatDateYMD(new Date())}`,
            headers: { 
              'Content-type': 'application/json'
            }
          };
          return await axios(reqConfig);

    }catch(err){
        console.log(err);
    }
}

module.exports = {
    createSubBatchService
}