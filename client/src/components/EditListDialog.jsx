import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import { userContext as context } from "../providers/UsersProvider";
import ProductCard from "./ProductCard";

const useStyles = makeStyles(() => ({
  paper: {
    outline: "none",
    width: "650px",
    height: "700px",
    maxHeight: "700px",
    maxWidth: "650px",
    position: "relative",
    padding: "20px",
    backgroundColor: "#f2f2f2",
  },
  listTitle: {
    display: "block",
    textAlign: "center",
    margin: "20px 0 15px 0",
  },
  listLength: {
    display: "block",
    textAlign: "center",
    color: "gray",
    fontStyle: "italic",
    marginBottom: "15px",
  },
  addBtn: {
    display: "block",
    margin: "50px auto 20px auto",
    height: "60px",
    width: "150px",
    borderRadius: "50px",
  },
}));

const EditListDialog = () => {
  const classes = useStyles();
  const userContext = useContext(context);

  const {
    updateIsListClicked,
    isListClicked,
    updateIsAddingProd,
    currentList,
    currentListProducts,
    updateCurrentList,
    updateCurrentListProducts,
  } = userContext;

  const { title, items } = currentList;

  const [titlePlaceholder, setTitlePlaceholder] = useState("");

  useEffect(() => {
    setTitlePlaceholder(title);
  }, []);

  return (
    <Dialog
      open={isListClicked}
      onBackdropClick={() => updateIsListClicked(false)}
      maxWidth="md"
      onExit={() => {
        updateCurrentList({});
        updateCurrentListProducts([]);
      }}
      onEntering={() => {}}
    >
      <DialogContent className={classes.paper}>
        <IconButton
          onClick={() => updateIsListClicked(false)}
          style={{
            position: "absolute",
            right: "20px",
            top: "20px",
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h4" className={classes.listTitle}>
          {title}
        </Typography>

        <Typography className={classes.listLength}>
          {items >= 0 ? ` You have ${items} items in the list. ` : ""}
        </Typography>

        <Grid
          container
          style={{ height: "450px", overflow: "scroll", display: "block" }}
        >
          {currentListProducts.length > 0 &&
            currentListProducts.map((product) => {
              return <ProductCard product={product} />;
            })}
        </Grid>

        <Button
          className={classes.addBtn}
          color="primary"
          variant="contained"
          onClick={() => {
            updateIsAddingProd(true);
          }}
        >
          Add Product
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default EditListDialog;
