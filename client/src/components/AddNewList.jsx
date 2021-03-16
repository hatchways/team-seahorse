import {
  Card,
  CardActionArea,
  Grid,
  makeStyles,
  Typography,
  Dialog,
  DialogTitle,
  Button,
  TextField
} from "@material-ui/core";
import {Fragment, useState} from "react";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios"

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
  dialogPaper: {
    height: "80vh",
    width: "80vw"
  }
}));

const AddNewList = () => {
  const classes = useStyles();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const handleOpen = () => setDialogIsOpen(true)
  const handleClose = () => setDialogIsOpen(false);
  const handleTitleChange = (e) => {
    setTitle(e.target.value)
  }
  const handleSubmit = async () => {
    try {
      await axios.create({baseUrl: "localhost:3001", withCredentials: true}).post("/lists", {title})
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <Fragment>
      <Grid item>
        <Card className={classes.card} elevation={0}>
          <CardActionArea className={classes.action} onClick={handleOpen}>
            <AddIcon className={classes.icon} color="primary" />
            <Typography>ADD NEW LIST</Typography>
          </CardActionArea>
        </Card>
      </Grid>
      <Dialog
      classes={{ paper: classes.dialogPaper }}
      open={dialogIsOpen}
      onClose={handleClose}
    >
      <Grid
        container
        alignItems="center"
        direction="column"
        spacing={5}
      >
        <Grid item>
          <DialogTitle>Create New List</DialogTitle>
        </Grid>
        <Grid item>
          <TextField label="Title" variant="outlined" id="list-title" onChange={handleTitleChange} />
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary" onClick={handleSubmit}>
            Create List
          </Button>
        </Grid>
      </Grid>
    </Dialog>
    </Fragment>
  );
};

export default AddNewList;
