import React, {  useContext } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { userContext as context } from "../providers/UsersProvider";
import Alert from "@material-ui/lab/Alert";

const SnackbarAlert = () => {
  const userContext = useContext(context);

  const {
    isSnackbarOpen,
    updateIsSnackbarOpen,
    snackbarMessage,
    snackbarSeverity,
  } = userContext;

  const handleClose = () => {
    updateIsSnackbarOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      open={isSnackbarOpen}
      autoHideDuration={2000}
      onClose={handleClose}
      message={snackbarMessage}
      action={
        <React.Fragment>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
    >
      <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
