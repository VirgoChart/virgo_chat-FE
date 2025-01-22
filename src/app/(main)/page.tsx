"use client";

import { Loader } from "lucide-react";
import Navbar from "@/components/Navbar";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

const BU = "http://localhost:2808";

const Home = () => {
  const { disconnectSocket } = useAuthStore();

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("authUser");
      disconnectSocket();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [disconnectSocket]);
  const user = window.localStorage.getItem("authUser");
  const onlineUsers = JSON.parse(window.localStorage.getItem("onlineUsers"));

  console.log("Online users: ", onlineUsers);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-20 animate-spin"></Loader>
      </div>
    );
  }

  return (
    <main>
      <Navbar />
    </main>
  );
};

export default Home;
