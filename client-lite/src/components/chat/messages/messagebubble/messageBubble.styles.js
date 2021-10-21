import { makeStyles } from "@material-ui/core";

export const messageBubbleStyles = makeStyles({
  messageContent: {
    padding: 0,
    margin: 0,
    wordBreak: "break-all",
    fontFamily: "Open Sans !important",
  },
  messageRow: {
    display: "flex",
    justifyContent: "flex-end",
  },
  sendersCls: {
    position: "relative",
    marginLeft: "20px",
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "#DCDCDC",
    width: "60%",
    textAlign: "center",
    borderRadius: "5px",
    float: "left",
  },
  receiverCls: {
    position: "relative",
    marginRight: "20px",
    marginBottom: "10px",
    padding: "10px",
    color: "white",
    backgroundColor: "#3f51b5",
    width: "60%",
    textAlign: "center",
    borderRadius: "5px",
    float: "right",
  },
});
