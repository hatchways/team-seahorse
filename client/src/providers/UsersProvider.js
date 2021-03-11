import React, { useState, useEffect, createContext, useRef } from "react";

export const userContext = createContext();

const UsersProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <userContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export default UsersProvider;
