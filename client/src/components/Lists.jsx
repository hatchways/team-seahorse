import { Box, Grid, makeStyles, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { userContext } from "../providers/UsersProvider";
import AddNewList from "./AddNewList";
import ListCover from "./ListCover";

const useStyles = makeStyles(() => ({
  title: {
    marginBottom: 20,
  },
}));

const Lists = () => {
  const classes = useStyles();
  const { lists } = useContext(userContext);
  return (
    <Box px={10}>
      <Typography className={classes.title} align="left" variant="h6">
        My Shopping Lists:
      </Typography>
      <Grid container spacing={2}>
        {lists &&
          lists.map((list) => {
            return <ListCover key={lists.id} list={list} />;
          })}
        <AddNewList />
      </Grid>
    </Box>
  );
};

export default Lists;
