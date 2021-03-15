import { Grid, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import AddNewItem from "../components/AddNewItem";
import Header from "../components/Header";
import Lists from "../components/Lists";

const useStyles = makeStyles(() => ({
  root: {
    minHeight: "100vh",
  },
  bodyContainer: {
    flexGrow: 1,
    backgroundColor: "#f2f2f2",
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const history = useHistory();

  const [user, setUser] = useState({});
  const [signedIn, setSignedIn] = useState(false);

  useEffect(async () => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    //redirect to landing page if no token
    let results = await fetch("/user/currentUser");

    results = await results.json();

    if (!results.user) {
      history.push("/");
    } else {
      //get user by id
      setSignedIn(true)
      const data = await fetch(`/user/${results.user.id}`);

      const parsedData = await data.json()

      setUser(parsedData.user);
    }
  };

  return (
    <>
      {!signedIn ? null : (
        <Grid container className={classes.root} direction="column">
          <Grid item>
            <Header user={user} />
          </Grid>
          <Grid
            item
            container
            className={classes.bodyContainer}
            alignItems="center"
            direction="column"
          >
            <Grid item>
              <AddNewItem />
            </Grid>
            <Grid item>
              <Lists />
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Dashboard;
