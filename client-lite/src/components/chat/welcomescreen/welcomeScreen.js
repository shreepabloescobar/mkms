import React, { useEffect } from "react";
import { Typography } from "@material-ui/core";
import { createToken } from "lib/helpers";
import Cookies from "js-cookie";

const WelcomeScreen = (props) => {
  return (
    <Typography variant="h6" align="center">
      Welcome To MentorKonnext
    </Typography>
  );
};

export default WelcomeScreen;
