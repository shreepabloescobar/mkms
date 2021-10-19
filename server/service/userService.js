const moment = require('moment');
const { isEmpty } = require('lodash');
const { OtpTransaction } = require('@byjus-orders/nexemplum/lms');
const { Cibil } = require('@byjus-orders/nexemplum/lms');

// const { isValidMobileNo } = require('./utils/dataValidators');
const { generateOtp } = require('./utils/helper');
const { templateMap } = require('./utils/smsTemplates');
const { sendSms } = require('./utils/notificationUtil');
const { fetchLoanDataService, fetchSalesPersonDetails } = require('./commonServices/dataService');

const logger = require('./logger')('User Service');

const handleUserLoginService = async (data) => {
    try {
        const { mobileNo } = data;
        // const canProceed = mobileNo && isValidMobileNo(mobileNo);
        if (true) {
            const cxData = await fetchCxDataOnLogin({ "telephones.telephoneNumber": mobileNo, "source": "mobileapp" });
            if (!isEmpty(cxData)) {
                const { emailAddress = '', applicantFirstName = '', applicantLastName = '', salesEmail } = cxData;
                let { contact: spContactNo } = await fetchSalesPersonDetails(salesEmail)
                if (!spContactNo) {
                    spContactNo = '9513138491';
                }
                const otp = generateOtp();
                await saveOtp({ otp, appId: cxData.appId });

                const userData = await getSmsPayload(otp, mobileNo, applicantFirstName, applicantLastName, spContactNo);
                const smsResponse = await sendSms(userData)
                // const mailResponse = await sendEmailToCx("tlpay@byjus.com", [emailAddress], ` Byju's Mobile App Login || OTP`, emailTemplate({ type: 'byjusPay', otp, template: 'loginOtp', applicantFirstName, applicantLastName, spContactNo }))
                const mailResponse = {};
                if (smsResponse.includes('SMS send successful.') || mailResponse.statusCode === 202) {
                    logger.info(`Mobile Number ${mobileNo} verified successfully and OTP sent, AppId - ${cxData.appId}`);
                    return {
                        status: 'success',
                        message: 'Mobile Number verified successfully and OTP sent!',
                        data: { appId: cxData.appId }
                    };
                } else {
                    logger.info(`Error sending OTP for Mobile Number ${mobileNo}, AppId - ${cxData.appId}`);
                    return {
                        status: 'failure',
                        message: 'Error sending Otp!'
                    };
                }
            } else {
                logger.info(`There is no ongoing application associated with this number ${mobileNo}`);
                return {
                    status: 'failure',
                    message: `There is no ongoing application associated with this number. Please check and retry or contact BYJU'S sales representative.`
                };
            }
        } else {
            return {
                status: 'failure',
                message: 'Please enter a valid MobileNo.!'
            };
        }
    } catch (error) {
        logger.info('Error in handle user login service ', error);
        return {
            status: 'failure',
            message: (error.message || `Error in handle user login service`)
        };
    }
}

const getSmsPayload = async (otp, mobileNo, applicantFirstName, applicantLastName, spContactNo) => {
    let hashCode = await getConfigService('HASH_CODE_AUTO_READ_OTP') || '';
    return {
        message: templateMap({ type: 'byjusPay', otp, template: 'loginOtp', applicantFirstName, applicantLastName, spContactNo, hashCode }),
        contact: mobileNo,
        provider: 'plivo',
        channel_type: 'sms'
    };
}

const saveOtp = async (data) => {
    try {
        const { otp, appId } = data;
        await OtpTransaction.updateOne({ appId }, {
            $set: {
                otp,
                createdAt: moment().toDate()
            }
        }, { upsert: true });
    } catch (error) {
        logger.info('Error with save OTP ', error);
        return {
            status: 'failure',
            message: (error.message || `Error with save OTP`)
        };
    }
}

const resendOtpService = async (data) => {
    try {
        const { appId } = data;
        const otp = generateOtp();
        await saveOtp({ otp, appId });

        const cxData = await fetchLoanDataService({ appId });
        const { telephones, emailAddress, applicantFirstName = '', applicantLastName = '', salesEmail = '' } = cxData;
        let { contact: spContactNo } = await fetchSalesPersonDetails(salesEmail)
        if (!spContactNo) {
            spContactNo = '9513138491';
        }
        const mobileNo = telephones[0].telephoneNumber

        const userData = await getSmsPayload(otp, mobileNo, applicantFirstName, applicantLastName, spContactNo);
        const smsResponse = await sendSms(userData)
        // const mailResponse = await sendEmailToCx("tlpay@byjus.com", [emailAddress], ` Byju's Mobile App Login || OTP`, emailTemplate({ type: 'byjusPay', otp, template: 'loginOtp', applicantFirstName, applicantLastName, spContactNo }))
        const mailResponse = {};
        if (smsResponse.includes('SMS send successful.') || mailResponse.statusCode === 202) {
            logger.info(`OTP resent successfully for mobileNo - ${mobileNo}, appId - ${appId}`);
            return {
                status: 'success',
                message: 'OTP resent successfully'
            };
        } else {
            logger.info(`Error sending OTP for mobileNo - ${mobileNo}, appId - ${appId}`);
            return {
                status: 'failure',
                message: 'Error resending Otp!'
            };
        }
    } catch (error) {
        logger.info('Error with resend OTP service ', error);
        return {
            status: 'failure',
            message: (error.message || `Error with resend OTP service`)
        };
    }
}

const fetchCxDataOnLogin = async (filter) => {
    logger.info('Inside fetch Loan Data On Login function');
    const response = await Cibil.findOne(filter).sort({ createdAt: -1 }).lean(); // Fetch the most recent application
    return response;
}

module.exports = {
    handleUserLoginService,
    resendOtpService
}