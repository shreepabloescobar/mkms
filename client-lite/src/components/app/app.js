import React, { useContext, useEffect, useState } from "react";
import ChatIcon from "@material-ui/icons/Chat";
import { Popover, Box, Fab } from "@material-ui/core";
//
import { useStyles } from "./app.styles";
import Login from "components/auth/login";
import Chat from "components/chat";
import ChatContext from "store/ChatContext";
import Cookies from "js-cookie";
import { rocketChatUrl } from "api";
import { createToken } from "lib/helpers";

function App(props) {
  const rocketWebSocket = new WebSocket(rocketChatUrl);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isAuthenticated } = useContext(ChatContext);

  useEffect(() => {
    const authToken = Cookies.get("auth_token");
    if (authToken && !isLoggedIn) {
      setIsLoggedIn(true);

      //Connecting to websocket on app launch
      rocketWebSocket.onopen = () => {
        console.log("connected to server");
        rocketWebSocket.send(
          JSON.stringify({
            msg: "connect",
            version: "1",
            support: ["1", "pre2", "pre1"],
          })
        );

        //login to server through websocket
        rocketWebSocket.send(
          JSON.stringify({
            msg: "method",
            method: "login",
            id: createToken(),
            params: [{ resume: Cookies.get("auth_token") }],
          })
        );
      };
    }
  }, [isAuthenticated]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlerLogin = (loggedIn) => {
    setIsLoggedIn(loggedIn);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Box className={classes.root}>
      <Fab aria-describedby={id} color="primary" aria-label="add">
        <ChatIcon onClick={handleClick} />
      </Fab>
      <Popover
        className={classes.popOverStyle}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={{ top: 45, left: 920 }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {!isLoggedIn ? (
          <Login login={handlerLogin} />
        ) : (
          <Chat rocketWebSocket={rocketWebSocket} />
        )}
      </Popover>
    </Box>
  );
}

export default App;
