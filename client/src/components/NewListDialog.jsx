import {
  makeStyles,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useState } from "react";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
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
    marginTop: 30,
    marginBottom: 50,
  },
  formText: {
    width: 500,
    marginTop: 10,
  },
  dialogTitle: {
    marginBottom: 30,
  },
}));

const DialogFormTextField = (props) => {
  const classes = useStyles();

  return (
    <Grid container alignItems="center" direction="column">
      <Typography variant="h6">{props.children}</Typography>
      <TextField
        className={classes.formText}
        variant="outlined"
        {...props.textProps}
      />
    </Grid>
  );
};

const NewListDialog = ({ isOpen, onClose, onAddList }) => {
  const classes = useStyles();

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("http://example.com/image");
  const [awaitingResponse, setAwaitingResponse] = useState(false);

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  const handleSubmit = async () => {
    try {
      setAwaitingResponse(true);
      const result = await axios
        .create({ withCredentials: true })
        .post("/lists", { title, imageUrl });
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
    <Dialog open={isOpen} onClose={onClose} maxWidth="lg">
      <IconButton
        className={classes.closeButton}
        edge="start"
        onClick={onClose}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Grid
          container
          className={classes.dialogGrid}
          alignItems="center"
          direction="column"
        >
          <Grid item>
            <DialogTitle className={classes.dialogTitle}>
              Create New List
            </DialogTitle>
          </Grid>
          <Grid item className={classes.formItem}>
            <DialogFormTextField
              textProps={{
                label: "Title",
                onChange: handleTitleChange,
                autoFocus: true,
              }}
            >
              Add a Title
            </DialogFormTextField>
          </Grid>
          <Grid item className={classes.formItem}>
            <DialogFormTextField
              textProps={{
                label: "Image URL",
                defaultValue: "http://example.com/image",
                onChange: handleImageUrlChange,
              }}
            >
              Add a Cover
            </DialogFormTextField>
          </Grid>
          <Grid item className={classes.formButton}>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
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
