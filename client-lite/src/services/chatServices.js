import axios from "axios";
import {
  LIVECHAT_MESSAGES_API,
  LIVECHAT_QUEUED_CHATS_API,
  LIVECHAT_ROOMS_API,
  SEND_MESSAGE,
  TAKE_QUEUE_CHAT,
} from "lib/constants";
import {
  filterQueuedRooms,
  filterRooms,
  getTokenfromCookie,
} from "lib/helpers";

/**
 * Get Queued Chats
 * @returns roomData
 */
export const getQueuedChats = async () => {
  const { headers } = getTokenfromCookie();
  try {
    const response = await axios.get(
      process.env.REACT_APP_ROCKETCHAT_BASE_API_URL + LIVECHAT_QUEUED_CHATS_API,
      {
        headers: headers,
      }
    );
    const roomData = response.data;
    const filteredQueueRooms = filterQueuedRooms(roomData);
    return filteredQueueRooms;
  } catch (error) {
    return Promise.reject(error.response);
  }
};

/**
 * Get Old Rooms Data
 * @returns
 */
export const getLiveChatRooms = async (roomType = "") => {
  const { headers } = getTokenfromCookie();
  try {
    const response = await axios.get(
      process.env.REACT_APP_ROCKETCHAT_BASE_API_URL +
        LIVECHAT_ROOMS_API +
        roomType,
      {
        headers: headers,
      }
    );
    const roomData = response.data;
    const oldRooms = filterRooms(roomData.rooms, roomType);
    return oldRooms;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const takeQueuedChat = async (inquiryId) => {
  const { headers } = getTokenfromCookie();
  try {
    await axios.post(
      process.env.REACT_APP_ROCKETCHAT_BASE_API_URL + TAKE_QUEUE_CHAT,
      { inquiryId: inquiryId },
      {
        headers: headers,
      }
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

export const sendMessageService = async (params) => {
  const { headers } = getTokenfromCookie();
  try {
    const response = await axios.post(
      process.env.REACT_APP_ROCKETCHAT_BASE_API_URL + SEND_MESSAGE,
      params,
      {
        headers: headers,
      }
    );
    console.log(response);
  } catch (error) {
    // console.llog()
    throw new Error(error.message);
  }
};

export const getHistoryMessages = async (room_id, room_token) => {
  try {
    const response = await axios.get(
      process.env.REACT_APP_ROCKETCHAT_BASE_API_URL +
        LIVECHAT_MESSAGES_API +
        room_id +
        "?token=" +
        room_token
    );
    return response.data.messages;
  } catch (error) {
    throw new Error(error.message);
  }
};
