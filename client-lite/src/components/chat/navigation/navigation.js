import React, { useState } from "react";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import RestoreIcon from "@material-ui/icons/Restore";
import { Box } from "@material-ui/core";
import { navigationStyles } from "./Navigation.makeStyles";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import HistoryIcon from "@material-ui/icons/History";
//
import { switchChatTypes } from "./showChatTypes";
import Messages from "../messages/messages/messages";
import { takeQueuedChat } from "services/chatServices";

export default function Navigation(props) {
  const classes = navigationStyles();

  //navigation State
  const [navState, setNavState] = useState({
    navigate: "welcome",
    showMessage: false,
    r_id: null,
    r_status: null,
    r_uniqueId: null,
    r_token: null,
  });

  //on show message click handler
  const showMessageHandler = (room_uniqueId, room_token, room_id, status) => {
    setNavState({
      ...navState,
      showMessage: true,
      r_id: room_id,
      r_status: status,
      r_uniqueId: room_uniqueId,
      r_token: room_token,
    });
  };

  const onClickChangeRoomHandler = async () => {
    try {
      await takeQueuedChat(navState.r_id);
      setNavState({
        ...navState,
        navigate: "progress",
        showMessage: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <BottomNavigation
        value={navState.navigate}
        onChange={(event, newValue) => {
          setNavState({
            ...navState,
            navigate: newValue,
            showMessage: false,
          });
        }}
        showLabels
        className={classes.root}
      >
        <BottomNavigationAction
          value="queued"
          label="Queued"
          icon={<RestoreIcon />}
        />
        <BottomNavigationAction
          value="progress"
          label="Progress"
          icon={<DonutLargeIcon />}
        />
        <BottomNavigationAction
          value="history"
          label="History"
          icon={<HistoryIcon />}
        />
      </BottomNavigation>
      <Box
        sx={{
          width: 359,
          height: 345,
        }}
      >
        {navState.showMessage ? (
          <Messages
            roomId={navState.r_id}
            roomStatus={navState.r_status}
            changeRoom={onClickChangeRoomHandler}
            roomToken={navState.r_token}
            rocketWebSocket={props.rocketWebSocket}
          />
        ) : (
          switchChatTypes(
            navState.navigate,
            showMessageHandler,
            props.rocketWebSocket
          )
        )}
      </Box>
    </div>
  );
}
