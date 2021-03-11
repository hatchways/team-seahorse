import {
  Modal,
  Button,
  TextField,
  Paper,
  makeStyles,
  Typography,
  Box,
  Divider,
  Tooltip,
  Grid,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";

const useStyles = makeStyles(() => ({
  centerAdornment: {
    marginLeft: "50%", // or your relevant measure
  },
  centerText: {
    textAlign: "center",
  },
  paper: {
    outline: "none",
    width: "500px",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#f2f2f2",
  },
  textField: {
    borderRadius: `4px 4px 4px 4px`,
    outline: "none",
    padding: "7px",
    width: "250px",
    backgroundColor: "white",
  },
  textFieldInput: {
    width: "calc(100% - 24px)",
  },
  typography: {
    textAlign: "center",
    display: "block",
  },
  box: {
    marginBottom: "20px",
  },
  h4: {
    textAlign: "center",
    margin: "20px 0 20px 0",
  },
  button: {
    height: 56,
    borderRadius: 28,
    width: 142,
    display: "block",
    margin: "auto",
    marginBottom: "20px",
  },
  footer: {
    textAlign: "center",
    padding: "20px 20px 20px 20px ",
  },
  hyperlink: {
    display: "inline",
    color: "#DF1B1B",
    fontWeight: "bold",
    cursor: "pointer",
  },
}));

const AuthModal = () => {
  const [signingIn, setSigningIn] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [signedIn, setSignedIn] = useState(true);

  useEffect(async () => {
    let results = await fetch("/user/getCurrentUser");
    results = await results.json();

    typeof results.user === "undefined"
      ? setSignedIn(false)
      : setSignedIn(true);
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password.length < 7) {
      alert("Password must be greater than 6");
      return;
    }

    if (name.trim().length === 0 && !signingIn) {
      alert("Name must not be just spaces");
      return;
    }

    //email is handled by the TextField
    if (signingIn) {
      let result = await fetch("/user/login", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      result = await result.json();

      setSignedIn(
        result.user !== undefined && result.user.id !== undefined ? true : false
      );
    } else {
      let result = await fetch("/user/register", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      result = await result.json();

      setSignedIn(
        result.user !== undefined && result.user.id !== undefined ? true : false
      );
    }
  };

  const classes = useStyles();

  return (
    <Modal open={!signedIn}>
      <Paper id="auth-paper" className={classes.paper} elevation={3}>
        <Typography variant="h4" className={classes.h4}>
          {signingIn ? "Sign In" : "Sign Up"}
        </Typography>

        <form onSubmit={submitHandler} style={{ display: "block" }}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            {!signingIn && (
              <Grid item md={"auto"} >
                <Box className={classes.box}>
                  <Typography variant="h6" className={classes.typography}>
                    Your Name:{" "}
                  </Typography>

                  <Tooltip title="Enter your name" placement="right-start">
                    <TextField
                      className={classes.textField}
                      placeholder="Name"
                      required={true}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                  </Tooltip>
                </Box>
              </Grid>
            )}
            <Grid item>
              <Box className={classes.box}>
                <Typography variant="h6" className={classes.typography}>
                  Your email:{" "}
                </Typography>

                <Tooltip title="Enter your email" placement="right-start">
                  <TextField
                    className={classes.textField}
                    placeholder="Email"
                    required={true}
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </Tooltip>
              </Box>
            </Grid>

            <Grid item>
              <Box className={classes.box}>
                <Typography variant="h6" className={classes.typography}>
                  Your Password:{" "}
                </Typography>

                <Tooltip
                  title="Enter at least 7 characters"
                  placement="right-start"
                >
                  <TextField
                    error={password.trim().length === 0 ? true : false}
                    className={classes.textField}
                    placeholder="Password"
                    required={true}
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </Tooltip>
              </Box>
            </Grid>

            <Grid item>
              <Box>
                <Button
                  className={classes.button}
                  color="primary"
                  variant="contained"
                  type="submit"
                >
                  {signingIn ? "Login" : "Register"}
                </Button>
              </Box>
            </Grid>

            <Divider />

            <Grid item>
              <Box className={classes.footer}>
                <Typography variant="subtitle2">
                  {signingIn ? " Not a member?" : "Already a Member?"}
                  <Typography
                    className={classes.hyperlink}
                    onClick={() => {
                      setSigningIn(!signingIn);
                    }}
                  >
                    {signingIn ? " Sign Up" : " Sign In"}
                  </Typography>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Modal>
  );
};

export default AuthModal;
