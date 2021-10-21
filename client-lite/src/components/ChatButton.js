import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ChatIcon from "@material-ui/icons/Chat";
import { Popover, Box, Fab } from "@material-ui/core";
import { ChatTabs } from "./ChatTabs";
import Login from "./auth/login";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiFab-primary": {
      position: "fixed",
      bottom: 20,
      right: 20,
    },
  },
  popOverStyle: {
    "& .MuiPopover-paper": {
      height: 520,
      width: 361,
      borderRadius: 10,
      position: "relative",
    },
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function ChatButton() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) setIsLoggedIn(true);
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlerLogin = (token) => {
    if (token) setIsLoggedIn(true);
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
        {/* <Login login={handlerLogin} /> */}
        {!isLoggedIn ? <Login login={handlerLogin} /> : <ChatTabs />}
      </Popover>
    </Box>
  );
}
