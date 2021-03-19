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
  const userContext = useContext(context);

  const { updateIsListClicked } = userContext;

  const { title, id } = list;

  const clickHandler = async () => {
    updateIsListClicked(true);

    //Use a function that will load list products
  };

  return (
    <Grid item style={{ cursor: "pointer" }}>
      <Card
        className={classes.card}
        elevation={0}
        onClick={() => clickHandler()}
      >
        <CardMedia className={classes.image} image={sample} />
        <CardContent>
          <Typography align="center">{title}</Typography>
          <Typography variant="subtitle1" align="center">
            {/* {items} items */}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ListCover;
