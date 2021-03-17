import {
  Card,
  CardActionArea,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles(() => ({
  card: {
    width: 250,
    height: 350,
    backgroundColor: "white",
  },
  action: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 50,
    marginBottom: 20,
  },
}));

const AddNewList = () => {
  const classes = useStyles();

  return (
    <Grid item>
      <Card className={classes.card} elevation={0}>
        <CardActionArea className={classes.action}>
          <AddIcon className={classes.icon} color="primary" />
          <Typography>ADD NEW LIST</Typography>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default AddNewList;
