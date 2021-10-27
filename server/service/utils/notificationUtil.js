const { get } = require('lodash');
const cryptoJS = require('crypto-js');
const request = require('request-promise');

const config = require('../../config/environment');
const logger = require('../logger');

const sendSms = async (userData) => {
    try {
        const secretKey = cryptoJS.AES.encrypt(config.sms.key, config.sms.salt);

        const options = {
            uri: config.sms.serviceUrl,
            method: 'POST',
            body: { ...userData, secretKey },
            json: true,
        };
        const response = await request(options);

        const smsResponse = get(response, 'message');
        return smsResponse
    } catch (error) {
        logger.info(`Error in send SMS, ${error}`);
        return {
            status: 'failure',
            message: (error.message || "Error in send SMS")
        }
    }
}

module.exports = {
    sendSms
}