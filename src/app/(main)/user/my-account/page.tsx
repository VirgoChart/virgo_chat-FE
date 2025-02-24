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
      <div className="py-20 -mt-6">
        <div className="max-w-2xl mx-auto p-4">
          <form
            className="rounded-xl p-6 space-y-8 bg-white-500"
            onSubmit={handleSubmit}
          >
            <div className="text-center">
              <h1 className="text-2xl font-semibold ">Tài khoản của tôi</h1>
            </div>

            {/* Avatar upload section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Image
                  src={selectedImg || authUser?.avatar || "/avatar.png"}
                  alt="Profile"
                  className="q_auto size-32 rounded-full object-cover border-4"
                  width={50}
                  height={50}
                  quality={100}
                />
                <label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
                >
                  <Camera className="w-5 h-5 text-base-200" />
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
                className="px-4 py-2 cursor-pointer bg-red-200 flex justify-center items-center gap-4 rounded-lg hover:opacity-80"
                onClick={() => setIsUpdateFaceIDModalOpen(true)}
              >
                <TbFaceId size={30} color="blue" />
                <span>Cập nhật FaceID</span>
              </div>
            </div>

            {/* Form fields */}
            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Tên đầy đủ
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 rounded-lg w-full border bg-[#C5B3E2]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Username
                </div>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 rounded-lg w-full border bg-[#C5B3E2]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Địa chỉ Email
                </div>
                <input
                  type="email"
                  name="email"
                  disabled
                  value={authUser?.email}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 w-full rounded-lg border bg-[#C5B3E2]"
                />
              </div>
            </div>

            {/* Submit button */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-[#6B089C] text-white"
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? "Đang load" : "Lưu thay đổi"}
              </button>
            </div>

            {/* Account info section */}
            <div className="mt-6 rounded-xl bg-[#C5B3E2] p-6">
              <h2 className="text-lg font-medium  mb-4">Thông tin tài khoản</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                  <span>Tham gia vào</span>
                  <span>{authUser?.createdAt?.split("T")[0]}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Trạng thái</span>
                  <span className="text-green-500">Active</span>
                </div>
                <div className="flex gap-2 items-center justify-center">
                  <button
                    className=" w-full px-4 py-2 bg-white-600 rounded-lg transition-all hover:opacity-90 hover:bg-blue-200"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Cập nhật mật khẩu
                  </button>
                  <button
                    title="Đăng xuất"
                    className="flex items-center px-2 py-1 rounded-lg bg-red-200"
                    onClick={handleLogout}
                  >
                    <LogOut className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
        {isModalOpen && (
          <div className="modal modal-open bg-white">
            <div className="modal-box bg-white">
              <h3 className="font-bold text-lg">Cập nhật mật khẩu</h3>
              <form onSubmit={handleUpdatePassword}>
                <div className="py-4">
                  <label className="label">
                    <span className="label-text">Mật khẩu cũ</span>
                  </label>
                  <div className="flex items-center gap-6">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu cũ"
                      className="input w-full max-w-xs bg-white-400"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      disabled={isDisable}
                    />
                    <button
                      type="button"
                      className=""
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      {showOldPassword ? "👁️" : "🙈"}
                    </button>
                  </div>
                </div>
                <div className="py-4">
                  <label className="label">
                    <span className="label-text">Mật khẩu mới</span>
                  </label>
                  <div className="flex items-center gap-6">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu mới"
                      className="input w-full max-w-xs bg-white-400"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isDisable}
                    />
                    <button
                      type="button"
                      className=""
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? "👁️" : "🙈"}
                    </button>
                  </div>
                </div>
                <div className="modal-action">
                  <button
                    disabled={isDisable}
                    type="submit"
                    className="btn btn-primary"
                  >
                    Cập nhật mật khẩu
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
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
