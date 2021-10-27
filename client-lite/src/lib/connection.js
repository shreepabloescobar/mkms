const { realTimeAPI } = require("api");

const Connection = {
  connect() {
    realTimeAPI.connectToServer().subscribe(
      (res) => console.log("connectToServer", res),
      (err) => console.error(err)
    );
    realTimeAPI.onError((error) => error);
  },

  keepAlive() {
    realTimeAPI.keepAlive().subscribe();
  },

  loginWithToken(authtoken) {
    realTimeAPI.loginWithAuthToken(authtoken);
  },

  callApiMethod(method, params) {
    const resData = realTimeAPI.callMethod(method, ...params).subscribe(
      (res) => console.log(res),
      (err) => console.error(err)
    );
    return resData;
  },

  disconnect() {
    realTimeAPI.disconnect().subscribe((res) => console.log(res));
  },
};

export default Connection;
