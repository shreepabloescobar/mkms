const moment = require("moment");
const axios = require("axios");

const { OtpTransaction, Cibil } = require("@byjus-orders/nexemplum/lms");

const {
  updateWorkflowStatusService,
  fetchSalesPersonDetails,
  fetchNachType,
  fetchPanPresent,
  fetchProductName,
} = require("./commonServices/dataService");

const BASE_URL = process.env.OTP_VALIDATION_URL;

const updateOtpVerificationStatusService = async (data) => {
  try {
    const { appId } = data;
    await OtpTransaction.updateOne(
      { appId },
      {
        $set: {
          verifiedAt: moment().toDate(),
        },
      }
    );
    return;
  } catch (error) {
    return {
      status: "failure",
      message:
        error.message || `Error with update Otp Verification Status Service`,
    };
  }
};

const validateOtpService = async (data) => {
  const { appId, otp, updatedBy = "customer" } = data;
  const otpData = await OtpTransaction.findOne({ appId }).lean();
  const { updatedAt } = otpData;
  const currentDate = moment().toDate();
  const otpGeneratedTime = moment(currentDate).diff(updatedAt, "minutes");

  if (otpGeneratedTime < 30) {
    if (otpData && otpData.otp === otp) {
      const cxData = await Cibil.findOne({ appId }).lean();
      await updateOtpVerificationStatusService({ appId });

      const { workflowStatus: currentStatus } = cxData;
      if (currentStatus === "initiated") {
        await updateWorkflowStatusService({
          currentStatus,
          nextStatus: "logged_in",
          updatedBy,
          appId,
        });
      }

      const isPanPresent = await fetchPanPresent(cxData);
      const { salesEmail = "", productName = "" } = cxData;
      const updatedProductName = await fetchProductName(productName);
      const salesPersonDetails = await fetchSalesPersonDetails(salesEmail); // Fetching salesperson details
      cxData.salesContact = salesPersonDetails.contact;
      cxData.salesPersonName = salesPersonDetails.salesPersonName;
      cxData.productName = updatedProductName;
      const nachType = await fetchNachType(cxData);
      const data = {
        ...cxData,
        workflowStatus: "logged_in",
        isPanPresent,
        nachTypeSelected: nachType,
      };
      return {
        status: "success",
        message: "Otp verified successfully!",
        data,
      };
    } else {
      return {
        status: "failure",
        message: "Invalid OTP!",
      };
    }
  } else {
    return {
      status: "failure",
      message: "OTP expired!",
    };
  }
};
const headers = {
  "Content-Type": "application/json",
  clientid: process.env.CLIENT_ID,
  clientsecret: process.env.CLIENT_SECRET,
};
const requestOtpService = async (mobileNo) => {
  const returnData = await axios.post(
    BASE_URL + "/user/login",
    {
      mobileNo: mobileNo,
    },
    {
      headers: headers,
    }
  );
  return returnData;
};

const validateOtpServiceN = async (data) => {
  const returnData = axios.post(
    BASE_URL + "/validate/otp",
    {
      appId: data.appId,
      otp: data.OTP,
    },
    {
      headers: headers,
    }
  );
  return returnData;
};

module.exports = {
  updateOtpVerificationStatusService,
  validateOtpService,
  requestOtpService,
  validateOtpServiceN,
};
