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
    marginRight: 40,
  },
  notificationsLink: {
    //This padding offsets the badge so it doesn't overlap too much with the text.
    paddingRight: "0.75ch",
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

  useEffect(() => {
    acquireUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          onClick={() => history.push("/dashboard")}
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
                <Typography
                  className={classes.notificationsLink}
                  component="a"
                  href="#"
                  onClick={handleClickNotification}
                  color="textPrimary"
                >
                  Notifications
                </Typography>
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
