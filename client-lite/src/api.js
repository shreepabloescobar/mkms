import { RealTimeAPI } from "rocket.chat.realtime.api.rxjs";

const host = process.env.NODE_ENV === "development" ? "localhost:3000" : null;
const useSsl = process.env.NODE_ENV === "development" ? "ws" : "wss";
const url = `${useSsl}://${host}/websocket`;

export const rocketChatUrl = url;
export const realTimeAPI = new RealTimeAPI(url);
