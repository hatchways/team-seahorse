import React, { useState, createContext } from "react";
export const utilitiesContext = createContext();

const UtilitiesProvider = ({ children }) => {
  const getProperDateInfo = (updateTime, action = 'Updated') => {
    const inSeconds = Math.round(
      (Date.parse(new Date()) - Date.parse(updateTime)) / 1000
    );

    if (inSeconds <= 60) {
      if (inSeconds <= 1) return `${action} ${inSeconds} second ago.`;

      return `${action} ${inSeconds} second ago.`;
    }

    const inMinutes = Math.round(inSeconds / 60);

    if (inMinutes <= 60) {
      if (inMinutes <= 1) return `${action} ${inMinutes} minute ago.`;

      return `${action} ${inMinutes} minutes ago.`;
    }

    const inHours = Math.round(inMinutes / 60);

    if (inHours <= 24) {
      if (inHours <= 1) return `${action} ${inHours} hour ago.`;

      return `${action} ${inHours} hours ago.`;
    }
    
    return `${action} ${Math.round(inHours/24)} days ago.`;
  };

  return (
    <utilitiesContext.Provider
      value={{
        getProperDateInfo,
      }}
    >
      {children}
    </utilitiesContext.Provider>
  );
};

export default UtilitiesProvider;
