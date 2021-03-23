import React, { useState, createContext, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
export const userContext = createContext();

const UsersProvider = ({ children }) => {
  const [token, setToken] = useState(Cookies.get("token"));
  const [user, setUser] = useState(null);
  const [lists, setLists] = useState(null);

  //#region  List Related
  const [currentList, setCurrentList] = useState({});
  const [isListClicked, setIsListClicked] = useState(false);
  const [isAddingProd, setIsAddingProd] = useState(false);
  const [currentListProducts, setCurrentListProducts] = useState([]);
  const [isLoadingListProducts, setIsLoadingListProducts] = useState(false);
  //#endregion

  const login = async (email, password) => {
    let data = await fetch("/user/signin", {
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
    let data = await fetch("/user/signup", {
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
      const userResponse = await fetch("/user/currentUser");
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
    await fetch("/user/signout");
    setUser(null);
    setToken(null);
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

  //#region List Related

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
      const results = await fetch(`/lists/${listId}`);

      const parsedresults = await results.json();

      updateCurrentListProducts(parsedresults);

      return parsedresults;
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
      await fetch(`/products/${listId}/${productId}`, {
        method: "DELETE",
      });

      const list = await getListProducts(listId);

      //return the updated list
      return list;
    } catch (err) {
      console.log(err);
      return {
        error: {
          msg: "Server Error",
          data: err,
        },
      };
    }
  };

  //#endregion

  useEffect(() => {
    getList();
    // eslint-disable-next-line
  }, []);

  return (
    <userContext.Provider
      value={{
        user,
        token,
        lists,
        isListClicked,
        currentListProducts,
        isAddingProd,
        isLoadingListProducts,
        currentList,
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
        updateIsListClicked,
        updateIsAddingProd,
        updateIsLoadingListProducts,
        setIsAddingProd,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export default UsersProvider;
