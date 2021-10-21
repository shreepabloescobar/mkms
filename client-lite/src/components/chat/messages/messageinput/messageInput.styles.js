import { makeStyles } from "@material-ui/core";

export const messageInputStyles = makeStyles((theme) => ({
  root: {
    alignItems: "center",
    width: "100%",
    borderTop: "1px solid lightgray !important",
  },
  iconButton: {
    transform: "rotate(45deg)",
  },
  message: {
    padding: "15px 1px",
    width: "100%",
    overflow: "hidden",
    borderBottom: "none !important",
    "& .MuiInput-underline:before": {
      borderBottom: "none !important",
    },
    "& .MuiInput-underline:after": {
      borderBottom: "none !important",
    },
  },
}));
