import React, { useContext } from "react";
import {
  Button,
  makeStyles,
  Paper,
  Typography,
  Box,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { productContext } from "../providers/ProductProvider";

const useStyles = makeStyles((theme) => ({
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
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const ProductConfirmationBody = ({ title, price, imageURL, handleClose }) => {
  const classes = useStyles();
  return (
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
  );
};

const ProductConfirmation = ({ setModal }) => {
  const classes = useStyles();
  const {
    product: { title, price, imageURL },
    clearProduct,
  } = useContext(productContext);

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
      zIndex="10"
    >
      <Paper className={classes.paper}>
        <IconButton
          className={classes.closeButton}
          edge="start"
          onClick={handleClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default ProductConfirmation;
export { ProductConfirmationBody };
