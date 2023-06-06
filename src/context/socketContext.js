import { createContext } from "react";
import { io } from "socket.io-client";
import { SocketServer } from "../dataConfig";

// const socket = io(SocketServer);
export const SocketContext = createContext();

export const SocketContextProvider = (props) => {
  const socket = {};
  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
