import { useReducer } from "react";

import ChatContext from "./ChatContext";

const defaultChatState = {
  isAuthenticated: false,
  userObject: "",
};

const chatReducer = (state, action) => {
  if (action.type === "AUTH") {
    return {
      isAuthenticated: true,
      userObject: action.userData,
    };
  }

  return defaultChatState;
};

const ChatProvider = (props) => {
  const [chatState, dispatchChatAction] = useReducer(
    chatReducer,
    defaultChatState
  );

  const userLoginHandler = (userData) => {
    dispatchChatAction({ type: "AUTH", userData: userData });
  };

  const chatContext = {
    isAuthenticated: chatState.isAuthenticated,
    userObject: chatState.userObject,
    userLoginHandler: userLoginHandler,
  };

  return (
    <ChatContext.Provider value={chatContext}>
      {props.children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
