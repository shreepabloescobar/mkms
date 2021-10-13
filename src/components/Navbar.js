import React, { useContext } from "react";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import { Toolbar } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { IconButton } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
//
import ChatContext from "store/ChatContext";

const Navbar = () => {
  const chatContext = useContext(ChatContext);
  const { username } = chatContext.userObject;

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton size="medium" edge="start" color="inherit" sx={{ mr: 2 }}>
            <Avatar alt={username} src="" />
          </IconButton>
          <Typography sx={{ flexGrow: 1 }}> {username}</Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
