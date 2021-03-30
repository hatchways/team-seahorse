import {
  Button,
  Dialog,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Slide,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useContext, useEffect, useState, forwardRef } from "react";
import ProductConfirmation from "./ProductConfirmation";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { userContext as context } from "../providers/UsersProvider";
import EditListDialog from "./EditListDialog";
import axios from "axios";

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
  textField: {
    borderRadius: `4px 4px 4px 4px`,
    outline: "none",
    padding: "7px",
    width: "250px",
    backgroundColor: "white",
  },
  button: {
    height: 56,
    borderRadius: 28,
    width: 142,
    display: "block",
    margin: "auto",
    marginBottom: "20px",
    marginTop: "20px",
  },
  iconButton: {
    position: "absolute",
    right: "20px",
    top: "20px",
  },
  newItem: {
    display: "block",
    textAlign: "center",
    margin: "60px 0 15px 0",
  },
  linkToItem: {
    textAlign: "center",
    marginTop: "50px",
    fontWeight: "bold",
  },
  grid: { width: "fitContent", margin: "20px auto 20px auto" },
  selectListHeader: {
    textAlign: "center",
    marginTop: "50px",
    fontWeight: "bold",
  },
}));

const AddProductDialog = () => {
  const classes = useStyles();
  const [productUrl, setProductUrl] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const { updateIsAddingProd, isAddingProd, currentList } = useContext(context);

  useEffect(() => {
    //Get the products of the list then setLoading(false)
  }, []);

  const submitHandler = async () => {
    await axios.create({ withCredentials: true }).post("/products/", {
      url: productUrl,
      listId: currentList.id,
    });
  };
  return (
    <>
      <EditListDialog />

      <Dialog
        open={isAddingProd}
        onBackdropClick={() => updateIsAddingProd(false)}
        hideBackdrop={true}
        maxWidth="md"
      >
        <Slide direction="left" in={isAddingProd} mountOnEnter>
          <Paper className={classes.paper}>
            <IconButton
              className={classes.iconButton}
              onClick={() => updateIsAddingProd(false)}
            >
              <ArrowBackIcon fontSize="large" />
            </IconButton>

            <Grid container direction="column">
              <Grid item>
                <Typography variant="h4" className={classes.newItem}>
                  Add new item:
                </Typography>
              </Grid>

              <Grid item>
                <Typography variant="h5" className={classes.linkToItem}>
                  Paste link to item:
                </Typography>
              </Grid>

              <Grid item className={classes.grid}>
                <TextField
                  className={classes.textField}
                  placeholder="Product Link"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  onChange={(e) => setProductUrl(e.target.value)}
                ></TextField>
              </Grid>
              {!currentList && (
                <>
                  <Grid item>
                    <Typography
                      variant="h5"
                      className={classes.selectListHeader}
                    >
                      Select List
                    </Typography>
                  </Grid>

                  <Grid item className={classes.grid}>
                    <TextField
                      select
                      InputProps={{
                        disableUnderline: true,
                      }}
                      label="Select List"
                      style={{
                        width: "250px",
                        backgroundColor: "white",
                        borderRadius: "7px",
                      }}
                    ></TextField>
                  </Grid>
                </>
              )}

              <Button
                className={classes.button}
                color="primary"
                variant="contained"
                onClick={() => setIsConfirming(true)}
              >
                Add Item
              </Button>
            </Grid>
          </Paper>
        </Slide>
        <Slide direction="left" in={isConfirming} mountOnEnter>
          <div>
            <ProductConfirmation setModal={setIsConfirming} />
          </div>
        </Slide>
      </Dialog>
    </>
  );
};

export default AddProductDialog;
