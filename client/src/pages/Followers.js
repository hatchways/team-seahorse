import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
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
  followButton: {
    height: 40,
    borderRadius: 28,
    width: 120,
    marginLeft: "auto",
  },
  pfpPlaceholder: {
    fontSize: 50,
    marginRight: 10,
  },
  //TODO: Needs better name
  followersPageItem: {
    width: 750,
  },
}));

//TODO: Consider having one list of users and adding an `isFollowing` property. Probably less overhead that way.
//TODO: Add some more comments

//Toggles the state of a user to be following or suggested, and makes the appropriate API call.
//NOTE: isFollowing refers to if the user being toggled is currently being followed by our user, not to if the user will be
//toggled to following.
const toggleUserGroup___ = (setFollowing, setSuggested) => (isFollowing) => {
  //Sets the group of users which the user will be moving from.
  const setFromGroup = isFollowing ? setFollowing : setSuggested;
  //Sets the group of user which the user will be moving to.
  const setToGroup = isFollowing ? setSuggested : setFollowing;
  return (user) => async () => {
    try {
      await axios
        .create({ withCredentials: true })
        .post(`/followers/${isFollowing ? "unfollow" : "follow"}/${user.id}`);
      //Removes user from the "from group" of users.
      setFromGroup((fromGroup) => {
        let userIndex = fromGroup.indexOf(user);
        if (userIndex !== -1)
          return fromGroup
            .slice(0, userIndex)
            .concat(fromGroup.slice(userIndex + 1));
        else return fromGroup;
      });
      //Adds user to the "to group" of users
      setToGroup((toGroup) => toGroup.concat(user));
    } catch (error) {}
  };
};

const UserCard = ({ user, isFollowing, toggleUserGroup_ }) => {
  const classes = useStyles();
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
            onClick={toggleUserGroup_(user)}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        </Grid>
      </CardContent>
    </Card>
  );
};

const Users = (
  { users, isLoading, type, toggleUserGroup__, hidden } = { hidden: false }
) => {
  if (hidden) return <></>;
  //TODO: Implement error view and loading view
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
      {!isLoading && users === null && "error"}
      {isLoading && "please wait"}
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
    <Grid container direction="column" alignItems="center">
      <Grid item className={classes.followersPageItem}>
        <Box p={6}>
          <Typography variant="h4" align="center">
            Friends
          </Typography>
        </Box>
      </Grid>
      <Grid item className={classes.followersPageItem}>
        <Tabs value={index} variant="fullWidth" onChange={handleChange}>
          <Tab label="FOLLOWING" />
          <Tab label="SUGGESTED" />
        </Tabs>
      </Grid>
      <Grid item className={classes.followersPageItem}>
        <Users
          users={following}
          isLoading={isLoadingFollowedUsers}
          type={"following"}
          toggleUserGroup__={toggleUserGroup__}
          hidden={index !== 0}
        />
        <Users
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
