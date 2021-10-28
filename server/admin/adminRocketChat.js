const ApiClient = require("../apiclient/apiclient");

const adminLogin = async () => {
  const response = await ApiClient.MKMS(
    "post",
    "/login",
    {
      user: process.env.ROCKETCHAT_ADMIN,
      password: process.env.ROCKETCHAT_PASSWORD,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return {
    userId: response.data.data.userId,
    authToken: response.data.data.authToken,
  };
};

const AdminOperations = { adminLogin };

module.exports = AdminOperations;
