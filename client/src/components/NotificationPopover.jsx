import { Grid, Popover, makeStyles, Box, Button } from "@material-ui/core";
import React, { useContext, useEffect } from "react";
import { userContext } from "../providers/UsersProvider";
import BaseNotification from "./BaseNotification";
import { socketContext } from "../providers/SocketProvider";
const useStyles = makeStyles((theme) => ({
  topBar: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
}));

const NotificationPopover = ({
  handleCloseNotification,
  anchorNotification,
  notificationOpen,
}) => {
  const classes = useStyles();
  const {
    notifications,
    localReadAllNotification,
    getNotifications,
  } = useContext(userContext);
  const { socket, openConnection } = useContext(socketContext);

  useEffect(() => {
    if (socket == null) openConnection();
    else {
      socket.on("new-notifications", () => {
        getNotifications();
      });
    }
  }, [socket]);

  return (
    <Popover
      open={notificationOpen}
      anchorEl={anchorNotification}
      onClose={handleCloseNotification}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Grid container direction="column" style={{}}>
        <Box className={classes.topBar}>
          <Button>View All Notification</Button>
          <Button
            onClick={() => {
              localReadAllNotification();
            }}
          >
            Mark as Read All
          </Button>
        </Box>

        {notifications &&
          notifications.map((notification, index) => {
            return (
              <BaseNotification
                type={notification.type}
                notification={notification}
                index={index}
              />
            );
          })}
      </Grid>
    </Popover>
  );
};

export default NotificationPopover;
