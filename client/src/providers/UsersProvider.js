import React, { useState, createContext, useEffect } from "react";
import axios from "axios";
export const userContext = createContext();

const UsersProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [lists, setLists] = useState(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("Default Message");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  //#region  List Related Variables
  const [currentList, setCurrentList] = useState({});
  const [isListClicked, setIsListClicked] = useState(false);
  const [isAddingProd, setIsAddingProd] = useState(false);
  const [currentListProducts, setCurrentListProducts] = useState([]);
  const [isLoadingListProducts, setIsLoadingListProducts] = useState(false);
  //#endregion

  //#region User Related Functions

  const login = async (email, password) => {
    let data = await fetch("/user/sign-in", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const parsedData = await data.json();

    updateUser(parsedData);

    return parsedData;
  };

  const register = async (name, email, password) => {
    let data = await fetch("/user/sign-up", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const parsedData = await data.json();

    updateUser(parsedData);

    return parsedData;
  };

  //This method will only return the parsed value of the token
  const getCurrentUser = async () => {
    try {
      const userResponse = await fetch("/user/current-user");
      const userData = await userResponse.json();
      return userData;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const getUserById = async (id) => {
    const data = await fetch(`/user/${id}`);
    const parsedData = await data.json();
    return parsedData;
  };

  const logout = async () => {
    await fetch("/user/sign-out");
    setUser(null);
  };

  const updateUser = (userData) => {
    if (userData.user) {
      setUser(userData.user);
    }
  };

  const loadUser = async () => {
    const tokenUserData = await getCurrentUser();

    if (tokenUserData.user) {
      const data = await getUserById(tokenUserData.user.id);
      setUser(data.user);
      return data;
    }

    return { msg: "Error on obtaining user by id " };
  };

  //#endregion

  const axiosWithAuth = () => {
    return axios.create({
      baseURL: process.env.REACT_APP_BACKEND,
      withCredentials: true,
    });
  };

  const getList = async () => {
    try {
      const { data } = await axiosWithAuth().get(`/lists`);
      setLists(data);
    } catch (error) {
      console.error(error);
    }
  };

  //#region List Related Functions

  const updateIsListClicked = (bool) => {
    setIsListClicked(bool);
  };

  const updateIsAddingProd = (bool) => {
    setIsAddingProd(bool);
  };

  const updateIsLoadingListProducts = (bool) => {
    setIsLoadingListProducts(bool);
  };

  const updateCurrentList = (obj) => {
    setCurrentList(obj);
  };

  const updateCurrentListProducts = (obj) => {
    setCurrentListProducts(obj);
  };

  const getListProducts = async (listId) => {
    try {
      const { data } = await axiosWithAuth().get(`/lists/${listId}`);

      updateCurrentListProducts(data);

      return data;
    } catch (err) {
      console.error(err);
      return {
        error: {
          msg: "Something went wrong on our part. Sorry",
          data: err,
        },
      };
    }
  };

  const removeProductInList = async (listId, productId) => {
    try {
      await axiosWithAuth().delete(`/products/${listId}/${productId}`);

      const list = await getListProducts(listId);

      //return the updated list
      return list;
    } catch (err) {
      console.error(err);
      return {
        error: {
          msg: "Server Error",
          data: err,
        },
      };
    }
  };

  //#endregion

  const updateIsSnackbarOpen = (bool) => {
    setIsSnackbarOpen(bool);
  };

  //severity can be error, warning, success, info
  const openSnackbar = (severity = "info", msg) => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setIsSnackbarOpen(true);
  };

  //#region Notification Realted Functions

  const getNotificationCount = async () => {
    try {
      const { data } = await axiosWithAuth().get("/notification/get-count");
      setNotificationCount(data.length);
    } catch (error) {
      console.error(error);
    }
  };

  const getNotifications = async (params = {}) => {
    try {
      if (!user) return [];
      const { data } = await axiosWithAuth().get(
        "/notification/get-notifications",
        {
          params,
        }
      );
      return data;
    } catch (err) {
      console.error(err);
      openSnackbar("error", "There's a problem on our side, sorry!");
    }
  };

  const readNotification = async (id, index) => {
    try {
      const { data } = await axiosWithAuth().put(`/notification/read/${id}`);

      setNotificationCount(notificationCount - 1);
      localReadNotification(index);

      return data;
    } catch (err) {
      console.error(err);
      openSnackbar("error", "There's a problem on our side, sorry!");
    }
  };

  const localReadNotification = (index) => {
    notifications[index].isRead = true;
  };

  const localReadAllNotification = async () => {
    try {
      notifications.forEach((notification) => {
        notification.isRead = true;
      });
      setNotifications(notifications);
      setNotificationCount(0);

      await axiosWithAuth().put("/notification/read-all");
    } catch (err) {
      console.error(err);
      openSnackbar("error", "There's a problem on our side, sorry!");
    }
  };

  const updateNotifications = async () => {
    const notificationsLists = await getNotifications();
    setNotifications(notificationsLists);
  };

  //#endregion

  const hoursDifference = (dt2, dt1) => {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    return Math.abs(Math.round(diff));
  };

  const getTimeDifference = (previousTime) => {
    const currentTime = new Date();
    const parsedInitialDate = new Date(previousTime);

    return hoursDifference(currentTime, parsedInitialDate);
  };

  useEffect(() => {
    getList();
    updateNotifications();
    getNotificationCount();
    // eslint-disable-next-line
  }, [user]);

  //handle toggle isPrivate
  const updateIsPrivate = async (listId, isPrivate) => {
    try {
      const { data } = await axiosWithAuth().put(`/lists/${listId}`, {
        isPrivate: !isPrivate,
      });
      openSnackbar("success", data.message);
      const updatedLists = lists.map((list) => {
        if (list.id === listId) {
          return { ...list, isPrivate: !list.isPrivate };
        }
        return list;
      });
      setLists(updatedLists);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <userContext.Provider
      value={{
        user,
        lists,
        isListClicked,
        currentListProducts,
        isAddingProd,
        isLoadingListProducts,
        currentList,
        isSnackbarOpen,
        snackbarMessage,
        snackbarSeverity,
        notifications,
        notificationCount,
        removeProductInList,
        getListProducts,
        updateCurrentListProducts,
        updateCurrentList,
        setLists,
        login,
        register,
        getCurrentUser,
        logout,
        getUserById,
        loadUser,
        axiosWithAuth,
        updateIsListClicked,
        updateIsAddingProd,
        updateIsLoadingListProducts,
        setIsAddingProd,
        openSnackbar,
        updateIsSnackbarOpen,
        readNotification,
        localReadAllNotification,
        getTimeDifference,
        updateIsPrivate,
        getNotifications,
        updateNotifications,
        getNotificationCount,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export default UsersProvider;
