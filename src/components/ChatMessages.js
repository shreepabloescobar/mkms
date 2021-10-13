import axios from "axios";
import React, { useState, useEffect } from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

import { ChatInput } from "./ChatInput";
import { RecieverMessage, SenderMessage } from "./Bubblebox";
import { LIVECHAT_MESSAGES_API } from "fileConstants";

const useStyles = makeStyles({
  left: {
    width: "68%",
    backgroundColor: "lightgray",
    borderRadius: 8,
    color: "black",
    margin: "10px 0px",
    padding: "5px 10px",
  },
  right: {
    width: "68%",
    backgroundColor: "gray",
    borderRadius: 15,
    color: "white",
    padding: "5px 10px",
    marginLeft: 70,
  },
  abc: {
    overflow: "auto !important",
    height: 280,
  },
  xyz: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    padding: "0px 10px",
  },
});

export const ChatMessages = (props) => {
  const classes = useStyles();
  const { roomId, roomToken } = props;
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_ROCKETCHAT_BASE_API_URL +
          LIVECHAT_MESSAGES_API +
          roomId +
          `?token=${roomToken}`
      )
      .then((res) => {
        setData(res.data.messages);
      })
      .catch((err) => {
        console.log(err);
        // throw new Error(err);
      });
  }, [roomId, roomToken]);

  const newData = data.filter((item) => item.groupable !== false).reverse();

  return (
    <>
      <Box className={classes.abc}>
        {newData?.map((msg) => {
          if (msg.alias) {
            return (
              <SenderMessage
                message={msg.msg}
                timestamp={moment(msg.ts).format("LT")}
                displayName={msg.u.name}
              />
            );
          } else {
            return (
              <RecieverMessage
                message={msg.msg}
                timestamp={moment(msg.ts).format("LT")}
                displayName={msg.u.name}
              />
            );
          }
        })}
      </Box>
      <Box className={classes.xyz}>
        <ChatInput roomId={roomId} roomToken={roomToken} />
      </Box>
    </>
  );
};
