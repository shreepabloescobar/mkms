import { makeStyles } from "@material-ui/core/styles";

export const loginUseStyles = makeStyles(() => ({
  Button: {
    backgroundColor: "#6e78bd",
    "&:hover": {
      backgroundColor: "#6e78bd",
      boxShadow: "none",
    },
    marginTop: "20px",
  },
  heading: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "30px",
    fontWeight: 500,
    textShadow: " 1px 2px lightgrey",
  },
  textfield: {
    marginTop: "20px",
  },
}));
