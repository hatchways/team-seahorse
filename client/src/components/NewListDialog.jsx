import { withStyles } from "@material-ui/styles";
import {
  Dialog,
  Grid,
  DialogTitle,
  TextField,
  Button
} from "@material-ui/core";
import { useState } from "react";

const styles = {
  dialogPaper: {
    height: "80vh",
    width: "80vw"
  }
};

const NewListDialog = ({ classes }) => {
  const [open, setOpen] = useState(true);
  const closeDialog = () => setOpen(false);
  return (
    <Dialog
      classes={{ paper: classes.dialogPaper }}
      open={open}
      onClose={closeDialog}
    >
      <Grid
        container
        alignItems="center"
        direction="column"
        spacing={5}
        style={{ width: "100%", margin: 0 }}
      >
        <Grid item>
          <DialogTitle>Create New List</DialogTitle>
        </Grid>
        <Grid item flexGrow={45}>
          <TextField label="Title" variant="outlined" id="list-title" />
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary">
            Create List
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default withStyles(styles)(YourDialog);
