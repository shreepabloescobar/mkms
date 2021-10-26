const {
  handleUserLoginService,
  resendOtpService,
  handleUserLoginRocketChatService,
  createRocketChatUserService,
} = require("../service/userService");
const logger = require("../service/logger")("User");

const UserSchema = require('../models/user')

const handleUserLogin = async (req, res) => {
  try {
    const { mobileNo = "" } = req.body;
    const response = await handleUserLoginService({ mobileNo });

    if (response.status === "success") {
      logger.info(`User login successfully for mobileNo : ${mobileNo}!`);
      return res.status(200).json(response);
    } else {
      logger.info(`Error while user login for mobileNo : ${mobileNo}`);
      return res.status(400).json(response);
    }
  } catch (error) {
    logger.info("Error while user login", error);
    return res.status(400).json({
      status: "failure",
      message: error.message || "Error while user login",
    });
  }
};

const createRocketChatUser = async (req, res) => {
  try {
    const response = await createRocketChatUserService(req.body);
    console.log(response);

    if (response.status === "success") {
      logger.info(`User login successfully to Rocket chat.`);
      return res.status(200).json(response);
    } else {
      logger.info(`Error while user Rocket chat login.`);
      return res.status(400).json(response);
    }
  } catch (error) {
    logger.info("Error while user Rocket chat login", error);
    return res.status(400).json({
      status: "failure",
      message: error.message || "Error while user Rocket chat login",
    });
  }
};

const handleUserLoginRocketChat = async (req, res) => {
  try {
    const { mobileNo = "" } = req.body;

    const response = await handleUserLoginRocketChatService({ mobileNo });

    if (response.status === "success") {
      logger.info(`User login successfully to Rocket chat.`);
      return res.status(200).json(response);
    } else {
      logger.info(`Error while user Rocket chat login.`);
      return res.status(400).json(response);
    }
  } catch (error) {
    logger.info("Error while user Rocket chat login", error);
    return res.status(400).json({
      status: "failure",
      message: error.message || "Error while user Rocket chat login",
    });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { appId = "" } = req.params;
    const response = await resendOtpService({ appId });

    if (response.status === "success") {
      logger.info(`OTP resent successfully for appId : ${appId}!`);
      return res.status(200).json(response);
    } else {
      logger.info(`Error resending OTP for appId : ${appId}`);
      return res.status(400).json(response);
    }
  } catch (error) {
    logger.info("Error resending OTP", error);
    res.status(400).json({
      status: "failure",
      message: error.message || "Error resending Otp!",
    });
  }
};

const welcome = async (req, res) => {
  return res.status(200).json({ message: "welcome mk app server!!" });
};

const welcomePost = async (req, res) => {
  return res.status(200).json(req.body);
};

const getAllProfiles = async (req, res) => {
  if (req.query.token) {
    UserSchema.find({ phoneNumber: req.query.MobileNumber }, (err, data) => {
      if (err) {
        return res.status(400).json(err);
      } else {
        let out_value = {
          helplineNumber: "Some Helpline",
          student: [],
        };
        data.map((value) => {
          let x = {
            id: 1,
            userName: value.username,
            userRole: value.roles[0],
            class: "BYJUs Class, Aakash",
            avatarURL: "String",
            avatarColor: "String",
            avatarTextColor: "String",
            access: {
              type: value.type,
              message: "String",
              messageType: "Integer",
            },
            notificationCount: "Integer",
            onBoarded: "Boolean",
          };
          out_value.student.push(x);
        });
        return res.status(200).json(out_value);
      }
    });
  } else {
    return res
      .status(401)
      .json({ message: "Unauthorized", error: "Invalid Token" });
  }
};

module.exports = {
  handleUserLogin,
  createRocketChatUser,
  handleUserLoginRocketChat,
  resendOtp,
  welcome,
  welcomePost,
  getAllProfiles,
};
