import { useState, createContext } from "react";
import { Manager } from "socket.io-client";

export const socketContext = createContext();
//TODO: Environmentalize socket URL.
const manager = new Manager("ws://localhost:3002", {
  reconnectionAttempts: 5,
  withCredentials: true,
});

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const openConnection = () => {
    if (socket != null && socket.connected) throw "Already open.";
    else setSocket(manager.socket("/"));
  };

  return (
    <socketContext.Provider value={{ socket, openConnection }}>
      {children}
    </socketContext.Provider>
  );
};

export default SocketProvider;
