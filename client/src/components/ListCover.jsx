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

import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";

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
    height: 260,
  },
  content: {},
}));

const ListCover = ({ list }) => {
  const classes = useStyles();
  const userContext = useContext(context);

  const { updateIsListClicked, axiosWithAuth, openSnackbar } = userContext;

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
          <CardMedia className={classes.image} image={sample} />
          <CardContent className={classes.content}>
            <Typography align="center">{title}</Typography>
            <Typography variant="subtitle1" align="center">
              {items}
            </Typography>
          </CardContent>
        </CardActionArea>
        <Box
          position="absolute"
          bottom="0"
          left="0"
          p={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {toggle ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
          <Switch color="primary" checked={!toggle} onChange={toggleHandler} />
        </Box>
      </Card>
    </Grid>
  );
};

export default ListCover;
