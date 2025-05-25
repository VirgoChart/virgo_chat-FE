/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Link from "next/link";
import { LogOut, MessageSquare, Settings, User, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import axiosRequest from "@/config/axios";
import { getCookie } from "@/utils/cookies";
import { toast } from "react-toastify";
import { GoBlocked } from "react-icons/go";
import { AutoComplete, Avatar, Input, Modal } from "antd";
import { FaRegMessage } from "react-icons/fa6";
import { useAuthStore } from "../store/useAuthStore";
import NotificationDropdown from "./NotificationDropdown";
import { Drawer } from "antd";
import dayjs from "dayjs";
import { FaUserAstronaut, FaBan } from "react-icons/fa";
import BlockUserModal from "../app/(main)/blocked-user/BlockUserModal";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { logOut, socket } = useAuthStore();
  const router = useRouter();
  const user =
    typeof window !== "undefined" ? localStorage.getItem("authUser") : null;
  interface User {
    _id: string;
    userName: string;
    fullName: string;
    avatar?: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [usernameSearch, setUsernameSearch] = useState("");
  const [filteredUsernames, setFilteredUsernames] = useState<any[]>([]);
  const jwt = getCookie("jwt");
  const [userId, setUserId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    relationshipType: string;
    _id?: string;
    avatar?: string;
    userName?: string;
    fullName?: string;
    createdAt?: string;
  }>({ relationshipType: "" });

  const [requestText, setRequestText] = useState("Yêu cầu nhắn tin");

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await axiosRequest.get("/notifications", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        withCredentials: true,
      });

      setNotifications(data.notifications);
    } catch (err: any) {
      console.error("Lỗi khi lấy thông báo:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const showModalInfoUser = async (userId: string) => {
    try {
      const res = await axiosRequest.get(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        withCredentials: true,
      });
      setUserInfo(res);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Failed to fetch user info", error);
    }
  };

  const handleSelect = (value: string, option: any) => {
    const userId = option.key;
    setUserId(userId);
    showModalInfoUser(userId);
  };

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Debounce the search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm.trim() === "") {
      setFilteredUsers([]);
      return;
    }

    const fetchUsers = async (keyword: string) => {
      try {
        const res = await axiosRequest.get("/users", {
          params: { q: keyword, limit: 10 },
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        });
        setFilteredUsers(res.data);
      } catch (error) {
        console.error("Lỗi tìm kiếm người dùng:", error);
      }
    };

    fetchUsers(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const getAllUsers = useCallback(async () => {
    try {
      const res = await axiosRequest.get("/users", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        withCredentials: true,
      });
      setUsers(res);
      console.log("user", res);
    } catch (error: any) {
      toast.error(error || "Failed to fetch users");
    }
  }, [jwt]);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  // useEffect(() => {
  //   if (searchTerm) {
  //     const lowerCaseTerm = searchTerm.toLowerCase();

  //     // Ensure users is always an array before applying .filter
  //     const results = Array.isArray(users)
  //       ? users.filter(
  //           (user) =>
  //             user?.userName?.toLowerCase().includes(lowerCaseTerm) ||
  //             user?.fullName?.toLowerCase().includes(lowerCaseTerm)
  //         )
  //       : []; // Default to empty array if users is not an array

  //     setFilteredUsers(results);
  //   } else {
  //     setFilteredUsers([]); // Clear results if there's no search term
  //   }
  // }, [searchTerm, users]);

  const handleLogout = () => {
    router.replace("/login");
    setIsDrawerOpen(false);
    logOut();
  };

  const sendMessageRequest = async () => {
    try {
      setRequestText("Đang chờ xác nhận ...");
      const res = await axiosRequest.post(
        "/notifications",
        {
          receiverIds: [userInfo._id],
          roomType: "private",
        },
        { withCredentials: true }
      );
    } catch (error: any) {
      toast.error(error);
    }
  };

  const deleteMessageRequest = async () => {
    try {
      setRequestText("Yêu cầu nhắn tin");
      const res = await axiosRequest.delete(`/notifications/${userInfo._id}`, {
        withCredentials: true,
      });
    } catch (error: any) {
      toast.error(error);
    }
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  const blockUser = async () => {
    try {
      setRequestText("Block");
      const res = await axiosRequest.post(
        "/relationships/block",
        {
          userId: userInfo._id,
        },
        { withCredentials: true }
      );
      toast.success(res.message);
      setIsBlockModalOpen(false);
      setIsModalVisible(false);
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const unBlockUser = async () => {
    try {
      const res = await axiosRequest.delete("/relationships/unblock-user", {
        data: { userId: userInfo._id },
        withCredentials: true,
      });

      toast.success(res.message);
      setIsBlockModalOpen(false);
      setIsModalVisible(false);
      setRequestText("Block");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <header className="bg-[#AA8BE2] border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="items-center gap-8 lg:block hidden">
            <Link
              href="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center bg-white-200">
                <Image
                  className="object-cover p-0"
                  src="/images/logoVirgo.png"
                  width={120}
                  height={120}
                  alt="Virgo"
                />
              </div>
            </Link>
          </div>

          <AutoComplete
            className="w-96"
            options={filteredUsers.map((user: User) => ({
              value: user.userName,
              key: user._id,
              label: (
                <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <Image
                    src={user.avatar || "/default-avatar.png"}
                    alt={user.userName}
                    className="w-8 h-8 rounded-full object-cover"
                    width={32}
                    height={32}
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">
                      {user.userName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {user.fullName}
                    </span>
                  </div>
                </div>
              ),
            }))}
            value={searchTerm}
            onChange={setSearchTerm}
            onSelect={handleSelect}
          >
            <Input.Search
              placeholder="Tìm kiếm người dùng"
              allowClear
              className="rounded-lg"
            />
          </AutoComplete>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border">
            <Link
              href="/chat"
              className={`flex items-center gap-2 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 ${
                isActive("/chat")
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Chat</span>
            </Link>

            <Link
              href="/settings"
              title="Cài đặt"
              className={`flex items-center gap-2 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 ${
                isActive("/settings")
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Settings</span>
            </Link>

            <Link
              href="/blocked-user"
              title="Xem danh sách chặn"
              className={`flex items-center gap-2 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 ${
                isActive("/blocked-user")
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              <GoBlocked className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Blocked</span>
            </Link>

            {!user ? (
              <Link
                href="/login"
                className={`flex items-center gap-2 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 ${
                  isActive("/login")
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                <User className="size-5" />
                <span className="hidden sm:inline text-sm">Đăng nhập</span>
              </Link>
            ) : (
              <Link
                href="/user/my-account"
                title="Trang cá nhân"
                className={`flex items-center gap-2 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100 ${
                  isActive("/user/my-account")
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                <User className="size-5" />
                <span className="hidden sm:inline text-sm">Profile</span>
              </Link>
            )}

            <NotificationDropdown socket={socket} />
          </div>

          {/* Menu Mobile */}
          <button
            className="md:hidden p-2 rounded-lg bg-white shadow-md"
            onClick={() => setIsDrawerOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Drawer Menu */}
          <Drawer
            title="Menu"
            placement="right"
            onClose={() => setIsDrawerOpen(false)}
            open={isDrawerOpen}
          >
            <div className="flex flex-col gap-4">
              <AutoComplete
                className="w-96"
                options={filteredUsers.map((user: User) => ({
                  value: user.userName,
                  key: user._id,
                  label: (
                    <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                      <Image
                        src={user.avatar || "/default-avatar.png"}
                        alt={user.userName}
                        className="w-8 h-8 rounded-full object-cover"
                        width={32}
                        height={32}
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800">
                          {user.userName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {user.fullName}
                        </span>
                      </div>
                    </div>
                  ),
                }))}
                value={searchTerm}
                onChange={setSearchTerm}
                onSelect={handleSelect}
              >
                <Input.Search
                  placeholder="Tìm kiếm người dùng"
                  allowClear
                  className="rounded-lg"
                />
              </AutoComplete>

              <Link href={"/chat"} className="btn btn-block">
                <MessageSquare className="w-4 h-4" />
                Chat
              </Link>

              <Link href={"/settings"} className="btn btn-block">
                <Settings className="w-4 h-4" />
                Cài đặt
              </Link>

              {!user ? (
                <Link href={"/login"} className="btn btn-block">
                  <User className="size-5" />
                  Đăng nhập
                </Link>
              ) : (
                <>
                  <Link
                    title="Trang cá nhân"
                    href={"/user/my-account"}
                    className="btn btn-block"
                  >
                    <User className="size-5" />
                  </Link>
                  <button
                    className="btn btn-block bg-red-500 text-white"
                    onClick={handleLogout}
                  >
                    <LogOut className="size-5" />
                    Đăng xuất
                  </button>
                </>
              )}
            </div>
          </Drawer>
        </div>
      </div>

      <Modal
        title={null}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className="custom-modal"
      >
        {userInfo && (
          <div className="p-6 bg-white rounded-lg relative">
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24">
                <Avatar
                  src={userInfo?.avatar || ""}
                  size={100}
                  // alt="Avatar"
                  className="border border-gray-400 m-0"
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                {userInfo.userName}
              </h2>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => {
                    setIsBlockModalOpen(true);
                    {
                      userInfo.relationshipType === "block"
                        ? setRequestText("unBlock")
                        : setRequestText("Block");
                    }
                  }}
                  className={`flex items-center justify-center gap-2 ${
                    userInfo.relationshipType === "block"
                      ? "bg-gray-500 hover:bg-gray-600"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white font-medium rounded-lg px-4 py-2 transition-all`}
                >
                  <GoBlocked size={16} />
                  <span>
                    {userInfo.relationshipType === "block"
                      ? "Bỏ Block"
                      : "Block"}
                  </span>
                </button>

                {userInfo.relationshipType === "friend" ? (
                  <button
                    onClick={() => toast.success("Các bạn đã là bạn bè")}
                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg px-4 py-2 transition-all"
                  >
                    <FaUserAstronaut size={16} />
                    <span>Bạn bè</span>
                  </button>
                ) : userInfo.relationshipType === "block" ? (
                  <button
                    className="flex items-center justify-center gap-2 bg-gray-500 text-white font-medium rounded-lg px-4 py-2 cursor-not-allowed opacity-60"
                    disabled
                  >
                    <FaBan size={16} />
                    <span>Blocked</span>
                  </button>
                ) : (
                  <button
                    onClick={sendMessageRequest}
                    className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg px-4 py-2 transition-all"
                  >
                    <FaRegMessage size={16} />
                    <span>Gửi yêu cầu nhắn tin</span>
                  </button>
                )}
                {/* 
                {requestText === "Đang chờ xác nhận ..." && (
                  <button className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg px-4 py-2 transition-all">
                    <GoBlocked size={16} />
                    <span>Hủy yêu cầu</span>
                  </button>
                )} */}
              </div>

              <div className="mt-4 w-full border-t pt-4 flex flex-col gap-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Username:</span>
                  <span className="font-medium">{userInfo.userName}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Full Name:</span>
                  <span className="font-medium">{userInfo.fullName}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tham gia vào:</span>
                  {userInfo.createdAt ? formatDate(userInfo.createdAt) : "N/A"}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <BlockUserModal
        open={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onConfirm={() =>
          requestText === "unBlock" ? unBlockUser() : blockUser()
        }
        requestText={requestText}
      />
    </header>
  );
};

export default Navbar;
