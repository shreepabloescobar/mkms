const moment = require("moment");
const { isEmpty } = require("lodash");
const { OtpTransaction } = require("@byjus-orders/nexemplum/lms");
const { Cibil } = require("@byjus-orders/nexemplum/lms");

// const { isValidMobileNo } = require('./utils/dataValidators');
const { generateOtp } = require("./utils/helper");
const { templateMap } = require("./utils/smsTemplates");
const { sendSms } = require("./utils/notificationUtil");
const {
  fetchLoanDataService,
  fetchSalesPersonDetails,
} = require("./commonServices/dataService");

const logger = require("./logger")("User Service");
const axios = require("axios");
// const userSchema = require('../models/user');
const userModel = require("../models/user");
const studentRelationModel = require("../models/studentRelation");
const ApiClient = require("../apiclient/apiclient");

const addNewUser = require("../service/newuserservices/adduser");

const handleUserLoginService = async (data) => {
  try {
    const { mobileNo } = data;
    // const canProceed = mobileNo && isValidMobileNo(mobileNo);
    if (true) {
      const cxData = await fetchCxDataOnLogin({
        "telephones.telephoneNumber": mobileNo,
        source: "mobileapp",
      });
      if (!isEmpty(cxData)) {
        const {
          emailAddress = "",
          applicantFirstName = "",
          applicantLastName = "",
          salesEmail,
        } = cxData;
        let { contact: spContactNo } = await fetchSalesPersonDetails(
          salesEmail
        );
        if (!spContactNo) {
          spContactNo = "9513138491";
        }
        const otp = generateOtp();
        await saveOtp({ otp, appId: cxData.appId });

        const userData = await getSmsPayload(
          otp,
          mobileNo,
          applicantFirstName,
          applicantLastName,
          spContactNo
        );
        const smsResponse = await sendSms(userData);
        // const mailResponse = await sendEmailToCx("tlpay@byjus.com", [emailAddress], ` Byju's Mobile App Login || OTP`, emailTemplate({ type: 'byjusPay', otp, template: 'loginOtp', applicantFirstName, applicantLastName, spContactNo }))
        const mailResponse = {};
        if (
          smsResponse.includes("SMS send successful.") ||
          mailResponse.statusCode === 202
        ) {
          logger.info(
            `Mobile Number ${mobileNo} verified successfully and OTP sent, AppId - ${cxData.appId}`
          );
          return {
            status: "success",
            message: "Mobile Number verified successfully and OTP sent!",
            data: { appId: cxData.appId },
          };
        } else {
          logger.info(
            `Error sending OTP for Mobile Number ${mobileNo}, AppId - ${cxData.appId}`
          );
          return {
            status: "failure",
            message: "Error sending Otp!",
          };
        }
      } else {
        logger.info(
          `There is no ongoing application associated with this number ${mobileNo}`
        );
        return {
          status: "failure",
          message: `There is no ongoing application associated with this number. Please check and retry or contact BYJU'S sales representative.`,
        };
      }
    } else {
      return {
        status: "failure",
        message: "Please enter a valid MobileNo.!",
      };
    }
  } catch (error) {
    logger.info("Error in handle user login service ", error);
    return {
      status: "failure",
      message: error.message || `Error in handle user login service`,
    };
  }
};

const getSmsPayload = async (
  otp,
  mobileNo,
  applicantFirstName,
  applicantLastName,
  spContactNo
) => {
  let hashCode = (await getConfigService("HASH_CODE_AUTO_READ_OTP")) || "";
  return {
    message: templateMap({
      type: "byjusPay",
      otp,
      template: "loginOtp",
      applicantFirstName,
      applicantLastName,
      spContactNo,
      hashCode,
    }),
    contact: mobileNo,
    provider: "plivo",
    channel_type: "sms",
  };
};

const saveOtp = async (data) => {
  try {
    const { otp, appId } = data;
    await OtpTransaction.updateOne(
      { appId },
      {
        $set: {
          otp,
          createdAt: moment().toDate(),
        },
      },
      { upsert: true }
    );
  } catch (error) {
    logger.info("Error with save OTP ", error);
    return {
      status: "failure",
      message: error.message || `Error with save OTP`,
    };
  }
};

const resendOtpService = async (data) => {
  try {
    const { appId } = data;
    const otp = generateOtp();
    await saveOtp({ otp, appId });

    const cxData = await fetchLoanDataService({ appId });
    const {
      telephones,
      emailAddress,
      applicantFirstName = "",
      applicantLastName = "",
      salesEmail = "",
    } = cxData;
    let { contact: spContactNo } = await fetchSalesPersonDetails(salesEmail);
    if (!spContactNo) {
      spContactNo = "9513138491";
    }
    const mobileNo = telephones[0].telephoneNumber;

    const userData = await getSmsPayload(
      otp,
      mobileNo,
      applicantFirstName,
      applicantLastName,
      spContactNo
    );
    const smsResponse = await sendSms(userData);
    // const mailResponse = await sendEmailToCx("tlpay@byjus.com", [emailAddress], ` Byju's Mobile App Login || OTP`, emailTemplate({ type: 'byjusPay', otp, template: 'loginOtp', applicantFirstName, applicantLastName, spContactNo }))
    const mailResponse = {};
    if (
      smsResponse.includes("SMS send successful.") ||
      mailResponse.statusCode === 202
    ) {
      logger.info(
        `OTP resent successfully for mobileNo - ${mobileNo}, appId - ${appId}`
      );
      return {
        status: "success",
        message: "OTP resent successfully",
      };
    } else {
      logger.info(
        `Error sending OTP for mobileNo - ${mobileNo}, appId - ${appId}`
      );
      return {
        status: "failure",
        message: "Error resending Otp!",
      };
    }
  } catch (error) {
    logger.info("Error with resend OTP service ", error);
    return {
      status: "failure",
      message: error.message || `Error with resend OTP service`,
    };
  }
};

const fetchCxDataOnLogin = async (filter) => {
  logger.info("Inside fetch Loan Data On Login function");
  const response = await Cibil.findOne(filter).sort({ createdAt: -1 }).lean(); // Fetch the most recent application
  return response;
};

const handleUserLoginRocketChatService = async (data) => {
  try {
    const { mobileNo } = data;
    // const canProceed = mobileNo && isValidMobileNo(mobileNo);
    // console.log("inside user service----");
    // console.log({"phoneNumber":mobileNo});
    let usersData = JSON.parse(
      JSON.stringify(await userModel.find({ phoneNumber: mobileNo }))
    );
    // console.log("usersData-------",usersData);
    for (let i = 0; i < usersData.length; i++) {
      let tep = await loginUserToRocketChat(usersData[i]);
      // console.log(tep.data.data);
      // console.log("=================");
      // console.log(usersData[i])
      usersData[i]["LoginDetails"] = tep.data.data;
      let chld = await getChannelList(usersData[i]);
      // console.log(chld.data);
      usersData[i]["channelListDetails"] = chld.data.channels;
    }

    // console.log("-----------------------------------------------------------")
    // console.log(usersData);

    return {
      status: "success",
      message: "Login Successfull",
      data: usersData,
    };
  } catch (error) {
    console.log(error);
    logger.info("Error in handle user login service ", error);
    return {
      status: "failure",
      message: error.message || `Error in handle user login service`,
    };
  }
};

//const

const loginUserToRocketChat = async (ud) => {
  var reqData = JSON.stringify({
    user: ud["emails"][0]["address"],
    password: "RocketChat@123",
  });

  var reqConfig = {
    method: "post",
    url: "http://localhost:3000/api/v1/login",
    headers: {
      "Content-type": "application/json",
    },
    data: reqData,
  };

  return await axios(reqConfig);
};
const getChannelList = async (cl) => {
  var reqConfig = {
    method: "get",
    url: "http://localhost:3000/api/v1/channels.list",
    headers: {
      "X-Auth-Token": cl["LoginDetails"]["authToken"],
      "X-User-Id": cl["LoginDetails"]["userId"],
    },
  };
  return await axios(reqConfig);
};
const createRocketChatUserService = async (data) => {
  let creatRes = new userModel(data);
  let resData = await creatRes.save();
  console.log(resData);
};

const getAllProfilesService = async (phone) => {
  var resultStudentProfile = await ApiClient.STMS(
    "post",
    "/getStudentDetails",
    { phone: phone, countryCode: "+91" },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  let out_value = {
    helplineNumber: "Some Helpline",
    student: [],
    parent: [],
  };
  if (resultStudentProfile) {
    resultStudentProfile.data.result.map((value) => {
      let x = {
        id: value.studentId,
        userName: value.fullName,
        userRole: "Student",
        class: "BYJUs Class",
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
      addNewUser(value.fullName,value.studentId,"Student")
    });
  }
  var resultParentProfile = await ApiClient.STMS(
    "post",
    "/getParentDetails",
    { phone: phone, countryCode: "+91" },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (resultParentProfile) {
      let ret = resultParentProfile.data.result
      let x = {
        id: ret.customerId,
        userName: ret.firstName+" "+ret.lastName,
        userRole: "Parent",
        avatarURL: "String",
        avatarColor: "String",
        avatarTextColor: "String",
        access: {
          type: "String",
          message: "String",
          messageType: "Integer",
        },
        notificationCount: "Integer",
        onBoarded: "Boolean",
      };
      out_value.parent.push(x);
      addNewUser(ret.firstName+" "+ret.lastName,ret.customerId,"Parent")
  }

  return out_value;
};

const getMKAppUsersDetails = async (reqObj) => {
  var reqData = JSON.stringify({
    phone: reqObj["phone"],
    countryCode: reqObj["countryCode"],
  });

  var reqConfig = {
    method: "post",
    url: `${process.env.URL_FOR_MK_APP}${reqObj["url"]}`,
    headers: {
      "Content-type": "application/json",
      clientid: `${process.env.CLIENT_ID}`,
      clientsecret: `${process.env.CLIENT_SECRET}`,
    },
    data: reqData,
  };
  return await axios(reqConfig);
};

const createMKMSStudentRelationService = async (data) => {
  let creatReq = new studentRelationModel(data);
  return await creatReq.save();
};

module.exports = {
  handleUserLoginService,
  resendOtpService,
  handleUserLoginRocketChatService,
  createRocketChatUserService,
  getMKAppUsersDetails,
  createMKMSStudentRelationService,
  getAllProfilesService,
};
