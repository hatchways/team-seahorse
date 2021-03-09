import { Grid, makeStyles } from "@material-ui/core";
import React from "react";
import Header from "../components/Header";

const useStyles = makeStyles(() => ({
  container: {
    minHeight: "100vh",
  },
}));

const Dashboard = () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.container} direction="column">
      <Grid item>
        <Header />
      </Grid>
      <Grid item></Grid>
    </Grid>
  );
};

export default Dashboard;
