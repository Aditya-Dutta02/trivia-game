// src/contexts/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // const newSocket = io("http://localhost:5000", {
    //   transports: ["websocket"],
    // });
    const newSocket = io("http://192.168.1.124:5000", {
      transports: ["websocket"],
    });
    setSocket(newSocket);
    newSocket.on("connect", () => {
      console.log("Connected to server:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
