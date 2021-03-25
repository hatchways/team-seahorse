import { useState, createContext, useContext } from "react";
import { Manager } from "socket.io-client";
import { userContext } from "./UsersProvider";

export const socketContext = createContext();
//TODO: Environmentalize socket URL.
const manager = new Manager("ws://localhost:3002", {
  reconnectionAttempts: 5,
});

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { token } = useContext(userContext);
  const openConnection = () => {
    if (socket != null && socket.connected) throw "Already open.";
    else
      setSocket(
        manager.socket("/", {
          auth: { token },
        })
      );
  };

  return (
    <socketContext.Provider value={{ socket, openConnection }}>
      {children}
    </socketContext.Provider>
  );
};

export default SocketProvider;
