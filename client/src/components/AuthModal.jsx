import {
  Modal,
  Button,
  TextField,
  Paper,
  makeStyles,
  Typography,
  Divider,
  Tooltip,
  Grid,
} from "@material-ui/core";
import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { userContext as context } from "../providers/UsersProvider";
import ErrorAlert from "./ErrorAlert";

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

const AuthModal = ({ isAuthPage }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [signedIn, setSignedIn] = useState(true);
  const [isError, setIsError] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();
  const userContext = useContext(context);

  const { pathname } = location;
  const { login, register, getCurrentUser, openSnackbar } = userContext;

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    const results = await getCurrentUser();

    if (!results.user) {
      setSignedIn(false);
    } else {
      setSignedIn(true);
      history.push("/dashboard");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (pathname === "/signup") {
      if (password.length < 7) {
        openSnackbar("error", "Password must be greater than 6");
        return;
      }

      if (name.trim().length === 0) {
        openSnackbar("error", "Name must not be just spaces");
        return;
      }
    }

    try {
      let error = false;

      if (pathname === "/sign-up") {
        let result = await register(name, email, password);

        if (result.error) {
          openSnackbar("error", result.error.msg);
          error = true;
        }

        setSignedIn(
          result.user !== undefined && result.user.id !== undefined
            ? true
            : false
        );
      } else {
        const result = await login(email, password);

        if (result.error) {
          openSnackbar("error", result.error.msg);
          error = true;
        }

        setSignedIn(
          result.user !== undefined && result.user.id !== undefined
            ? true
            : false
        );
      }

      if (error === false) {
        history.push("/dashboard");
      }
    } catch (error) {
      openSnackbar("error", "Something went wrong on our part, sorry!");
      console.error(error);
    }
  };

  return (
    <>
      {signedIn ? null : (
        <Modal open={!signedIn} hideBackdrop={isAuthPage}>
          <Paper id="auth-paper" className={classes.paper} elevation={3}>
            <Typography variant="h4" className={classes.h4}>
              {pathname === "/sign-up" ? "Sign Up" : "Sign In"}
            </Typography>

            <form onSubmit={submitHandler} style={{ display: "block" }}>
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
              >
                <ErrorAlert message={alertMessage} visible={isError} />

                {pathname === "/sign-up" && (
                  <Grid item md={"auto"} className={classes.box}>
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
                  </Grid>
                )}
                <Grid item className={classes.box}>
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
                </Grid>

                <Grid item className={classes.box}>
                  <Typography variant="h6" className={classes.typography}>
                    Your Password:
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
                </Grid>

                <Grid item>
                  <Button
                    className={classes.button}
                    color="primary"
                    variant="contained"
                    type="submit"
                  >
                    {pathname === "/sign-up" ? "Register" : "Login"}
                  </Button>
                </Grid>

                <Divider />

                <Grid item className={classes.footer}>
                  <Typography variant="subtitle2">
                    {pathname === "/sign-up"
                      ? "Already a Member?"
                      : "Not a member?"}
                    <Typography className={classes.hyperlink}>
                      <Link
                        to={pathname === "/sign-up" ? "/sign-in" : "/sign-up"}
                      >
                        {pathname === "/sign-up" ? " Sign In" : " Sign Up"}
                      </Link>
                    </Typography>
                  </Typography>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Modal>
      )}
    </>
  );
};

export default AuthModal;
