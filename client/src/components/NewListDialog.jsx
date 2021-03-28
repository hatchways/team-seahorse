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
import { useState, useMemo, useContext } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { userContext } from "../providers/UsersProvider";

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
    textAlign: "center",
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
  cover: {
    width: 200,
    borderRadius: 5,
    margin: 5,
  },
}));

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

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
  const [imageUrl, setImageUrl] = useState("");
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const { axiosWithAuth } = useContext(userContext);

  const {
    //acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: "image/*",
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const formData = new FormData();
        formData.append("image", acceptedFiles[0]);
        try {
          const { data } = await axiosWithAuth().post(
            "/upload-image",
            formData
          );
          setImageUrl(data.imageUrl);
        } catch (error) {
          console.error(error);
        }
      }
    },
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

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
      onAddList({ id: result.data.id, title, imageUrl, items: 0 });
      setAwaitingResponse(false);
      setImageUrl("");
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
            <Typography variant="h6" paragraph>
              Add a Cover
            </Typography>
            {imageUrl && (
              <img src={imageUrl} alt="cover" className={classes.cover} />
            )}
            <div {...getRootProps({ style })}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag 'n' drop some files here, or click to select files</p>
              )}
            </div>
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
