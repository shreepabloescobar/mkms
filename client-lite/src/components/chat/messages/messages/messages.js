import { useCallback, useEffect, useState } from "react";
import { Box } from "@material-ui/core";
//
import MessageList from "../messagelist/messageList";
import { messageBoxStyles } from "./message.styles";
import { MessageInput } from "../messageinput/messageInput";
//
import { createToken, mustConnectFirst, subscribeToStream } from "lib/helpers";
import { AssignMentor } from "../assignmentor/assignmentor";
import { getHistoryMessages } from "services/chatServices";

const Messages = (props) => {
  const classes = messageBoxStyles();
  const { roomId, roomToken, roomStatus, changeRoom, rocketWebSocket } = props;
  const [msgState, setMsgState] = useState({
    msgs: [],
    loaded: false,
  });

  let streamRoomParams = JSON.stringify({
    msg: "sub",
    id: roomId,
    name: "stream-room-messages",
    params: [roomId, false],
  });

  console.log(rocketWebSocket);
  console.log(msgState.loaded);

  const getOldMessages = async () => {
    try {
      const oldMessages = await getHistoryMessages(roomId, roomToken);
      console.log(oldMessages);
      setMsgState({
        ...msgState,
        msgs: oldMessages,
        loaded: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!msgState.loaded) {
      getOldMessages();
    } else {
      rocketWebSocket.send(streamRoomParams);
      rocketWebSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data);

        if (data.msg === "ping") {
          rocketWebSocket.send(
            JSON.stringify({
              msg: "pong",
            })
          );
        }

        if (data.msg === "changed") {
          data.fields.args.map((msg) => {
            setMsgState({
              ...msgState,
              msgs: msg,
              loaded: true,
            });
          });
        }

        if (data.msg === "nosub") {
          rocketWebSocket.send(
            JSON.stringify({
              msg: "sub",
              id: roomId,
              name: "stream-room-messages",
              params: ["__my_messages__", false],
            })
          );
        }
        if (data.msg === "error" && data.reason === "Must connect first") {
          mustConnectFirst(rocketWebSocket);
          subscribeToStream(rocketWebSocket, roomId);
        }
      };
    }

    rocketWebSocket.onerror = (err) => {
      console.log(err);
    };
  }, [roomId, msgState.msgs]);

  return (
    <>
      <Box className={classes.root}>
        <MessageList key={createToken()} messages={msgState.msgs} />
      </Box>
      {roomStatus !== "queued" ? (
        <MessageInput
          roomId={roomId}
          roomToken={roomToken}
          rocketWebSocket={rocketWebSocket}
        />
      ) : (
        <AssignMentor roomChange={changeRoom} />
      )}
    </>
  );
};

export default Messages;
