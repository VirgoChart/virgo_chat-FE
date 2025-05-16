"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Camera, Loader, LogOut, Mail, User } from "lucide-react";
import Image from "next/image";
import axiosRequest from "@/config/axios";
import { getCookie } from "@/utils/cookies";
import { toast } from "react-toastify";
import Spin from "@/components/ui/Spin";
import { TbFaceId } from "react-icons/tb";
import UpdateFaceIDModal from "@/components/UpdateFaceID";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const { isUpdatingProfile, updateProfile, logOut } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState<string | ArrayBuffer | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [isUpdateFaceIDModalOpen, setIsUpdateFaceIDModalOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    router.replace("/login");
    logOut();
  };

  const authUser = JSON.parse(window.localStorage.getItem("authUser") || "{}");
  const authToken = getCookie("jwt");

  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    userName: authUser?.userName || "",
  });

  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);

      const formData = new FormData();
      formData.append("avatar", file);
      setIsLoading(true);
      try {
        const response = await axiosRequest.put(
          "/auth/update/avatar",
          {
            avatar: base64Image,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            withCredentials: true,
          }
        );

        window.localStorage.setItem("authUser", JSON.stringify(response));
        setSelectedImg(response.avatar);
        setIsLoading(false);
        toast.success("Update ảnh thành công!");
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Đã xảy ra lỗi khi cập nhật.");
      }
    };
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { fullName, userName } = formData;
    const updatedData = { fullName, userName };

    try {
      const response = await axiosRequest.put(
        "/auth/update/info",
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Cập nhật thành công!");
      window.localStorage.setItem("authUser", JSON.stringify(response));
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleUpdatePassword = async (e: any) => {
    e.preventDefault();

    setIsDisable(true);

    const formData = new FormData();
    formData.append("oldPassword", oldPassword);
    formData.append("newPassword", newPassword);

    try {
      const res = await axiosRequest.put(
        "/auth/update/password",
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        { withCredentials: true }
      );

      toast.success("Cập nhật mật khẩu thành công!");
      setIsDisable(false);
      setIsModalOpen(false);
      setNewPassword("");
      setOldPassword("");
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <Spin isLoading={isLoading}>
      <div className="py-20 -mt-6 bg-gradient-to-b from-violet-100 to-white">
        <div className="max-w-2xl mx-auto p-4">
          <form
            className="rounded-2xl p-8 space-y-8 bg-white shadow-xl border border-gray-200"
            onSubmit={handleSubmit}
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold text-violet-700">
                Tài khoản của tôi
              </h1>
            </div>

            {/* Avatar upload section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Image
                  src={selectedImg || authUser?.avatar || "/avatar.png"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4 border-violet-300 shadow-lg"
                  width={50}
                  height={50}
                  quality={100}
                />
                <label
                  htmlFor="avatar-upload"
                  className={`absolute bg-dark-200 bottom-0 right-0 bg-violet-600 hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                    isUpdatingProfile
                      ? "animate-pulse pointer-events-none opacity-50"
                      : ""
                  }`}
                >
                  <Camera className="w-7 h-7 text-blue font-bold" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <div
                className="px-5 py-2 cursor-pointer bg-blue-100 flex justify-center items-center gap-3 rounded-lg hover:bg-blue-200 transition"
                onClick={() => setIsUpdateFaceIDModalOpen(true)}
              >
                <TbFaceId size={28} color="blue" />
                <span className="text-blue-800 font-medium">
                  Cập nhật FaceID
                </span>
              </div>
            </div>

            {/* Form fields */}
            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-sm text-gray-500 flex items-center gap-2 bg-white">
                  <User className="w-4 h-4" />
                  Tên đầy đủ
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="px-4 bg-white py-2.5 rounded-lg w-full border bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-gray-500 flex items-center gap-2 bg-white">
                  <User className="w-4 h-4" />
                  Username
                </div>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  className="px-4 bg-white py-2.5 rounded-lg w-full border bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Địa chỉ Email
                </div>
                <input
                  type="email"
                  name="email"
                  disabled
                  value={authUser?.email}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 w-full rounded-lg border bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Submit button */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-3 hover:scale-105 rounded-lg bg-violet-600 hover:bg-violet-700 text-blue-600 hover:bg-blue-300 hover:text-white border border-black bg-white font-semibold transition-all"
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? "Đang load..." : "Lưu thay đổi"}
              </button>
            </div>

            {/* Account info section */}
            <div className="mt-6 rounded-xl bg-violet-50 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-violet-800 mb-4">
                Thông tin tài khoản
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-gray-300">
                  <span>Tham gia vào</span>
                  <span>{authUser?.createdAt?.split("T")[0]}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Trạng thái</span>
                  <span className="text-green-500 font-medium">Active</span>
                </div>
                <div className="flex gap-3 items-center justify-center pt-4">
                  <button
                    className="w-full px-4 py-2 bg-white text-blue-600 font-medium rounded-lg border hover:bg-blue-300 hover:text-white transition"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Cập nhật mật khẩu
                  </button>
                  <button
                    title="Đăng xuất"
                    className="flex items-center px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
                    onClick={handleLogout}
                  >
                    <LogOut className="size-5 mr-2" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Modal dùng class Tailwind cho đẹp hơn */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg">
              <h3 className="text-xl font-semibold text-violet-700 mb-4">
                Cập nhật mật khẩu
              </h3>
              <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Mật khẩu cũ
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu cũ"
                      className="flex-1 px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      disabled={isDisable}
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="text-lg"
                    >
                      {showOldPassword ? "👁️" : "🙈"}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Mật khẩu mới
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu mới"
                      className="flex-1 px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isDisable}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="text-lg"
                    >
                      {showNewPassword ? "👁️" : "🙈"}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    disabled={isDisable}
                    type="submit"
                    className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
                  >
                    Cập nhật mật khẩu
                  </button>
                  <button
                    type="button"
                    className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <UpdateFaceIDModal
        visible={isUpdateFaceIDModalOpen}
        onClose={() => setIsUpdateFaceIDModalOpen(false)}
      />
    </Spin>
  );
};

export default ProfilePage;
