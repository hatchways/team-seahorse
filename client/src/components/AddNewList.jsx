import {
  Card,
  CardActionArea,
  Grid,
  makeStyles,
  Typography,
  Dialog,
  DialogTitle,
  Button,
  TextField,
} from "@material-ui/core";
import { Fragment, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";

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
    width: "80vw",
  },
}));

const AddNewList = () => {
  const classes = useStyles();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState(
    "http://example.com/image"
  );
  const [awaitingResponse, setAwaitingResponse] = useState(false);

  const handleCoverImageUrlChange = (e) => {
    setCoverImageUrl(e.target.value);
  };
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const handleSubmit = async () => {
    try {
      setAwaitingResponse(true);
      await axios
        .create({ baseUrl: "localhost:3001", withCredentials: true })
        .post("/lists", { title, coverImageUrl });
      setDialogIsOpen(false);
    } catch (error) {
      setAwaitingResponse(false);
      console.log(error.response);
    }
  };

  return (
    <Fragment>
      <Grid item>
        <Card className={classes.card} elevation={0}>
          <CardActionArea
            className={classes.action}
            onClick={() => setDialogIsOpen(true)}
          >
            <AddIcon className={classes.icon} color="primary" />
            <Typography>ADD NEW LIST</Typography>
          </CardActionArea>
        </Card>
      </Grid>
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={dialogIsOpen}
        onClose={() => setDialogIsOpen(false)}
      >
        <Grid container alignItems="center" direction="column" spacing={5}>
          <Grid item>
            <DialogTitle>Create New List</DialogTitle>
          </Grid>
          <Grid item>
            <Typography variant="h6">Add a title</Typography>
            <TextField
              label="Title"
              variant="outlined"
              onChange={handleTitleChange}
              autoFocus
            />
          </Grid>
          <Grid item>
            <Typography variant="h6">Add a Cover Image</Typography>
            <TextField
              label="Image URL"
              variant="outlined"
              onChange={handleCoverImageUrlChange}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
              disabled={awaitingResponse}
            >
              Create List
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    </Fragment>
  );
};

export default AddNewList;
