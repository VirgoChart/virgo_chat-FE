"use client";

import { ReactNode } from "react";
import { SocketContextProvider } from "../context/SocketContext";

const SocketProvider = ({ children }: { children: ReactNode }) => {
  return <SocketContextProvider>{children}</SocketContextProvider>;
};

export default SocketProvider;
