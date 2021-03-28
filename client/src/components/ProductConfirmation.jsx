import React, { useContext } from "react";
import { Button, makeStyles, Paper, Typography, Box } from "@material-ui/core";
import { productContext } from "../providers/ProductProvider";

const useStyles = makeStyles(() => ({
  paper: {
    width: 600,
    height: 600,
    position: "absolute",
    left: "50%",
    top: "40%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 300,
    padding: 10,
  },
  button: {
    height: 56,
    borderRadius: 28,
    width: 142,
  },
}));

const ProductConfirmation = ({ setModal }) => {
  const classes = useStyles();
  const { product, clearProduct } = useContext(productContext);
  const { title, price, imageURL } = product;

  const handleClose = () => {
    setModal((modal) => !modal);
    clearProduct();
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      position="fixed"
      left="0"
      top="0"
      bgcolor="rgba(37, 35, 35, 0.541)"
    >
      <Paper className={classes.paper}>
        <Box
          p={5}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
          height="90%"
        >
          <Typography variant="h6">
            {title}
            <Typography>Price: {price}</Typography>
          </Typography>
          <img className={classes.image} src={imageURL} alt={title}></img>
          <Button
            className={classes.button}
            color="primary"
            variant="contained"
            onClick={handleClose}
          >
            Close
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProductConfirmation;
