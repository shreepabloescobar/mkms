const { validateOtpService, requestOtpService, validateOtpService } = require('../service/validateService');
const logger = require('../service/logger')('Validate controller');

const validateOtp = async (req, res) => {
    try {
        const { appId = '' } = req.body || {};
        const response = await validateOtpService(req.body);

        if (response.status === 'success') {
            logger.info(`validate otp successfull for appId : ${appId}`);
            return res.status(200).json(response);
        } else {
            logger.info(`Error while validating otp for appId : ${appId}`);
            return res.status(400).json(response);
        }
    } catch (error) {
        logger.info(`Error while validating otp, ${error}`);
        return res.status(400).json({
            status: 'failure',
            message: (error.message || 'OTP verification Failed!')
        })
    }
}

const doOtpLogin = async (req,res) => {
    try{
            const mobileNo = req.body.MobileNumber;
            const countryCode = req.body.countryCode;
            const response = await requestOtpService(countryCode+'-'+mobileNo);
            if(response.status == 200){
                logger.info(`Success otp sent to user mobile ${mobileNo}`);
                return res.status(200).json(response);
            }
            else{
                logger.info(`Error sending otp`);
                return res.status(400).json({
                    status: 'failure',
                    message: ('OTP Sending Failed!')
                })
            }

    }catch (error){

    }
}

const validateOtpOnLogin = async (req,res) => {
    try{
        const data = req.body;
        const response = await validateOtpService(data);

        if(response.status == 200){
            logger.info(`Success otp sent to user mobile ${mobileNo}`);
            /*
                Add encryption token based on mobile number
                and send token back to user
            */
            return res.status(200).json(response);
        }
        else{
            logger.info(`Error sending otp`);
            return res.status(400).json(response)
        }

    }catch(error){

    }
}

module.exports = {
    validateOtp,
    doOtpLogin,
    validateOtpOnLogin
}