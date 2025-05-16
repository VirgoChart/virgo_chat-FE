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
        const response = await axiosRequest.get("/relationships/blocked", {
          data: {
            userid: currentUser.id,
          },
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        });

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
      await axiosRequest.delete("/relationships/unblock", {
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

  return (
    <div className="max-w-2xl w-full mx-auto mt-40 bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
        Người dùng bị chặn
      </h2>

      {blockedUsers?.length === 0 ? (
        <p className="text-gray-500 text-center">Không có người dùng bị chặn</p>
      ) : (
        <ul className="space-y-4">
          {blockedUsers?.map((user) => (
            <li
              key={user.from}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow transition"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={user.to.avatar}
                  alt="avatar"
                  width={40}
                  height={40}
                  quality={100}
                  className="w-10 h-10 object-cover rounded-full border border-gray-300"
                />
                <span className="text-gray-800 font-medium">
                  {user.to?.fullName || "Người dùng ẩn danh"}
                </span>
              </div>
              <button
                onClick={() => showUnblockModal(user)}
                className="text-red-600 hover:text-red-800 flex items-center gap-1 transition font-medium"
              >
                <AiOutlineUnlock size={20} />
                Bỏ chặn
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Modal Xác Nhận */}
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
