const StudentRelationModel = require("../../models/studentRelation");
const AdminOperations = require("../../admin/adminRocketChat");
const ApiClient = require("../../apiclient/apiclient");
const hashPassword = require("../../middlewares/auth");

const addNewUser = async (name, id, type) => {
  var status;
  try {
    const rc_user_id = id + "@byjus-student-rc.com";
    let data = await StudentRelationModel.find({ premium_id: id });
    if (data.length != 0) {
      // console.log("User Exists in DB", data[0].on_board);
      status = data[0].on_board;
    } else {
      const adminCreds = await AdminOperations.adminLogin();
      const response = await ApiClient.MKMS(
        "post",
        "/users.create",
        {
          name: name,
          email: rc_user_id,
          password: hashPassword.hashPassword(rc_user_id),
          username: name.split(" ")[0] + "_" + id,
          roles: ["user"],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": adminCreds.authToken,
            "X-User-Id": adminCreds.userId,
          },
        }
      );
      if (response.data.user._id) {
        let newUser = {
          rocketchat_user_id: response.data.user["_id"],
          premium_id: id,
          user_type: type,
        };
        await StudentRelationModel.create(newUser);
      }
      status = false;
    }
  } catch (err) {
    console.log("-------in catch----");
    console.log(err);
  }
  return status;
};

module.exports = addNewUser;
