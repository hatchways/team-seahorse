import { Box, Grid, List, Typography } from "@material-ui/core";
import React from "react";
import ListCover from "./ListCover";

const Lists = () => {
  return (
    <Box px={10}>
      <Typography align="left" variant="h6">
        My Shopping Lists:
      </Typography>
      <Grid container spacing={2}>
        <ListCover />
        <ListCover />
        <ListCover />
        <ListCover />
      </Grid>
    </Box>
  );
};

export default Lists;
