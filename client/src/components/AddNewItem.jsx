import {
  Box,
  Typography,
  makeStyles,
  TextField,
  Button,
  InputBase,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(() => ({
  title: { paddingBottom: 40 },
  button: {
    height: 56,
    borderRadius: 28,
    width: 142,
    marginRight: 5,
    marginLeft: 150,
  },
  textInput: {
    paddingLeft: 50,
    height: "100%",
    minWidth: 500,
    borderRight: "1px solid #e2e2e1",
    overflow: "hidden",
  },
  selectInput: {
    marginLeft: 20,
    minWidth: 100,
    height: "90%",
  },
}));

const AddNewItem = () => {
  const classes = useStyles();
  return (
    <Box py={8}>
      <Typography
        className={classes.title}
        align="center"
        variant="h5"
        color="textPrimary"
      >
        Add new Item:
      </Typography>
      <Box
        bgcolor="white"
        height={70}
        borderRadius={35}
        display="flex"
        alignItems="center"
      >
        <InputBase
          className={classes.textInput}
          placeholder="Paste your link here"
        />
        <TextField
          className={classes.selectInput}
          select
          label="Select List"
          InputProps={{ disableUnderline: true }}
        />
        <Button className={classes.button} color="primary" variant="contained">
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default AddNewItem;
