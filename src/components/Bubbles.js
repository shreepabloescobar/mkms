import React from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    width: "80%",
    backgroundColor: "gray",
    borderRadius: 13,
    color: "white",
    margin: "10px 0px",
    padding: "5px",
  },
});

const Bubble = (props) => {
  const classes = useStyles();
  return (
    <Box sx={{ flexGrow: 1 }} className={classes.root}>
      {props.children}
    </Box>
  );
};

export default Bubble;
