import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Avatar } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
//
import { getLiveChatRooms, getQueuedChats } from "api";
import { CHAT_HISTORY, CHAT_IN_PROGRESS, QUEUED_CHATS } from "fileConstants";

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export const ChatInQueue = (props) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [liveChatList, setLiveChatList] = useState([]);

  const getSortedProgressList = (list, type) => {
    const sortedProgressRoomsList = [];
    list.rooms.map((listData) => {
      if (type === "progress") {
        if (listData.servedBy && listData.open) {
          sortedProgressRoomsList.push(listData);
        }
      } else {
        if (!listData.open) {
          sortedProgressRoomsList.push(listData);
        }
      }
    });

    return sortedProgressRoomsList;
  };

  useEffect(() => {
    try {
      switch (props.chatType) {
        case QUEUED_CHATS:
          setIsLoading(true);
          getQueuedChats()
            .then((response) => {
              setLiveChatList(response.inquiries);
              console.log(response.inquiries);

              setIsLoading(false);
            })
            .catch((err) => console.log(err));
          break;

        case CHAT_IN_PROGRESS:
          setIsLoading(true);
          getLiveChatRooms()
            .then((response) => {
              const sortedRooms = getSortedProgressList(response, "progress");
              setLiveChatList(sortedRooms);
              console.log(sortedRooms);
              setIsLoading(false);
            })
            .catch((err) => console.log(err));
          break;

        case CHAT_HISTORY:
          setIsLoading(true);
          getLiveChatRooms()
            .then((response) => {
              const sortedRooms = getSortedProgressList(response, "history");
              setLiveChatList(sortedRooms);
              console.log(sortedRooms);
              setIsLoading(false);
            })
            .catch((err) => console.log(err));
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }, [props.chatType]);

  const queuedList = liveChatList.map((liveChatQueueList, index) => {
    return (
      <List
        component="div"
        onClick={() =>
          props.chatClick(
            liveChatQueueList.rid
              ? liveChatQueueList.rid
              : liveChatQueueList.lastMessage.rid,
            liveChatQueueList.v.token
          )
        }
        key={liveChatQueueList._id}
      >
        <ListItem button className={classes.nested}>
          <ListItemIcon>
            <Avatar
              alt={
                liveChatQueueList.name
                  ? liveChatQueueList.name
                  : liveChatQueueList.fname
              }
              src=""
            />
          </ListItemIcon>
          <ListItemText
            primary={
              liveChatQueueList.name
                ? liveChatQueueList.name
                : liveChatQueueList.fname
            }
          />
        </ListItem>
      </List>
    );
  });

  return isLoading ? <CircularProgress /> : <>{queuedList}</>;
};
