import {
  Button,
  Card,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Slide,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import CloseIcon from "@material-ui/icons/Close";
import sample from "../images/productIcon.jpg";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { userContext as context } from "../providers/UsersProvider";

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
  card: {
    display: "flex",
    margin: "0 20px 20px 20px",
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
  } = userContext;

  useEffect(() => {
    //Get the products of the list then setLoading(false)
  }, []);

  return (
    <Dialog
      open={isListClicked}
      onBackdropClick={() => updateIsListClicked(false)}
      maxWidth="md"
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
          List Title
        </Typography>
        <Typography className={classes.listLength}>List.length</Typography>

        {/* Change true to isLoading when doing integration */}
        {true && (
          <Grid container style={{ height: "450px", overflow: "scroll" }}>
            <Card className={classes.card}>
              <img src={sample} className={classes.img} />

              <Grid container direction="column" style={{ marginTop: "15px" }}>
                <Grid item>
                  <Typography variant="h6" style={{ lineHeight: "20px" }}>
                    Product title
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
                    Clickable link ...
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h5">
                    <span className={classes.previousPrice}>$50</span>{" "}
                    <span className={classes.newPrice}>$30</span>
                  </Typography>
                </Grid>
              </Grid>
              <Button className={classes.removeBtn}>Remove</Button>
            </Card>
          </Grid>
        )}

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
