import { Grid, makeStyles } from "@material-ui/core";
import React, { useContext } from "react";
import AddNewItem from "../components/AddNewItem";
import Lists from "../components/Lists";
import { userContext as context } from "../providers/UsersProvider";
import { socketContext } from "../providers/SocketProvider";

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
  const userContext = useContext(context);

  const { user } = userContext;

  return (
    <>
      {!user ? null : (
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
      )}
    </>
  );
};

export default Dashboard;
