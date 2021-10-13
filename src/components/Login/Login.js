import React, { useContext, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Container,
  Typography,
  CircularProgress,
  Grid,
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import ChatContext from "store/ChatContext";
import { loginUseStyles } from "./loginStyles";
import { loginSchema } from "./loginValidation";
import { login } from "api";
import { getUserData } from "helperFucntions";

const Login = (props) => {
  const classes = loginUseStyles();
  const [isLoading, setIsLoading] = useState(false);
  const { userLoginHandler } = useContext(ChatContext);
  const [loginError, setLoginError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const loginHandler = async (useremail, password) => {
    try {
      setLoginError(null);
      setIsLoading(true);

      const userObject = await login(useremail, password);
      const userData = getUserData(userObject);
      userLoginHandler(userData);
      setIsLoading(false);
    } catch (error) {
      setLoginError(error.message);
      setIsLoading(false);
    }
  };

  const onSubmit = (data) => {
    setIsLoading(true);
    const { email, password } = data;
    reset();
    loginHandler(email, password);
    props.login(true);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "10vh" }}
      >
        <Typography align="center" color="error">
          {loginError}
        </Typography>
      </Grid>
      <Typography align="center" variant="h6" className={classes.heading}>
        Login
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TextField
          margin="normal"
          id="email"
          label="Email Address"
          name="email"
          variant="outlined"
          className={classes.textfield}
          {...register("email")}
          error={errors.email ? true : false}
          helperText={errors.email?.message}
        />
        <TextField
          margin="normal"
          name="password"
          label="Password"
          type="password"
          id="password"
          variant="outlined"
          {...register("password")}
          error={errors.password ? true : false}
          helperText={errors.password?.message}
        />
        {isLoading ? (
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: "10vh" }}
          >
            <CircularProgress />
          </Grid>
        ) : (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.Button}
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        )}
      </Box>
    </Container>
  );
};
export default Login;
