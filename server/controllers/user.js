const { handleUserLoginService, resendOtpService,handleUserLoginRocketChatService } = require('../service/userService');
const logger = require('../service/logger')('User');


const handleUserLogin = async (req, res) => {
	try {
		const { mobileNo = '' } = req.body;
		const response = await handleUserLoginService({ mobileNo });

		if (response.status === 'success') {
			logger.info(`User login successfully for mobileNo : ${mobileNo}!`);
			return res.status(200).json(response);
		} else {
			logger.info(`Error while user login for mobileNo : ${mobileNo}`);
			return res.status(400).json(response);
		}

	} catch (error) {
		logger.info("Error while user login", error);
		return res.status(400).json({
			status: 'failure',
			message: (error.message || "Error while user login")
		});
	}
}

const handleUserLoginRocketChat = async (req, res) => {
	try {
		const { mobileNo = '' } = req.body;
		
		const response = await handleUserLoginRocketChatService({ mobileNo });
		console.log(response);
		if (response.status === 'success') {
			logger.info(`User login successfully to Rocket chat.`);
			return res.status(200).json(response);
		} else {
			logger.info(`Error while user Rocket chat login.`);
			return res.status(400).json(response);
		}

	} catch (error) {
		logger.info("Error while user Rocket chat login", error);
		return res.status(400).json({
			status: 'failure',
			message: (error.message || "Error while user Rocket chat login")
		});
	}
}

const resendOtp = async (req, res) => {
	try {
		const { appId = '' } = req.params;
		const response = await resendOtpService({ appId });

		if (response.status === 'success') {
			logger.info(`OTP resent successfully for appId : ${appId}!`);
			return res.status(200).json(response);
		} else {
			logger.info(`Error resending OTP for appId : ${appId}`);
			return res.status(400).json(response);
		}
	} catch (error) {
		logger.info("Error resending OTP", error);
		res.status(400).json({
			status: 'failure',
			message: (error.message || 'Error resending Otp!')
		});
	}
}

const welcome = async (req, res) => {
	return res.status(200).json({ message: "welcome mk app server!!" });
}

const welcomePost = async (req, res) => {
	return res.status(200).json(req.body);
}

module.exports = {
	handleUserLogin,
	handleUserLoginRocketChat,
	resendOtp,
	welcome,
	welcomePost
}
