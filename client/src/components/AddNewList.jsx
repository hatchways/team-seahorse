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

const AddNewList = ({ onAddList }) => {
  const classes = useStyles();
  const [newListDialogIsOpen, setNewListDialogIsOpen] = useState(false);

  return (
    <>
      <Grid item>
        <Card className={classes.card} elevation={0}>
          <CardActionArea
            className={classes.action}
            onClick={() => setNewListDialogIsOpen(true)}
          >
            <AddIcon className={classes.icon} color="primary" />
            <Typography>ADD NEW LIST</Typography>
          </CardActionArea>
        </Card>
      </Grid>
      <NewListDialog
        isOpen={newListDialogIsOpen}
        onClose={() => setNewListDialogIsOpen(false)}
        onAddList={onAddList}
      />
    </>
  );
};

export default AddNewList;
