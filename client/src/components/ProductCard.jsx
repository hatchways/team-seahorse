import {
  Button,
  Card,
  Grid,
  Typography,
  makeStyles,
  Fade,
} from "@material-ui/core";

import React, { useContext, useState } from "react";
import sample from "../images/productIcon.jpg";
import { userContext as context } from "../providers/UsersProvider";

const useStyles = makeStyles(() => ({
  card: {
    display: "flex",
    margin: "0 0 20px 0",
    height: "fit-content",
    width: "100%",
  },
  img: {
    borderRadius: "7px",
    margin: "15px",
    maxWidth: "100px",
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
  removeBtn: {
    marginRight: "20px",
    height: "50px",
    width: "150px",
    display: "block",
    margin: "auto 20px auto 0",
    borderRadius: "50px",
    background: "#fafafa",
  },
}));

const ProductCard = ({ product }) => {
  const classes = useStyles();
  const userContext = useContext(context);

  const { currentList, removeProductInList } = userContext;
  const { id: listId } = currentList;
  const { name, current_price, previous_price, link, id: productId } = product;

  return (
    <Card className={classes.card}>
      <img src={sample} className={classes.img} />

      <Grid container direction="column" style={{ marginTop: "15px" }}>
        <Grid item>
          <Typography variant="h6" style={{ lineHeight: "20px" }}>
            {name}
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            style={{
              color: "gray",
              fontStyle: "italic",
              cursor: "pointer",
              fontWeight: "lighter",
            }}
          >
            {link}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h5">
            <span hidden={!previous_price} className={classes.previousPrice}>
              {current_price}
            </span>{" "}
            <span className={classes.newPrice}>
              {previous_price ? previous_price : current_price}
            </span>
          </Typography>
        </Grid>
      </Grid>
      <Button
        className={classes.removeBtn}
        onClick={() => {
          removeProductInList(listId, productId);
        }}
      >
        Remove
      </Button>
    </Card>
  );
};

export default ProductCard;
