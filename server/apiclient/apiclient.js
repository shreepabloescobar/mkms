const axios = require("axios");

const MKMS = async (method, endpoint, params, headers) => {
  var response;
  if (method == "post") {
    response =  axios
      //.post("http://rnd-mentor-konnect.byjuslabs.com/api/v1"+endpoint, params, headers)
      .post(process.env.SERVER_URL+endpoint, params, headers)
      .then((res) => {
        return { status: 200, data: res.data };
      })
      .catch((err) => {return { status: 400, data: err }});
  } else if (method == "get") {
    response = axios
    .get(process.env.SERVER_URL+endpoint, headers)
    .then((res) => {
      return { status: 200, data: res.data };
    })
    .catch((err) => {return { status: 400, data: err}});
  }
  return response;
};

const STMS = async (method, endpoint, params, headers) => {
  var response;
  if (method == "post") {
    response =  axios
      .post(process.env.STMS_URL+endpoint, params, headers)
      .then((res) => {
        return { status: 200, data: res.data };
      })
      .catch((err) => {return { status: 400, data: err }});
  } else if (method == "get") {
    response = axios
    .get(process.env.STMS_URL+endpoint, headers)
    .then((res) => {
      return { status: 200, data: res.data };
    })
    .catch((err) => {return { status: 400, data: err}});
  }
  return response;
};

const ApiClient = {
  MKMS,
  STMS
};

module.exports = ApiClient;