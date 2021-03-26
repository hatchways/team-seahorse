import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import axios from "axios";

const useStyles = makeStyles(() => ({
  root: {
    "& div": {
      minWidth: "70%",
    },
  },
  followButton: {
    height: 40,
    borderRadius: 28,
    minWidth: "10%",
    marginLeft: "auto",
  },
  pfpPlaceholder: {
    fontSize: 50,
    marginRight: 10,
  },
  userGroupLoading: {
    marginTop: 20,
  },
  userGroupContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "60vh",
  },
}));

//Toggles the state of a user to be following or suggested, and makes the appropriate API call.
//`setFollowing` and `setSuggested` are set at the page level, because that's where those setters are created.
//`isFollowing` is set at the UserGroup level, because a UserGroup can either show users being followed or users not
//being followed.
//`user` is set at the UserCard level, because the UserCard is what describes a particular user.
//NOTE: isFollowing refers to if the user being toggled is currently being followed by our user, not to if the user will be
//toggled to following.
const toggleUserGroup___ = (setFollowing, setSuggested) => (isFollowing) => {
  //Sets the group of users which the user will be moving from.
  const setFromGroup = isFollowing ? setFollowing : setSuggested;
  //Sets the group of user which the user will be moving to.
  const setToGroup = isFollowing ? setSuggested : setFollowing;
  return (user) => async () => {
    await axios
      .create({ withCredentials: true })
      .post(`/followers/${isFollowing ? "unfollow" : "follow"}/${user.id}`);
    //Removes user from the "from group" of users.
    setFromGroup((fromGroup) => {
      let userIndex = fromGroup.indexOf(user);
      return fromGroup
        .slice(0, userIndex)
        .concat(fromGroup.slice(userIndex + 1));
    });
    //Adds user to the "to group" of users
    setToGroup((toGroup) => toGroup.concat(user));
  };
};

const UserCard = ({ user, isFollowing, toggleUserGroup_ }) => {
  const classes = useStyles();

  const [userIsBeingToggled, setUserIsBeingToggled] = useState(false);
  const toggleUserGroup = toggleUserGroup_(user);
  return (
    <Card>
      <CardContent>
        <Grid container alignItems="center">
          <AccountCircleIcon className={classes.pfpPlaceholder} />
          <Typography variant="h6">{user.name}</Typography>
          <Button
            variant="contained"
            color="primary"
            className={classes.followButton}
            disabled={userIsBeingToggled}
            onClick={async () => {
              try {
                setUserIsBeingToggled(true);
                await toggleUserGroup();
              } catch (error) {
                console.error(error);
                setUserIsBeingToggled(false);
              }
            }}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        </Grid>
      </CardContent>
    </Card>
  );
};

//TODO: Should probably have a better name. (Update documentation when name is changed)
const UserGroup = (
  { users, isLoading, type, toggleUserGroup__, hidden } = { hidden: false }
) => {
  const classes = useStyles();
  if (hidden) return <></>;
  return (
    <>
      {!isLoading && users != null && (
        <Paper>
          {users.map((user) => (
            <UserCard
              user={user}
              isFollowing={type === "following"}
              toggleUserGroup_={toggleUserGroup__(type === "following")}
              key={user.id}
            />
          ))}
        </Paper>
      )}
      {!isLoading && users === null && (
        <div className={classes.userGroupContainer}>
          <Typography color="error" variant="h4">
            Sorry, something went wrong on our side.
          </Typography>
        </div>
      )}
      {isLoading && (
        <div className={classes.userGroupContainer}>
          <CircularProgress className={classes.userGroupLoading} />
        </div>
      )}
    </>
  );
};

const fetchUsers_ = (urlPath, setUsers, setIsLoading) => async () => {
  setIsLoading(true);
  try {
    const result = await axios.create({ withCredentials: true }).get(urlPath);
    setUsers(result.data);
  } catch (error) {
    console.error(error.response);
    setUsers(null);
  }
  setIsLoading(false);
};
const FollowersPage = () => {
  const [isLoadingFollowedUsers, setIsLoadingFollowedUsers] = useState(true);
  const [following, setFollowing] = useState(null);
  useEffect(() => {
    const fetchFollowing = fetchUsers_(
      "/followers/following",
      setFollowing,
      setIsLoadingFollowedUsers
    );
    fetchFollowing();
  }, []);

  const [isLoadingSuggestedUsers, setIsLoadingSuggestedUsers] = useState(true);
  const [suggested, setSuggested] = useState(null);
  useEffect(() => {
    const fetchSuggestions = fetchUsers_(
      "/followers/suggestions",
      setSuggested,
      setIsLoadingSuggestedUsers
    );
    fetchSuggestions();
  }, []);

  const [index, setIndex] = useState(0);
  const handleChange = (_, value) => {
    setIndex(value);
  };

  const classes = useStyles();
  const toggleUserGroup__ = toggleUserGroup___(setFollowing, setSuggested);
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      className={classes.root}
    >
      <Grid item>
        <Box p={6}>
          <Typography variant="h4" align="center">
            Friends
          </Typography>
        </Box>
      </Grid>
      <Grid item>
        <Tabs value={index} variant="fullWidth" onChange={handleChange}>
          <Tab label="FOLLOWING" />
          <Tab label="SUGGESTED" />
        </Tabs>
      </Grid>
      <Grid item>
        <UserGroup
          users={following}
          isLoading={isLoadingFollowedUsers}
          type={"following"}
          toggleUserGroup__={toggleUserGroup__}
          hidden={index !== 0}
        />
        <UserGroup
          users={suggested}
          isLoading={isLoadingSuggestedUsers}
          type={"suggested"}
          toggleUserGroup__={toggleUserGroup__}
          hidden={index !== 1}
        />
      </Grid>
    </Grid>
  );
};

export default FollowersPage;
