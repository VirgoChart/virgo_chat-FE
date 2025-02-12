"use client";

import { useEffect, useState } from "react";
import axiosRequest from "@/config/axios";
import { getCookie } from "@/utils/cookies";
import Image from "next/image";
import { toast } from "react-toastify";
import { AiOutlineUnlock } from "react-icons/ai";
import ConfirmModal from "@/components/ConfirmModal";

const BlockedUsers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
  const [users, setUsers] = useState(blockedUsers || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUser = JSON.parse(
    window.localStorage.getItem("authUser") || "{}"
  );
  const jwt = getCookie("jwt");

  const showUnblockModal = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        const response = await axiosRequest.get(
          "/relationships/blocked-users",
          {
            data: {
              userid: currentUser.id,
            },
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
            withCredentials: true,
          }
        );

        setBlockedUsers(response);
      } catch (err) {
        setError("Không thể tải danh sách người dùng bị chặn");
      } finally {
        setLoading(false);
      }
    };

    fetchBlockedUsers();
  }, []);

  const handleUnblock = async () => {
    if (!selectedUser) return;

    try {
      await axiosRequest.delete("/relationships/unblock-user", {
        data: { userId: selectedUser.to._id },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        withCredentials: true,
      });

      setBlockedUsers(
        users.filter((user) => user.to._id !== selectedUser.to._id)
      );
      toast.success(
        `Bỏ chặn ${selectedUser.to.fullName || "người dùng"} thành công!`
      );
    } catch (error) {
      toast.error("Bỏ chặn thất bại, thử lại!");
      console.error("Lỗi khi bỏ chặn:", error);
    } finally {
      setIsModalOpen(false);
      setSelectedUser(null);
    }
  };

  console.log(blockedUsers);

  if (loading) return <p>Đang tải danh sách...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4 bg-white rounded shadow-md mt-40 w-1/2">
      <h2 className="text-xl font-bold mb-4">Người dùng bị chặn</h2>
      {blockedUsers?.length === 0 ? (
        <p>Không có người dùng bị chặn</p>
      ) : (
        <ul className="space-y-2">
          {blockedUsers?.map((user) => (
            <li
              key={user.from}
              className="p-2 border rounded flex gap-3 items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Image
                  src={user.to.avatar}
                  alt="avatar"
                  width={40}
                  height={40}
                  quality={100}
                  className="w-10 h-10 object-cover rounded-full"
                />
                {user.to?.fullName || "Người dùng ẩn danh"}
              </div>
              <button
                onClick={() => showUnblockModal(user)}
                className="text-red-500 hover:text-red-700 transition flex items-center gap-1"
              >
                <AiOutlineUnlock size={20} />
                Bỏ chặn
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Modal Xác Nhận (Component Riêng) */}
      <ConfirmModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleUnblock}
        user={selectedUser}
      />
    </div>
  );
};

export default BlockedUsers;
