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

  const { updateIsListClicked, updateCurrentList,getListProducts } = userContext;

  const { title, id } = list;

  const clickHandler = async () => {
    updateCurrentList(list)
    getListProducts(id)
    updateIsListClicked(true);
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
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ListCover;
