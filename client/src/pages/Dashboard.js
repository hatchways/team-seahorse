import { Grid, makeStyles } from "@material-ui/core";
import React, { useContext } from "react";
import AddNewItem from "../components/AddNewItem";
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

  return (
    <Grid container className={classes.root} direction="column">
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
  );
};

export default Dashboard;
