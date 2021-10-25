const { validateOtpService } = require('../service/validateService');
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

module.exports = {
    validateOtp
}