import axiosRequest from "@/config/axios";
import { toast } from "react-toastify";
import { create } from "zustand";
import { io } from "socket.io-client";

const BU = "http://localhost:5000";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLogginging: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosRequest.get("/auth/check");
      set({ authUser: res.data.user });
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosRequest.post("auth/signup", data);
      set({ authUser: res.data.user });

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logOut: async () => {
    try {
      await axiosRequest.post("auth/logout", {}, { withCredentials: true });
      set({ authUser: null });
      window.localStorage.removeItem("authUser");
      get().disconnectSocket();
      toast.success("Đăng xuất thành công");
    } catch (error) {
      toast.error(error);
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosRequest.post("/auth/login", data);
      localStorage.setItem("authUser", JSON.stringify(res.data));
      set({ authUser: res.data.user });

      toast.success("Đăng nhập thành công");

      get().connectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  connectSocket: () => {
    const authUser = JSON.parse(window.localStorage.getItem("authUser"));
    if (!authUser) return;

    const existingSocket = get().socket;

    if (existingSocket && existingSocket.connected) {
      return;
    }

    const socket = io(BU, {
      query: {
        userId: authUser._id,
      },
    });

    set({ socket });

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("getOnlineUsers", (userIds) => {
      if (userIds) {
        window.localStorage.setItem("onlineUsers", JSON.stringify(userIds));
      }
    });

    socket.on("newNotification", (notification) => {
      toast.success(notification.content);
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.disconnect();
      console.log("Socket disconnected");
      set({ socket: null });
    }

    // window.addEventListener("beforeunload", () => {
    //   if (socket) {
    //     socket.disconnect();
    //   }
    // });
  },
}));
