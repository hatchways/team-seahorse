import {
  AppBar,
  Avatar,
  Box,
  makeStyles,
  Toolbar,
  Typography,
  Button,
  Popover,
  MenuItem,
  Badge,
} from "@material-ui/core";
import React, { useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import logo from "../images/logo.png";
import { userContext as context } from "../providers/UsersProvider";
import NotificationPopover from "./NotificationPopover";
import SnackbarAlert from "./SnackbarAlert";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    backgroundColor: "white",
    height: 100,
  },
  navItem: {
    paddingRight: 40,
  },
  typography: {
    padding: theme.spacing(2),
  },
  profileBtn: {
    width: "120px",
  },
  avatar: {
    marginRight: 20,
  },
}));

const Header = () => {
  const classes = useStyles();
  const history = useHistory();
  const userContext = useContext(context);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorNotification, setAnchorNotification] = React.useState(null);
  const open = Boolean(anchorEl);
  const notificationOpen = Boolean(anchorNotification);

  const { logout, user, loadUser, notificationCount } = userContext;

  useEffect(async () => {
    acquireUser();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickNotification = (event) => {
    setAnchorNotification(event.currentTarget);
  };

  const handleCloseNotification = () => {
    setAnchorNotification(null);
  };

  const signoutHandler = async () => {
    handleClose();
    await logout();
    history.push("/sign-in");
  };

  const acquireUser = async () => {
    loadUser();
  };

  return (
    <AppBar position="relative" elevation={1}>
      <SnackbarAlert />
      <Toolbar className={classes.toolbar}>
        <Box
          component="img"
          src={logo}
          alt="logo"
          width={229}
          height={28}
          px={5}
        />
        {user && (
          <>
            <Box
              flexGrow={1}
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              px={5}
            >
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
                to="/followers"
                color="textPrimary"
              >
                Followers
              </Typography>

              <Badge badgeContent={notificationCount} color="primary">
                <Button color="textPrimary" onClick={handleClickNotification}>
                  Notifications
                </Button>
              </Badge>

              <NotificationPopover
                handleCloseNotification={handleCloseNotification}
                anchorNotification={anchorNotification}
                notificationOpen={notificationOpen}
              />
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Avatar className={classes.avatar} />
              <Button
                color="primary"
                onClick={handleClick}
                className={classes.profileBtn}
              >
                {user && user.name}
              </Button>
              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={signoutHandler}>Logout</MenuItem>
              </Popover>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
