import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ChatProvider from "store/ChatProvider";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core";

const theme = createTheme({
  typography: {
    fontFamily: ["Open Sans", "sans-serif"].join(","),
    fontWeightLight: 300,
    fontWeightRegular: 400,
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <ChatProvider>
      <App />
    </ChatProvider>
  </ThemeProvider>,
  document.getElementById("chatAppRoot")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
