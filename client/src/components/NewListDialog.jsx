import {
  makeStyles,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
} from "@material-ui/core";
import { useState } from "react";
import axios from "axios";

const useStyles = makeStyles(() => ({
  button: {
    height: 56,
    borderRadius: 28,
    width: 142,
  },
  dialogGrid: {
    padding: "0 30px",
  },
  formItem: {
    margin: "10px 0",
  },
  formButton: {
    marginTop: "30px",
  },
}));

const NewListDialog = ({ isOpen, onClose, onAddList }) => {
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
  const handleSubmit = async () => {
    try {
      setAwaitingResponse(true);
      const result = await axios
        .create({ withCredentials: true })
        .post("/lists", { title, coverImageUrl });
      onClose();
      onAddList({ id: result.data.id, title });
      setAwaitingResponse(false);
    } catch (error) {
      //TODO: Error handling
      setAwaitingResponse(false);
      console.log(error.response);
    }
  };
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent>
        <Grid
          container
          className={classes.dialogGrid}
          alignItems="center"
          direction="column"
        >
          <Grid item>
            <DialogTitle>Create New List</DialogTitle>
          </Grid>
          <Grid item className={classes.formItem}>
            <Typography variant="h6">Add a Title</Typography>
            <TextField
              label="Title"
              variant="outlined"
              onChange={handleTitleChange}
              autoFocus
            />
          </Grid>
          <Grid item className={classes.formItem}>
            <Typography variant="h6">Add a Cover Image</Typography>
            <TextField
              label="Image URL"
              variant="outlined"
              defaultValue="http://example.com/image"
              onChange={handleCoverImageUrlChange}
            />
          </Grid>
          <Grid item className={classes.formButton}>
            <Button
              className={classes.button}
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
              disabled={awaitingResponse}
            >
              Create List
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default NewListDialog;
