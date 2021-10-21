import React from "react";
import Button from "@material-ui/core/Button";
import { assignMentorStyles } from "./assignmentor.styles";

export const AssignMentor = (props) => {
  const classes = assignMentorStyles();

  return (
    <div>
      <Button
        variant="contained"
        size="small"
        color="primary"
        className={classes.margin}
        onClick={props.roomChange}
      >
        Take It
      </Button>
    </div>
  );
};
