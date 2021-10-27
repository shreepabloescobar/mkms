import { Box } from "@material-ui/core";
import { MessageBubble } from "../messagebubble/messageBubble";
import { messageListStyles } from "./messageList.styles";

let messagesArray = [];
const MessageList = (props) => {
  const classes = messageListStyles();
  const { messages } = props;

  if (Array.isArray(messages))
    messagesArray = messages.filter((msg) => msg.msg !== "");
  else messagesArray.push(messages);
  // if (Object.keys(messages).length > 0 && messages.msg)
  //   messagesArray.push(messages);

  return (
    <Box className={classes.root}>
      {messagesArray.map((msg) => (
        <MessageBubble key={msg._id} message={msg.msg} alias={msg.alias} />
      ))}
    </Box>
  );
};

export default MessageList;
