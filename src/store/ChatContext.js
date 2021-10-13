import React from "react";

const ChatContext = React.createContext({
  isAuthenticated: "",
  userObject: "",
  userLoginHandler: (userData) => {},
});

export default ChatContext;
