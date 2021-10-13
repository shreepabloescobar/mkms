import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import * as yup from "yup";
import { Box, InputAdornment } from "@material-ui/core";
// import AttachFileSharp from "@material-ui/icons/AttachFileSharp";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const useStyles = makeStyles((theme) => ({
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

const inputBoxSchema = yup
  .object({
    message: yup.string().required(),
  }).required();

export const ChatInput = (props) => {
  const classes = useStyles();
  const { roomId, roomToken } = props;

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
    const messageObj = {
      msg: message,
      token: roomToken,
      rid: roomId,
    };

    axios
      .post("http://localhost:3000/api/v1/livechat/message", messageObj)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
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
              <InputAdornment>
                <IconButton type="submit">
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {/* <TextField
          className={classes.message}
          placeholder="Enter something"
          multiline
          maxRows={3}
          // value={message.content}
          name="message"
          variant="standard"
          // onChange={(event) => {
          //   setMessage({ ...message, ...{ msg: event.target.value } });
          // }}
          InputProps={{
            shrink: "true",
            endAdornment: (
              <InputAdornment>
                <IconButton type="file">
                  <AttachFileSharp
                    className={classes.iconButton}
                    onClick={handleClick}
                  />
                  <input
                    type="file"
                    ref={hiddenFileInput}
                    onChange={handleChange}
                    style={{ display: "none" }}
                  />
                </IconButton>
                <IconButton type="submit">
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        /> */}
      </form>
    </Box>
  );
};
