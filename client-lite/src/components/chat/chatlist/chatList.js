import React, { useEffect, useState } from "react";
import List from "@material-ui/core/List";
import { Grid } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
//
import { chatListStyles } from "./chatList.styles";
import { CircularProgress, ListItemIcon } from "@material-ui/core";
import { getLiveChatRooms, getQueuedChats } from "services/chatServices";
import { Typography } from "@material-ui/core";

export const ChatList = (props) => {
  const classes = chatListStyles();
  const [roomInquiries, setRoomInquiries] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const { listType, clickRoom } = props;
  let response;

  const getListData = async () => {
    switch (listType) {
      case "queued":
        setShowLoader(true);
        response = await getQueuedChats();
        setRoomInquiries(response);
        setShowLoader(false);
        break;

      case "progress":
        setShowLoader(true);
        let isRoomOpen = "?open=true";
        response = await getLiveChatRooms(isRoomOpen);
        setRoomInquiries(response);
        setShowLoader(false);
        break;

      case "history":
        setShowLoader(true);
        response = await getLiveChatRooms();
        setRoomInquiries(response);
        setShowLoader(false);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    getListData();
  }, [listType]);

  return (
    <div className={classes.root}>
      <List component="nav">
        {!showLoader ? (
          roomInquiries.map((room) => (
            <ListItem
              key={room._id}
              button
              onClick={() =>
                clickRoom(room._id, room.token, room.roomId, room.status)
              }
            >
              <ListItemIcon>
                <Avatar />
              </ListItemIcon>
              <ListItemText primary={room.name} />
            </ListItem>
          ))
        ) : (
          <Grid container justifyContent="center" alignItems="center">
            <CircularProgress />
          </Grid>
        )}
        {roomInquiries.length === 0 ? (
          <Typography variant="h6" align="center">
            Silence is Golden !!
          </Typography>
        ) : (
          ""
        )}
      </List>
    </div>
  );
};
