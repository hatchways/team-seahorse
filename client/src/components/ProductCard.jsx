import {
  Button,
  Card,
  Grid,
  Typography,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import sample from "../images/productIcon.jpg";
import { userContext as context } from "../providers/UsersProvider";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

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
    width: "100px",
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
  spinner: {
    margin: "15px",
  },
}));

const ProductCard = ({ product }) => {
  const classes = useStyles();
  const userContext = useContext(context);

  const { currentList, removeProductInList } = userContext;
  const { id: listId } = currentList;
  const { name, currentPrice, previousPrice, link, id: productId } = product;

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <Card className={classes.card}>
      <Grid>
        <img
          src={sample}
          className={classes.img}
          onLoad={() => setIsImageLoaded(true)}
        />

        {!isImageLoaded && (
          <CircularProgress className={classes.spinner} size={100} />
        )}
      </Grid>

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
              maxWidth: "350px",
            }}
            noWrap
          >
            {link}
          </Typography>
        </Grid>

        <Grid item>
          <Typography variant="h5">
            <span hidden={!previousPrice} className={classes.previousPrice}>
              {previousPrice}
            </span>{" "}
            <span
              className={classes.newPrice}
              onClick={() => {
                console.log(previousPrice);
              }}
            >
              {previousPrice ? currentPrice : null}
            </span>
            {parseFloat(currentPrice) && parseFloat(previousPrice) ? (
              <>
                {parseFloat(currentPrice) > parseFloat(previousPrice) ? (
                  <ArrowUpwardIcon />
                ) : (
                  <ArrowDownwardIcon />
                )}
              </>
            ) : null}
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
