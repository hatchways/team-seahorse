import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useContext } from "react";
import sample from "../images/sample.jpg";
import { userContext as context } from "../providers/UsersProvider";

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

const ListCover = ({ list }) => {
  const classes = useStyles();
  const { title, items, imageUrl } = list;
  return (
    <Grid item>
      <Card className={classes.card} elevation={0}>
        <CardMedia className={classes.image} image={imageUrl} />
        <CardContent>
          <Typography align="center">{title}</Typography>
          <Typography variant="subtitle1" align="center">
            {items} items
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ListCover;
