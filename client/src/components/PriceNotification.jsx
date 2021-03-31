import {
  Grid,
  makeStyles,
  IconButton,
  Typography,
  Paper,
  ButtonBase,
} from "@material-ui/core";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import React, { useContext, useState } from "react";
import { userContext } from "../providers/UsersProvider";

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

const PriceNotification = ({ notification, index }) => {
  const classes = useStyles();

  let { data, createdAt, isRead, id: notificationId } = notification;
  const { name, listLocations, price, previousPrice, imageUrl } = data;

  const [isPaperDisabled, setIsPaperDisabled] = useState(false);

  const { readNotification, getTimeDifference } = useContext(userContext);

  return (
    <Grid container className={classes.gridContainer}>
      <ButtonBase
        style={{ width: "400px", height: "100%" }}
        onClick={() => {
          if (isPaperDisabled) return;
          //show a dialog for notification
        }}
        disableTouchRipple={isPaperDisabled}
      >
        <Paper
          className={classes.paper}
          style={isRead ? { background: "#e6e6e6" } : { background: "white" }}
        >
          <Grid container direction="row" className={classes.gridSubContainer}>
            <Grid item className={classes.gridImg}>
              <img src={imageUrl} className={classes.img} alt="Product" />
            </Grid>

            <Grid item className={classes.textContent}>
              <Typography
                style={{
                  height: "40px",
                  textAlign: "left",
                  width: "205px",
                }}
              >
                {listLocations.length >= 2 ? (
                  <>
                    <span className={classes.textHighlight}>{name}</span> has a
                    price change. Updated on{" "}
                    <span className={classes.textHighlight}>
                      {listLocations.length}
                    </span>{" "}
                    lists.
                  </>
                ) : (
                  <>
                    <span className={classes.textHighlight}>{name}</span> has a
                    price change.
                  </>
                )}
              </Typography>

              <span className={classes.time}>
                {getTimeDifference(createdAt) > 1
                  ? `${getTimeDifference(createdAt)} Hours ago`
                  : `${getTimeDifference(createdAt)} Hour ago`}
              </span>
            </Grid>

            <Grid item style={{ width: "fit-content" }}>
              <Typography style={{ width: "100%" }}>
                <Typography className={classes.previousPrice}>
                  {price > previousPrice ? (
                    <ArrowUpwardIcon
                      className={classes.icon}
                      style={{ color: "red" }}
                    />
                  ) : (
                    <ArrowDownwardIcon
                      className={classes.icon}
                      style={{ color: "green" }}
                    />
                  )}{" "}
                  <span>${previousPrice}</span>
                </Typography>
                <Typography className={classes.newPrice}>${price}</Typography>
              </Typography>
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

export default PriceNotification;
