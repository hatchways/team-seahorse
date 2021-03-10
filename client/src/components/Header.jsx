import {
  AppBar,
  Avatar,
  Box,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/logo.png";

const useStyles = makeStyles(() => ({
  toolbar: {
    backgroundColor: "white",
    height: 100,
  },
  navItem: {
    paddingRight: 40,
  },
}));

const Header = () => {
  const classes = useStyles();

  return (
    <AppBar position="relative" elevation={1}>
      <Toolbar className={classes.toolbar}>
        <Box
          component="img"
          src={logo}
          alt="logo"
          width={229}
          height={28}
          px={5}
        />
        <Box flexGrow={1} display="flex" justifyContent="flex-end" px={5}>
          <Typography
            className={classes.navItem}
            component={Link}
            to="/dashboard"
            color="textPrimary"
          >
            Shopping Lists
          </Typography>
          <Typography
            className={classes.navItem}
            component={Link}
            to="/friends"
            color="textPrimary"
          >
            Friends
          </Typography>
          <Typography color="textPrimary">Notifications</Typography>
        </Box>
        <Box
          display="flex"
          width="100px"
          px={5}
          alignItems="center"
          justifyContent="space-between"
        >
          <Avatar />
          <Typography color="textPrimary">Profile</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;