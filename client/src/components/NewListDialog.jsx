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
}));

const NewListDialog = ({ isOpen, onClose }) => {
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
      onClose();
      setAwaitingResponse(false);
    } catch (error) {
      setAwaitingResponse(false);
      console.log(error.response);
      if(errorText == "")
    }
  };
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent>
        <Grid
          container
          alignItems="center"
          direction="column"
          style={{ padding: "0 30px" }}
        >
          <Grid item>
            <DialogTitle>Create New List</DialogTitle>
          </Grid>
          <Grid item style={{ margin: "10px 0" }}>
            <Typography variant="h6">Add a Title</Typography>
            <TextField
              label="Title"
              variant="outlined"
              onChange={handleTitleChange}
              autoFocus
            />
          </Grid>
          <Grid item style={{ margin: "10px 0" }}>
            <Typography variant="h6">Add a Cover Image</Typography>
            <TextField
              label="Image URL"
              variant="outlined"
              defaultValue="http://example.com/image"
              onChange={handleCoverImageUrlChange}
            />
          </Grid>
          <Grid item style={{ marginTop: "30px" }}>
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
