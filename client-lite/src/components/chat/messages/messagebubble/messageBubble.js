import { Typography } from "@material-ui/core";
//
import { Box } from "@material-ui/core";
import { messageBubbleStyles } from "./messageBubble.styles";

export const MessageBubble = (props) => {
  const classes = messageBubbleStyles();
  const { message, alias } = props;
  const boxClass = alias ? classes.sendersCls : classes.receiverCls;

  return (
    <Box className={boxClass}>
      <Typography className={classes.messageContent}>{message}</Typography>
    </Box>
  );
};
