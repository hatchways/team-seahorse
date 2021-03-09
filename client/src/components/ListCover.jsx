import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import sample from "../images/sample.jpg";

const useStyles = makeStyles(() => ({
  card: {
    width: 250,
    height: 350,
    backgroundColor: "white",
  },
  image: {
    height: 260,
  },
}));

const ListCover = () => {
  const classes = useStyles();

  return (
    <Grid item>
      <Card className={classes.card}>
        <CardMedia className={classes.image} image={sample} />
        <CardContent>
          <Typography align="center">Title</Typography>
          <Typography variant="subtitle1" align="center">
            50 items
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ListCover;
