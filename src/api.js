import axios from "axios";
//
import {
  AGENT_INFO,
  LIVECHAT_MESSAGES_API,
  LIVECHAT_QUEUED_CHATS_API,
  LIVECHAT_ROOMS_API,
  LOGIN_API,
} from "fileConstants";

function getTokenfromStorage() {
  const authToken = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");
  const headers = {
    "X-Auth-Token": authToken,
    "X-User-Id": userId,
  };
  return { headers, userId: userId };
}

/**
 * Authentication API function
 * @param {email} useremail
 * @param {password} password
 * @returns
 */
export const login = async (useremail, password) => {
  const userBody = { user: useremail, password: password };

  try {
    const response = await axios.post(
      process.env.REACT_APP_ROCKETCHAT_BASE_API_URL + LOGIN_API,
      userBody
    );

    const { authToken, userId } = response.data.data;

    localStorage.setItem("authToken", authToken);
    localStorage.setItem("userId", userId);

    return response.data.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Get Queued Chats
 * @returns roomData
 */
export const getQueuedChats = async () => {
  const { headers } = getTokenfromStorage();
  try {
    const response = await axios.get(
      process.env.REACT_APP_ROCKETCHAT_BASE_API_URL + LIVECHAT_QUEUED_CHATS_API,
      {
        headers: headers,
      }
    );
    const roomData = response.data;
    return roomData;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Get Livechat rooms data
 * @param {} token
 * @param {*} usedId
 * @param {*} roomId
 * @param {*} roomToken
 * @returns
 */

export const getLiveChatRooms = async () => {
  const { headers } = getTokenfromStorage();
  try {
    const response = await axios.get(
      process.env.REACT_APP_ROCKETCHAT_BASE_API_URL + LIVECHAT_ROOMS_API,
      {
        headers: headers,
      }
    );
    const roomData = response.data;
    return roomData;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Get Messages
 * @param {*} roomId
 * @param {*} roomToken
 * @returns
 */
export const getLiveChatMessages = async (roomId, roomToken) => {
  const { headers } = getTokenfromStorage();
  try {
    const response = await axios.get(
      process.env.REACT_APP_ROCKETCHAT_BASE_API_URL +
        LIVECHAT_MESSAGES_API +
        roomId +
        `?token=` +
        roomToken,
      {
        headers: headers,
      }
    );
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

/**
 * Get Agent Information
 * @returns userData
 */
export const getAgentInformation = async () => {
  const { headers, userId } = getTokenfromStorage();

  try {
    const response = await axios.get(
      process.env.REACT_APP_ROCKETCHAT_BASE_API_URL + AGENT_INFO + userId,
      {
        headers: headers,
      }
    );
    const user = response.data.user;
    return user;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
