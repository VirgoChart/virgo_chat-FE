import exp from "constants";
import { createContext, ReactNode, use, useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { io, Socket } from "socket.io-client";

interface iSocketContext {}

export const SocketContext = createContext<iSocketContext | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);
  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
