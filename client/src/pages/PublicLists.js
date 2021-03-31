import {
  Grid,
  makeStyles,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Dialog,
  DialogTitle,
  Link,
  Box,
} from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

const useStyles = makeStyles(() => ({
  root: {
    minHeight: "100vh",
  },
  bodyContainer: {
    flexGrow: 1,
    backgroundColor: "#f2f2f2",
    padding: 40,
  },
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
  img: {
    width: 100,
    height: 100,
  },
  product: {
    display: "flex",
  },
  content: {
    width: "70%",
  },
}));

const PublicLists = () => {
  const classes = useStyles();
  const { userId } = useParams();
  const [lists, setLists] = useState([]);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);

  const getPublicLists = async (userId) => {
    try {
      const { data } = await axios.get(`/publicLists/${userId}`);
      setLists(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getProductsOfList = async (userId, listId) => {
    setOpen(true);
    try {
      const { data } = await axios.get(`/publicLists/${userId}/${listId}`);
      setProducts(data);
    } catch (error) {}
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getPublicLists(userId);
  }, [userId]);

  return (
    <Grid container className={classes.root} direction="column">
      <Grid
        item
        container
        className={classes.bodyContainer}
        alignItems="center"
        direction="column"
      >
        <Grid item container spacing={2}>
          {lists.map((list) => {
            const { id, title, items, imageUrl } = list;
            return (
              <Grid item>
                <Card className={classes.cardContainer}>
                  <CardActionArea
                    className={classes.card}
                    elevation={0}
                    onClick={() => getProductsOfList(userId, id)}
                  >
                    <CardMedia className={classes.image} image={imageUrl} />
                    <CardContent>
                      <Typography align="center">{title}</Typography>
                      <Typography variant="subtitle1" align="center">
                        items: {items}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <Box p={2}>
          <DialogTitle>Followed Items</DialogTitle>
          <Grid container spacing={2}>
            {products.map((product) => {
              const { name, currentPrice, link, imageUrl } = product;
              return (
                <Grid item key={product.id}>
                  <Card elevation={0} className={classes.product}>
                    <CardMedia image={imageUrl} className={classes.img} />
                    <CardContent className={classes.content}>
                      <Typography
                        component={Link}
                        href={link}
                        color="textPrimary"
                      >
                        {name}
                      </Typography>
                      <Typography>{currentPrice}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Dialog>
    </Grid>
  );
};

export default PublicLists;
