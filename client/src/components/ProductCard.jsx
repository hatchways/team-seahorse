import {
  Button,
  Card,
  Grid,
  Typography,
  makeStyles,
  Link,
} from "@material-ui/core";

import React, { useContext } from "react";
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
    width: "100px",
    height: "100px",
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
  const {
    name,
    currentPrice,
    previousPrice,
    link,
    id: productId,
    imageUrl,
  } = product;

  return (
    <Card className={classes.card}>
      <img src={imageUrl} className={classes.img} alt={name} />

      <Grid container direction="column" style={{ marginTop: "15px" }}>
        <Grid item>
          <Typography
            variant="h6"
            component={Link}
            href={link}
            color="textPrimary"
            style={{ lineHeight: "20px" }}
          >
            {name}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="subtitle1">
            <span hidden={!previousPrice} className={classes.previousPrice}>
              {previousPrice}
            </span>{" "}
            <span className={classes.newPrice}>
              {previousPrice ? currentPrice : previousPrice}
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
