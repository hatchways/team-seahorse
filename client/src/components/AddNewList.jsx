import {
  Card,
  CardActionArea,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useState } from "react";
import NewListDialog from "./NewListDialog";

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
}));

const AddNewList = () => {
  const classes = useStyles();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
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
      <NewListDialog
        isOpen={dialogIsOpen}
        closeDialog={() => setDialogIsOpen(false)}
      />
    </>
  );
};

export default AddNewList;
