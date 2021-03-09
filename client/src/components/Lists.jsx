import { Box, Grid, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import AddNewList from "./AddNewList";
import ListCover from "./ListCover";

const useStyles = makeStyles(() => ({
  title: {
    marginBottom: 20,
  },
}));

const Lists = () => {
  const classes = useStyles();
  return (
    <Box px={10}>
      <Typography className={classes.title} align="left" variant="h6">
        My Shopping Lists:
      </Typography>
      <Grid container spacing={2}>
        <ListCover />
        <ListCover />
        <ListCover />
        <AddNewList />
      </Grid>
    </Box>
  );
};

export default Lists;
