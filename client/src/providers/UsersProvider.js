import React, { useState, createContext, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
export const userContext = createContext();

const UsersProvider = ({ children }) => {
  const [token, setToken] = useState(Cookies.get("token"));
  const [user, setUser] = useState(null);
  const [lists, setLists] = useState(null);

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
    let results = await fetch("/user/currentUser");
    results = await results.json();
    return results;
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

  useEffect(() => {
    getList();
    // eslint-disable-next-line
  }, [user]);

  return (
    <userContext.Provider
      value={{
        user,
        token,
        lists,
        login,
        register,
        getCurrentUser,
        logout,
        getUserById,
        loadUser,
        axiosWithAuth,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export default UsersProvider;
