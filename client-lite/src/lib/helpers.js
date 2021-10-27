import Cookies from "js-cookie";

export const getUserData = (userObject) => {
  return {
    authToken: userObject.authToken,
    userId: userObject.userId,
    username: userObject.name ? userObject.name : userObject.me.name,
    email: userObject.emails
      ? userObject.emails[0].address
      : userObject.me.emails[0].address,
    status: userObject.status ? userObject.status : userObject.me.status,
  };
};

export const getTokenfromCookie = () => {
  const authToken = Cookies.get("auth_token");
  const userId = Cookies.get("user_id");
  const headers = {
    "X-Auth-Token": authToken,
    "X-User-Id": userId,
  };
  return { headers, userId: userId };
};

export const createToken = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export const storeTokenInCookie = (token, userId) => {
  Cookies.set("auth_token", token, {
    expires: 1,
    path: "/",
    secure: true,
    domain: "localhost",
  });
  Cookies.set("user_id", userId, {
    expires: 1,
    path: "/",
    secure: true,
    domain: "localhost",
  });
};

export const filterQueuedRooms = (inquiries) => {
  const chatlist = inquiries.inquiries.map((list) => {
    return {
      _id: list._id,
      name: list.name,
      token: list.v.token,
      roomId: list.rid,
      status: list.status,
    };
  });
  return chatlist;
};

export const filterInProgressRooms = (chatListData) => {
  const filteredData = chatListData.filter((list) => list.t === "l");
  console.log(filteredData);
  const chatlist = filteredData.map((list) => {
    return {
      _id: list._id,
      name: list.fname,
      token: list.v.token,
      roomId: list.lastMessage.rid,
    };
  });

  return chatlist;
};

export const filterRooms = (oldRoomsData, roomType = "") => {
  let filteredData;
  filteredData =
    roomType === ""
      ? oldRoomsData.filter((list) => list.closedBy)
      : oldRoomsData.filter((list) => list.servedBy);

  const oldRoomsList = filteredData.map((list) => {
    return {
      _id: list._id,
      name: list.fname,
      token: list.v.token,
      roomId: list.v._id,
      closedAt: list.closedAt,
    };
  });
  return oldRoomsList;
};

export const mustConnectFirst = (rocketWebSocket) => {
  rocketWebSocket.send(
    JSON.stringify({
      msg: "connect",
      version: "1",
      support: ["1", "pre2", "pre1"],
    })
  );
  rocketWebSocket.send(
    JSON.stringify({
      msg: "method",
      method: "login",
      id: createToken(),
      params: [{ resume: Cookies.get("auth_token") }],
    })
  );
};

export const subscribeToStream = (rocketWebSocket, roomId) => {
  rocketWebSocket.send(
    JSON.stringify({
      msg: "sub",
      id: createToken(),
      name: "stream-room-messages",
      params: [roomId, false],
    })
  );
};

export const sendMessage = (rocketWebSocket, roomId, roomToken, message) => {
  rocketWebSocket.send(
    JSON.stringify({
      msg: "method",
      method: "sendMessage",
      id: createToken(),
      params: [{ _id: roomToken, rid: roomId, msg: message }],
    })
  );
};
