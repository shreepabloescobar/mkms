import { ChatList } from "../chatlist/chatList";
import WelcomeScreen from "../welcomescreen/welcomeScreen";

export const switchChatTypes = (type, method, socketConnection) => {
  const chatType = {
    welcome: () => <WelcomeScreen rocketWebSocket={socketConnection} />,
    default: () => (
      <ChatList
        listType={type}
        clickRoom={method}
        rocketWebSocket={socketConnection}
      />
    ),
  };

  return (chatType[type] || chatType.default)();
};
