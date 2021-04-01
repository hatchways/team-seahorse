import { Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { utilitiesContext } from "../providers/UtilitiesProvider";

const useStyles = makeStyles(() => ({
  paper: {
    width: "fit-content",
    margin: "50px auto 50px auto",
  },
  tab: {
    width: "200px",
  },
  followerNotification: {
    width: "800px",
    height: "fit-content",
    margin: "0 auto 20px auto",
    padding: "20px",
  },
  previousPrice: {
    textDecoration: "line-through",
    fontSize: "20px",
  },
  newPrice: {
    fontWeight: "bold",
    color: "red",
    fontSize: "30px",
  },
}));

const FollowerNotificationPaper = ({ notification }) => {
  const classes = useStyles();

  const { getProperDateInfo } = useContext(utilitiesContext);

  const { createdAt, data } = notification;
  const { followerName, followerImageUrl } = data
  
  return (
    <Paper className={classes.followerNotification} elevation={3} >
      <Grid container direction="row">
        <Grid item>
          <img
            src={followerImageUrl}
            style={{
              width: "110px",
              height: "110px",
              borderRadius: "10px",
              marginRight: "20px",
            }}
          />
        </Grid>

        <Grid item style={{ position: "relative" }}>
          <Grid item>
            <Typography variant="h4" >
              <span style={{ fontWeight: "bold" }}>{followerName} </span>
              <span>has followed you!</span>
            </Typography>
          </Grid>

          <Grid item style={{ position: "absolute", bottom: "0" }}>
            <Typography
                variant='h6'
            >
              {getProperDateInfo(createdAt, "Followed")}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default FollowerNotificationPaper;
