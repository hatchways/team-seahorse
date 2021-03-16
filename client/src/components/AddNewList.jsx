import {
  Button,
  Card,
  CardActionArea,
  Grid,
  InputBase,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import { userContext } from "../providers/UsersProvider";

const useStyles = makeStyles(() => ({
  card: {
    width: 250,
    height: 350,
    backgroundColor: "white",
  },
  action: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 50,
    marginBottom: 20,
  },
  modal: {
    position: "fixed",
    left: 0,
    top: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(201, 76, 76, 0.3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  paper: {
    width: 720,
    height: 740,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  textInput: {
    width: 550,
    height: 70,
    paddingLeft: 240,
    backgroundColor: "white",
    borderRadius: 35,
  },
}));

const AddNewList = () => {
  const classes = useStyles();
  const { addList } = useContext(userContext);

  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState("");

  const handleClick = () => {
    if (title) {
      addList(title);
    }
    setModal((modal) => !modal);
    setTitle("");
  };

  return (
    <Grid item>
      <Card className={classes.card} elevation={0}>
        <CardActionArea className={classes.action} onClick={handleClick}>
          <AddIcon className={classes.icon} color="primary" />
          <Typography>ADD NEW LIST</Typography>
        </CardActionArea>
      </Card>
      {modal && (
        <div className={classes.modal}>
          <Paper className={classes.paper}>
            <Typography variant="h5">Creat a new List</Typography>
            <Typography>Add a title</Typography>
            <InputBase
              placeholder="Enter name"
              value={title}
              className={classes.textInput}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Button onClick={handleClick}>create list</Button>
          </Paper>
        </div>
      )}
    </Grid>
  );
};

export default AddNewList;
