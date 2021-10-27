import React from "react";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import TextField from "@material-ui/core/TextField";
import * as yup from "yup";
import { Box, InputAdornment } from "@material-ui/core";
// import AttachFileSharp from "@material-ui/icons/AttachFileSharp";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { realTimeAPI } from "api";
import { createToken, sendMessage } from "lib/helpers";
import { messageInputStyles } from "./messageInput.styles";
import Cookies from "js-cookie";
import axios from "axios";
import { sendMessageService } from "services/chatServices";

const inputBoxSchema = yup
  .object({
    message: yup.string().required(),
  })
  .required();

export const MessageInput = (props) => {
  const classes = messageInputStyles();
  const { roomId, token, rocketWebSocket } = props;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(inputBoxSchema),
  });

  const onSubmit = (data) => {
    const { message } = data;
    reset();
    const method = "sendMessage";
    const params = [{ _id: createToken(), rid: roomId, msg: message }];
    realTimeAPI.connectToServer().subscribe((res) => console.log(res));
    realTimeAPI.loginWithAuthToken(Cookies.get("auth_token"));
    realTimeAPI
      .callMethod(method, ...params)
      .subscribe((res) => console.log(res));
    realTimeAPI.onMessage((res) => {
      console.log("on messaege res : ", res);
    });
  };

  return (
    <Box className={classes.root}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={classes.message}
          placeholder="Enter something"
          multiline
          name="message"
          variant="standard"
          maxRows={3}
          {...register("message")}
          error={errors.message ? true : false}
          helperText={errors.message ? true : false}
          InputProps={{
            shrink: "true",
            endAdornment: (
              <InputAdornment position="end">
                <IconButton type="submit">
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </form>
    </Box>
  );
};
