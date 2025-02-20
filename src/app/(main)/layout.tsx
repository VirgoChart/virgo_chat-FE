"use client";

import { ReactNode, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Loader } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function MainLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { disconnectSocket, connectSocket, socket } = useAuthStore();
  const [user, setUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    connectSocket();
  }, []);

  useEffect(() => {
    const authUser = window.localStorage.getItem("authUser");
    const onlineUsersData = window.localStorage.getItem("onlineUsers");

    if (authUser) setUser(JSON.parse(authUser));
    if (onlineUsersData) setOnlineUsers(JSON.parse(onlineUsersData));
  }, []);

  console.log("Online users: ", onlineUsers);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-20 animate-spin" />
      </div>
    );
  }
  return (
    <div>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
