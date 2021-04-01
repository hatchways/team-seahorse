import {
  Grid,
  makeStyles,
  IconButton,
  Typography,
  Paper,
  ButtonBase,
} from "@material-ui/core";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import React, { useContext, useEffect, useState, useForceUpdate } from "react";
import { userContext } from "../providers/UsersProvider";
import { utilitiesContext} from "../providers/UtilitiesProvider";

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    width: "fit-content",
    height: "80px",
    padding: "7px",
  },
  paper: {
    borderRadius: "5px",
    height: "100%",
    width: "100%",
    position: "relative",
  },
  img: {
    borderRadius: "7px",
    maxWidth: "50px",
    maxHeigh: "50px",
    width: "50px",
    height: "50px",
  },
  readIcon: {
    position: "absolute",
    right: 4,
    top: 6,
    color: "#d1d1d1",
    zIndex: 5,
  },
  gridImg: {
    height: "100%",
    padding: "8px",
  },
  gridSubContainer: {
    height: "100%",
    paddingRight: "30px",
  },
  previousPrice: {
    textDecoration: "line-through",
    fontSize: "13px",
    padding: "3px 0 ",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  newPrice: {
    fontWeight: "bold",
    fontSize: "23px",
  },
  textContent: {
    display: "flex",
    flexGrow: "100",
    padding: "0 5px 0 5px",
  },
  textHighlight: {
    fontWeight: "bold",
  },
  time: {
    position: "absolute",
    bottom: "5%",
  },
  icon: {
    fontSize: "25px",
  },
}));

const FollowedNotification = ({ notification, index }) => {
  const classes = useStyles();

  let { data, createdAt, isRead, id: notificationId } = notification;
  const { followerName, followerId, followerImageUrl } = data;

  const [isPaperDisabled, setIsPaperDisabled] = useState(false);

  const { readNotification, getTimeDifference } = useContext(userContext);
  const { getProperDateInfo } = useContext(utilitiesContext)

  return (
    <Grid container className={classes.gridContainer}>
      <ButtonBase
        style={{ width: "400px", height: "100%" }}
        disableTouchRipple={isPaperDisabled}
      >
        <Paper
          className={classes.paper}
          style={isRead ? { background: "#e6e6e6" } : { background: "white" }}
        >
          <Grid container direction="row" className={classes.gridSubContainer}>
            <Grid item className={classes.gridImg}>
              <img
                src={followerImageUrl}
                className={classes.img}
                alt="Follower_img"
              />
            </Grid>

            <Grid item className={classes.textContent}>
              <Typography
                style={{
                  height: "40px",
                  textAlign: "left",
                  width: "205px",
                  paddingTop: "5px",
                }}
              >
                <span style={{fontWeight: 'bold'}} >{followerName}</span> has followed you!
              </Typography>

              <span className={classes.time}>
                {getProperDateInfo(createdAt, "Followed")}
              </span>
            </Grid>
          </Grid>

          <IconButton
            className={classes.readIcon}
            size="small"
            onClick={async () => {
              if (isRead === true) return;
              await readNotification(notificationId, index);
            }}
            onMouseEnter={() => {
              setIsPaperDisabled(true);
            }}
            onMouseLeave={() => {
              setIsPaperDisabled(false);
            }}
          >
            <AssignmentTurnedInIcon fontSize="small" />
          </IconButton>
        </Paper>
      </ButtonBase>
    </Grid>
  );
};

export default FollowedNotification;
