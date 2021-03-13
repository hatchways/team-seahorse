import React from "react";
import Alert from "@material-ui/lab/Alert";
import { Collapse, makeStyles } from "@material-ui/core";
import PropTypes from "prop-types";

const useStyles = makeStyles(() => ({
    alert: {
        margin: "0 0 20px 0"
    }
}))

const ErrorAlert = ({ message, visible }) => {

  const classes = useStyles()

  return (
    <Collapse in={visible} className = {classes.alert} >
      <Alert
        variant="filled"
        severity="error"
      >
        {message}
      </Alert>
    </Collapse>
  );
};

ErrorAlert.propTypes = {
  message: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default ErrorAlert;
