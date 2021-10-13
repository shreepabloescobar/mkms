import React from "react";
import { Avatar, Box, Typography } from "@material-ui/core";
import { BubbleboxStyles } from "./BubbleboxStyle";

export const RecieverMessage = (props) => {
  const message = props.message;
  const timestamp = props.timestamp;
  // const photoURL = props.photoURL ? props.photoURL : "dummy.js";
  const displayName = props.displayName;
  const classes = BubbleboxStyles();

  return (
      <Box className={classes.messageRow}>
        {/* <Avatar
          alt={displayName}
          className={classes.orange}
          src={photoURL}
        ></Avatar> */}
        <Box>
          <Typography className={classes.displayName}>{displayName}</Typography>
          <Box className={classes.messageBlue}>
              <Typography className={classes.messageContent}>{message}</Typography>
            <Typography className={classes.messageTimeStampRight}>{timestamp}</Typography>
          </Box>
        </Box>
      </Box>
  );
};

export const SenderMessage = (props) => {
  const classes = BubbleboxStyles();
  const message = props.message;
  const timestamp = props.timestamp;
  
  return (
    <Box className={classes.messageRowRight}>
      <Box className={classes.messageOrange}>
        <Typography className={classes.messageContent}>{message}</Typography>
        <Typography className={classes.messageTimeStampRight}>{timestamp}</Typography>
      </Box>
    </Box>
  );
};