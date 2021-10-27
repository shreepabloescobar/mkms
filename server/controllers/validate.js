const jwt = require("jsonwebtoken");

const {
  validateOtpService,
  requestOtpService,
  validateOtpServiceN,
} = require("../service/validateService");
const logger = require("../service/logger")("Validate controller");

const validateOtp = async (req, res) => {
  try {
    const { appId = "" } = req.body || {};
    const response = await validateOtpService(req.body);

    if (response.status === "success") {
      logger.info(`validate otp successfull for appId : ${appId}`);
      return res.status(200).json(response);
    } else {
      logger.info(`Error while validating otp for appId : ${appId}`);
      return res.status(400).json(response);
    }
  } catch (error) {
    logger.info(`Error while validating otp, ${error}`);
    return res.status(400).json({
      status: "failure",
      message: error.message || "OTP verification Failed!",
    });
  }
};

const doOtpLogin = async (req, res) => {
  try {
    const mobileNo = req.body.MobileNumber;
    const countryCode = req.body.countryCode;

    requestOtpService(mobileNo).then((response) => {
      if (response.data.status == "failure") {
        return res.status(401).json({
          errorCode: 401,
          errorDesc: "Unauthorized",
          errorDetails: "OTP Sending Failed!",
        });
      } else if (response.data.status == "success") {
        logger.info(`Success otp sent to user mobile ${mobileNo}`);
        return res
          .status(200)
          .json({ status: "success", appId: response.data.data.appId });
      } else {
        logger.info(`Error sending otp`);
        return res.status(400).json({
          status: "failure",
          message: "OTP Sending Failed!",
        });
      }
    });
  } catch (error) {
    console.log("Error", error.message);
    res.status(400).json({
      status: "failure",
      message: "Failed",
    });
  }
};

const validateOtpOnLogin = async (req, res) => {
  //   try {
  //     const data = req.body;
  //     validateOtpServiceN(data)
  //       .then((response) => {
  //         if (response.data.status == "success") {
  //           logger.info(
  //             `Success otp sent to user mobile ${req.body.MobileNumber}`
  //           );
  //           /*
  //                 Add encryption token based on mobile number
  //                 and send token back to user
  //             */
  //         } else {
  //           logger.info(`Error sending otp`);
  //           return res.status(400).json(response.data.status);
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         console.log("Error", err.message);
  //         res.status(400).json({
  //           status: "failure",
  //           message: "Failed",
  //         });
  //       });
  //   } catch (err) {
  //     console.log(err);
  //     console.log("Error Catch", err.message);
  //     res.status(400).json({
  //       status: "failure",
  //       message: "Failed",
  //     });
  //   }
  var token = jwt.sign(
    {
      user: req.body.MobileNumber,
    },
    process.env.SECRET,
    { expiresIn: '24h' }
  );
  return res.status(200).json({ status:"Success", user: req.body.MobileNumber, token: token });
};

module.exports = {
  validateOtp,
  doOtpLogin,
  validateOtpOnLogin,
};
