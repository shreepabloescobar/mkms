const axios = require("axios");
var CryptoJS = require("crypto-js");
const UserModel = require("../models/user_mkms");

const getNewUserValues = () => {
  //return axios.post("some_end_point", {"some+params":"param/val"},{"some+header":"header/val"});
  console.log("Promise called");
  return new Promise((resolve, reject) => {
    resolve({
      data: {
        status: 200,
        result: {
          name: "gagandeep",
          email: "email@email.com",
          phone: "999999999",
        },
      },
    });
  });
};

const createNew = async () => {
  try {
    const returnVal = await getNewUserValues();
    var { name, email, phone } = returnVal.data.result;
    console.log();
    if (returnVal.data.status == 200) {
      console.log("OK");
      UserModel.findOneAndUpdate(
        { email: email },
        {
          name: name,
          email: email,
          phone: phone,
        },
        { upsert: true, new: true },
        (err, doc) => {
          if (err) console.log("User Model Err", err);
          else {
            console.log("Details", name, email, phone);
            axios
              .post(
                process.env.SERVER_URL + "/api/v1/login",
                {
                  user: process.env.ROCKETCHAT_ADMIN,
                  password: process.env.ROCKETCHAT_PASSWORD,
                },
                {
                  headers: {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  },
                }
              )
              .then((res) => {
                console.log("Login Success ",res.data)
                var userId = res.data.data.userId;
                var authToken = res.data.data.authToken;
                var password = CryptoJS.AES.encrypt(
                  email,
                  process.env.SECRET
                ).toString();
                console.log("Details",userId,authToken,password)
                if (res.data.status == "success") {
                  axios
                    .post(
                      process.env.SERVER_URL + "/api/v1/users.create",
                      {
                        name: name,
                        email: email,
                        password: password,
                        username: name,
                      },
                      {
                        headers: {
                          "Content-Type": "application/json",
                          "X-Auth-Token": authToken,
                          "X-User-Id": userId,
                        },
                      }
                    )
                    .then((res) => {
                      console.log("success");
                    })
                    .catch((err) => {
                      console.log("Error in App user creation", err);
                    });
                }
              })
              .catch((err) => {
                console.log("Error in Login", err);
              });
          }
        }
      );
    }
  } catch (err) {
    console.log("Exception ", err);
  }
};

module.exports = {
  createNew,
};
