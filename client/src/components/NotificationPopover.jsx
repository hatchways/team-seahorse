import { Grid, Popover, makeStyles, Box, Button } from "@material-ui/core";
import React, { useContext } from "react";
import { userContext } from "../providers/UsersProvider";
import BaseNotification from "./BaseNotification";
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

  const { notifications, localReadAllNotification, token } = useContext(
    userContext
  );

  const useForceUpdate = () => {
    const [, forceUpdate] = React.useState();

    return React.useCallback(() => {
      forceUpdate((s) => !s);
    }, []);
  };

  const forceRender = useForceUpdate();

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
          <Button
            onClick={() => {
              console.log(token);
            }}
          >
            View All Notification
          </Button>
          <Button
            onClick={() => {
              localReadAllNotification();
              forceRender();
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
