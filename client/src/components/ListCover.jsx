import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  makeStyles,
  Switch,
  Typography,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import sample from "../images/sample.jpg";
import { userContext as context } from "../providers/UsersProvider";

const useStyles = makeStyles(() => ({
  cardContainer: {
    position: "relative",
  },
  card: {
    width: 250,
    height: 350,
    backgroundColor: "white",
    position: "relative",
  },
  image: {
    height: 280,
  },
}));

const ListCover = ({ list }) => {
  const classes = useStyles();
  const userContext = useContext(context);

  const {
    updateIsListClicked,
    axiosWithAuth,
    openSnackbar,
    updateCurrentList,
    getListProducts,
  } = userContext;

  const { title, id, items, imageUrl, isPrivate } = list;

  const [toggle, setToggle] = useState(isPrivate);

  const clickHandler = async () => {
    updateCurrentList(list);
    getListProducts(id);
    updateIsListClicked(true);
  };

  const toggleHandler = () => {
    setToggle((toggle) => !toggle);
    axiosWithAuth()
      .put(`/lists/${id}`, { isPrivate: toggle })
      .then((res) => {
        openSnackbar("success", res.data.message);
      })
      .catch((err) => console.error(err));
  };

  return (
    <Grid item>
      <Card className={classes.cardContainer}>
        <CardActionArea
          onClick={() => clickHandler()}
          className={classes.card}
          elevation={0}
        >
          <CardMedia className={classes.image} image={imageUrl} />
          <CardContent>
            <Typography align="center">{title}</Typography>
            <Typography variant="subtitle1" align="center">
              items: {items}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardContent>
          <Box
            position="absolute"
            bottom="0"
            right="0"
            p={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Switch color="primary" checked={toggle} onChange={toggleHandler} />
            {toggle ? (
              <Typography>Public</Typography>
            ) : (
              <Typography>Private</Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ListCover;
