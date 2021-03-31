import { Grid, Link, makeStyles, Paper, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { utilitiesContext } from "../providers/UtilitiesProvider";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

const useStyles = makeStyles(() => ({
  paper: {
    width: "fit-content",
    margin: "50px auto 50px auto",
  },
  tab: {
    width: "200px",
  },
  priceNotification: {
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
  icon: {
    fontSize: "30px",
  },
}));

const PriceNotificationPaper = ({ notification }) => {
  const classes = useStyles();

  const { updatedAt, data } = notification;
  const { price, previousPrice, imageUrl, link, name } = data;

  const { getProperDateInfo } = useContext(utilitiesContext);

  return (
    <Paper className={classes.priceNotification} elevation={3}>
      <Grid container direction="row">
        <Grid item>
          <img
            src={imageUrl}
            style={{
              width: "110px",
              height: "110px",
              borderRadius: "10px",
              marginRight: "20px",
            }}
          />
        </Grid>

        <Grid item>
          <Typography variant="h6">{name}</Typography>
          <Typography
            variant="body2"
            style={{
              maxWidth: "670px",
              color: "grey",
              fontStyle: "italic",
            }}
            noWrap
          >
            <Link href={link} target="_blank">
              {link}</Link>
          </Typography>

          <Typography variant="h5">
            <span hidden={!previousPrice} className={classes.previousPrice}>
              {previousPrice}
            </span>{" "}
            <span className={classes.newPrice}>
              {previousPrice ? price : previousPrice}
            </span>
            <span className={classes.previousPrice}>
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
            </span>
          </Typography>

          <Typography>{getProperDateInfo(updatedAt)}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PriceNotificationPaper;
