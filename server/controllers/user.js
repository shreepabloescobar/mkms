var jwt = require('jsonwebtoken');
const {
  handleUserLoginService,
  resendOtpService,
  handleUserLoginRocketChatService,
  createRocketChatUserService,
  getAllProfilesService,
  getMKAppUsersDetails,
  createMKMSStudentRelationService
} = require("../service/userService");

const { createNew } = require("../service/newUserService");

const hashPassword = require("../middlewares/auth");

const logger = require("../service/logger")("User");

const StudentRelationModel = require("../models/studentRelation");

const ApiClient = require("../apiclient/apiclient");

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
  let phone = jwt.verify(req.headers.authtoken, process.env.SECRET).user
  const response = await getAllProfilesService(phone)
  return res.status(200).json({data: response})
};

const getUserProfile = async (req, res) => {
  const { id } = req.body;
  // console.log("Id",)
  let userId, rctoken;
  StudentRelationModel.findOne({ premium_id : id }, async (err, data) => {
    if (err) {
      console.log("No Such Id ", id);
    } else {
      let user = id+"@byjus-student-rc.com"
      let response = await ApiClient.MKMS(
        "post",
        "/login",
        {
          user: user,
          password: hashPassword.hashPassword(user),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response)
      userId = response.data.data.userId;
      rctoken = response.data.data.authToken;

      response = await ApiClient.MKMS(
        "get",
        "/channels.list.joined",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": rctoken,
            "X-User-Id": userId,
          },
        }
      );
      console.log(response);
      if (response.status == 200) {
        return res.json({
          status: 200,
          message: "success",
          helpline: "String",
          upcomingClassesNotifications: "Integer",
          performanceNotifications: "Integer",
          attendanceNotifications: "Integer",
          chats: response.data.channels,
        });
      } else {
        return res.json({
          status: 400,
          message: "failed",
          data: "cant fetch ",
        });
      }
    }
  });
};

const addNewUser = async (req, res) => {
  try {
    console.log("Adding New User");
    createNew();
    return res.status(200).json({ status: "OK" });
  } catch (err) {
    console.log("Error", err);
  }
};

const getMKAppUsersDetailsFnc = async (req,res)=>{
  try{
    let rsData = await getMKAppUsersDetails(req.body);
    return res.status(200).json(rsData.data);
  }catch(err){
    return res.status(400);
  }
}
const createMKMSStudentRelation = async (req,res)=>{
  try{
    let rsData = await createMKMSStudentRelationService(req.body);
    console.log(rsData)
    return res.status(200).json(rsData);
  }catch(err){
    return res.status(400);
  }
}

module.exports = {
  handleUserLogin,
  createRocketChatUser,
  handleUserLoginRocketChat,
  resendOtp,
  welcome,
  welcomePost,
  getAllProfiles,
  getUserProfile,
  addNewUser,
  getMKAppUsersDetailsFnc,
  createMKMSStudentRelation,
  
};
