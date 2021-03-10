import { Modal, Button, TextField, Paper } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import axios from "axios";

const AuthModal = () => {
  const [signingIn, setSigningIn] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [signedIn, setSignedIn] = useState(true);

  useEffect(async () => {
    console.log("lacxsffasdsadasdsad");
    let results = await fetch("/test");
    results = await results.json();
    console.log(results);
    typeof results.user === "undefined"
      ? setSignedIn(true)
      : setSignedIn(false);
    console.log(results.user !== undefined);
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const textFieldStyling = {
    position: "relative",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, 0)",
    borderRadius: `4px 4px 4px 4px`,
    outline: "none",
    padding: "7px",
    width: "250px",
  };

  const signupHandler = async (e) => {
    e.preventDefault();

    const data = {
      name,
      email,
      password,
    };

    console.log(data);

    const result = await fetch("/register", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    });

    console.log(await result.json());
  };

  return (
    <Modal open={true}>
      <Paper
        id="auth-paper"
        style={{
          outline: "none",
          width: "500px",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <h1 style={{ textAlign: "center" }}>Sign up</h1>

        <form onSubmit={signupHandler} style={{ display: "block" }}>
          {!signingIn && (
            <div>
              <h3 style={{ textAlign: "center" }}>Your name:</h3>

              <TextField
                className="login"
                style={textFieldStyling}
                placeholder="Name"
                id="filled-basic"
                InputProps={{
                  disableUnderline: true,
                  style: { alignContent: "center" },
                }}
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
          )}

          <div>
            <h3 style={{ textAlign: "center" }}>Your email: </h3>

            <TextField
              className="login"
              style={textFieldStyling}
              placeholder="Email"
              id="filled-basic"
              InputProps={{
                disableUnderline: true,
                style: { alignContent: "center" },
              }}
              required
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>

          <div>
            <h3 style={{ textAlign: "center" }}>Your Password:</h3>

            <TextField
              className="login"
              style={textFieldStyling}
              placeholder="Password"
              id="filled-basic"
              InputProps={{
                disableUnderline: true,
                style: { alignContent: "center" },
              }}
              required
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>

          <div>
            <Button
              style={{
                position: "relative",
                left: "50%",
                transform: "translate(-50%, 0)",
                height: "45px",
                width: "90px",
                borderRadius: "28px",
                margin: "20px 0 20px 0",
              }}
              type="submit"
              onClick={(event) => {
                signupHandler(event);
              }}
            >
              Register
            </Button>
          </div>
        </form>
      </Paper>
    </Modal>
  );
};

export default AuthModal;
