import {
  makeStyles,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  Button,
  TextField,
} from "@material-ui/core";
import { useState } from "react";
import axios from "axios";

const useStyles = makeStyles(() => ({
  dialogPaper: {
    height: "50%",
    minWidth: "30%",
    maxWidth: "40%",
  },
}));

const NewListDialog = ({ isOpen, closeDialog }) => {
  const classes = useStyles();

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
  //TODO: Should be in useEffect
  const handleSubmit = async () => {
    try {
      setAwaitingResponse(true);
      //TODO: Use environment variable for baseUrl
      await axios
        .create({ baseUrl: "localhost:3001", withCredentials: true })
        .post("/lists", { title, coverImageUrl });
      closeDialog();
      setAwaitingResponse(false);
    } catch (error) {
      setAwaitingResponse(false);
      console.log(error.response);
    }
  };
  return (
    <Dialog
      classes={{ paper: classes.dialogPaper }}
      open={isOpen}
      onClose={closeDialog}
    >
      <Grid container alignItems="center" direction="column" spacing={5}>
        <Grid item>
          <DialogTitle>Create New List</DialogTitle>
        </Grid>
        <Grid item>
          <Typography variant="h6">Add a Title</Typography>
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
            defaultValue="http://example.com/image"
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
  );
};

export default NewListDialog;
