/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Link from "next/link";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import axiosRequest from "@/config/axios";
import { getCookie } from "@/utils/cookies";
import { toast } from "react-toastify";
import { GoBlocked } from "react-icons/go";
import { AutoComplete, Input, Modal } from "antd";
import { FaRegMessage } from "react-icons/fa6";
import { useAuthStore } from "../store/useAuthStore";
import NotificationDropdown from "./NotificationDropdown";

const Navbar = () => {
  const { logOut, socket } = useAuthStore();

  const router = useRouter();
  const user =
    typeof window !== "undefined" ? localStorage.getItem("authUser") : null;
  const [users, setUsers] = useState<any[]>([]);
  const [usernameSearch, setUsernameSearch] = useState("");
  const [fullnameSearch, setFullnameSearch] = useState("");
  const [filteredUsernames, setFilteredUsernames] = useState<any[]>([]);
  const [filteredFullnames, setFilteredFullnames] = useState<any[]>([]);
  const jwt = getCookie("jwt");
  const [userId, setUserId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    _id?: string;
    avatar?: string;
    userName?: string;
    fullName?: string;
    createdAt?: string;
  }>({});

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

  const getAllUsers = useCallback(async () => {
    try {
      const res = await axiosRequest.get("/users", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        withCredentials: true,
      });
      setUsers(res);
    } catch (error: any) {
      toast.error(error || "Failed to fetch users");
    }
  }, [jwt]);
  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  useEffect(() => {
    if (usernameSearch) {
      const lowerCaseTerm = usernameSearch.toLowerCase();
      setFilteredUsernames(
        (users || []).filter((user) =>
          user?.userName?.toLowerCase().includes(lowerCaseTerm)
        )
      );
    } else {
      setFilteredUsernames([]);
    }
  }, [usernameSearch, users]);

  useEffect(() => {
    if (fullnameSearch) {
      const lowerCaseTerm = fullnameSearch.toLowerCase();
      setFilteredFullnames(
        (users || []).filter((user) =>
          user?.fullName?.toLowerCase().includes(lowerCaseTerm)
        )
      );
    } else {
      setFilteredFullnames([]);
    }
  }, [fullnameSearch, users]);

  const handleLogout = () => {
    logOut();
    router.push("/login");
  };

  const sendMessageRequest = async () => {
    try {
      const res = await axiosRequest.post(
        "/notifications/create",
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

  return (
    <header className="bg-[#AA8BE2] border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">VirgoChat</h1>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <AutoComplete
              className="w-64"
              options={filteredUsernames.map((user) => ({
                value: user.userName,
                key: user._id,
                label: (
                  <div className="flex items-center gap-2">
                    <Image
                      src={user.avatar}
                      alt={user.userName}
                      className="w-8 h-8 rounded-full"
                      width={32}
                      height={32}
                    />
                    <span>{user.userName}</span>
                  </div>
                ),
              }))}
              value={usernameSearch}
              onChange={setUsernameSearch}
              onSelect={handleSelect}
            >
              <Input.Search placeholder="Tìm kiếm theo username" allowClear />
            </AutoComplete>

            <AutoComplete
              className="w-64"
              options={filteredFullnames.map((user) => ({
                value: user.fullName,
                label: (
                  <div className="flex items-center gap-2">
                    <Image
                      src={user.avatar}
                      alt={user.fullName}
                      className="w-8 h-8 rounded-full"
                      width={32}
                      height={32}
                    />
                    <span>{user.fullName}</span>
                  </div>
                ),
              }))}
              value={fullnameSearch}
              onChange={setFullnameSearch}
              onSelect={handleSelect}
            >
              <Input.Search placeholder="Tìm kiếm theo tên đầy đủ" allowClear />
            </AutoComplete>

            <Link
              href={"/settings"}
              className="btn btn-sm gap-2 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Cài đặt</span>
            </Link>

            {!user ? (
              <Link href={"/login"} className="btn btn-sm gap-2">
                <User className="size-5" />
                <span className="hidden sm:inline">Đăng nhập</span>
              </Link>
            ) : (
              <>
                <Link href={"/user/my-account"} className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Trang cá nhân</span>
                </Link>
                <button
                  className="flex gap-2 items-center"
                  onClick={handleLogout}
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </button>
              </>
            )}
            <NotificationDropdown socket={socket} />
          </div>
        </div>
      </div>
      <Modal
        title="Thông tin người dùng"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {userInfo && (
          <div>
            <Image
              src={userInfo.avatar || ""}
              width={100}
              height={100}
              alt="Avatar"
              className="object-cover rounded-full w-20 h-20"
            />
            <button className="flex items-center justify-center gap-4 bg-red-500 text-white rounded-lg px-4 mt-2">
              <GoBlocked size={10} />
              <span>Block</span>
            </button>

            <button
              onClick={sendMessageRequest}
              className="flex items-center justify-center gap-4 bg-green-600 text-white rounded-lg px-4 mt-2"
            >
              <FaRegMessage size={10} />
              <span>Yêu cầu nhắn tin</span>
            </button>
            <div className="flex flex-col gap-2">
              <p className="text-lg text-dark-700">
                username: {userInfo.userName}
              </p>
              <p className="text-lg text-dark-700">
                fullname: {userInfo.fullName}
              </p>
              <p className="text-lg text-dark-700">
                Tham gia vào: {userInfo.createdAt}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </header>
  );
};

export default Navbar;
