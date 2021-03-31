import {
  Button,
  Grid,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import React, { useContext, useEffect, useState, useRef } from "react";
import FollowerNotificationPaper from "../components/FollowerNotificationPaper";
import PriceNotificationPaper from "../components/PriceNotificationPaper";
import { userContext } from "../providers/UsersProvider";
import { PRICE, FOLLOWED, ALL_TYPES_OBJECT } from "../utils/enums";
import { useBottomScrollListener } from "react-bottom-scroll-listener";

const useStyles = makeStyles(() => ({
  paper: {
    width: "fit-content",
    margin: "50px auto 50px auto",
  },
  tab: {
    width: "200px",
  },
  priceNotification: {
    width: "800px",
    height: "fit-content",
    margin: "auto",
    padding: "20px",
  },
  previousPrice: {
    textDecoration: "line-through",
    fontSize: "20px",
  },
  newPrice: {
    fontWeight: "bold",
    color: "red",
    fontSize: "30px",
  },
}));

const AllNotifications = () => {
  const classes = useStyles();
  const listInnerRef = useRef();

  const { getNotifications, loadUser, user } = useContext(userContext);

  const [value, setValue] = React.useState(0);
  const [notifications, setNotifications] = useState([]);
  const [listType, setListType] = useState("all");
  const [page, setPage] = useState(2);
  const [allNotificationsCollected, setAllNotificationsCollected] = useState(
    false
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    acquireNotifications();
  }, [user]);

  const acquireNotifications = async (notificationType) => {
    const result = await getNotifications({ type: notificationType });
    setNotifications(result);
  };

  const addNotifications = async (page, notificationType) => {
    const result = await getNotifications({ type: notificationType, page });
    console.log(result);
    setNotifications([...notifications, ...result]);
  };

  useBottomScrollListener(() => {
    if (allNotificationsCollected === false) {
      if (listType === "all") {
        addNotifications(page);
        setPage(page + 1);
      } else if (listType === PRICE) {
        addNotifications(page, PRICE);
        setPage(page + 1);
      } else if (listType === FOLLOWED) {
        addNotifications(page, FOLLOWED);
        setPage(page + 1);
      }
    }
  });

  return (
    <Grid
      container
      direction="column"
      onScroll={() => {
        console.log("asdiuhaudansjd");
      }}
      ref={listInnerRef}
    >
      <Typography variant="h2" style={{ margin: "25px auto 0 auto" }}>
        Notifications
      </Typography>

      <Paper className={classes.paper}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab
            label="All"
            className={classes.tab}
            onClick={() => {
              setPage(1);
              setListType("all");
              acquireNotifications();
            }}
          />
          <Tab
            label="Price"
            className={classes.tab}
            onClick={() => {
              setPage(1);
              setListType(PRICE);
              acquireNotifications(PRICE);
            }}
          />
          <Tab
            label="Followers"
            className={classes.tab}
            onClick={() => {
              setPage(1);
              setListType(FOLLOWED);
              acquireNotifications(FOLLOWED);
            }}
          />
        </Tabs>
      </Paper>

      <Button
        onClick={() => {
          console.log(notifications);
        }}
      >
        LALALALALALALALALA
      </Button>

      {notifications.length > 0 &&
        notifications.map((notification) => {
          if (notification.type === PRICE)
            return <PriceNotificationPaper notification={notification} />;
          if (notification.type === FOLLOWED)
            return <FollowerNotificationPaper notification={notification} />;

          return null;
        })}
    </Grid>
  );
};

export default AllNotifications;
