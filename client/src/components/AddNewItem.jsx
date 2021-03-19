import {
  Box,
  Typography,
  makeStyles,
  TextField,
  Button,
  InputBase,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import { productContext } from "../providers/ProductProvider";
import { userContext } from "../providers/UsersProvider";

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
  const { lists } = useContext(userContext);
  const { submitLink, product } = useContext(productContext);
  const [link, setLink] = useState("");
  const [listId, setListId] = useState("");

  const handleSubmit = () => {
    submitLink(listId, link);
  };

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
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <TextField
          className={classes.selectInput}
          select
          label="Select List"
          InputProps={{ disableUnderline: true }}
          onChange={(e) => setListId(e.target.value)}
        >
          {lists &&
            lists.map((option) => (
              <option value={option.id}>{option.title}</option>
            ))}
        </TextField>
        <Button
          className={classes.button}
          color="primary"
          variant="contained"
          onClick={handleSubmit}
        >
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default AddNewItem;
