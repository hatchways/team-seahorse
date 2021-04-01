import { Box, Grid, makeStyles, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { userContext } from "../providers/UsersProvider";
import AddNewList from "./AddNewList";
import ListCover from "./ListCover";
import ListModal from "./ListModal";

const useStyles = makeStyles(() => ({
  title: {
    marginBottom: 20,
  },
}));

const Lists = () => {
  const classes = useStyles();
  const { lists, setLists } = useContext(userContext);
  return (
    <Box px={10}>
      <ListModal />
      <Typography className={classes.title} align="left" variant="h6">
        My Shopping Lists:
      </Typography>
      <Grid container spacing={2} justify="center">
        {lists &&
          lists.map((list) => {
            return <ListCover key={list.id} list={list} />;
          })}
        <AddNewList onAddList={(list) => setLists(lists.concat(list))} />
      </Grid>
    </Box>
  );
};

export default Lists;
