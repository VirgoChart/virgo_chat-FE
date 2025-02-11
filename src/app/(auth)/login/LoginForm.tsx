"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import AuthImagePattern from "@/components/AuthImagePattern";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import axiosRequest from "@/config/axios";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";
import { Google } from "@/components/icons";
import { TbFaceId } from "react-icons/tb";
import FaceID from "@/components/FaceID";
import Image from "next/image";
import { Checkbox } from "antd";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isFaceIDModalOpen, setIsFaceIDModalOpen] = useState(false);

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axiosRequest.post("/auth/login", formData, {
        withCredentials: true,
      });
      console.log(res);
      localStorage.setItem("authUser", JSON.stringify(res));
      toast.success("Đăng nhập thành công");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi");
    } finally {
    }
  };

  const responseGoogle = async (response: any) => {
    if (response.code) {
      try {
        const res = await axiosRequest.post(
          "/auth/login/google",
          {
            code: response["code"],
          },
          { withCredentials: true }
        );
        localStorage.setItem("authUser", JSON.stringify(res));
        toast.success("Đăng nhập thành công");
        router.push("/");
      } catch (error: any) {
        toast.error(error);
      }
    } else {
      console.error("Google không trả về mã code hoặc có lỗi xảy ra");
    }
  };

  const gg = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  const router = useRouter();

  return (
    <div
      className="min-h-screen grid lg:grid-cols-2"
      style={{
        backgroundImage: "url('/images/bg-left.png')",
        backgroundSize: "cover",
      }}
    >
      <AuthImagePattern
        title={"Chào mừng"}
        subtitle={
          "Đăng nhập để tiếp tục sử dụng dịch vụ tin nhắn và kết nối với bạn bè"
        }
      />

      <div className="flex justify-center items-center">
        <div className="w-4/5 bg-[#FEFEFE] border-2 border-[#F977F7] rounded-lg px-6 py-3 max-w-md">
          <div className="flex flex-col items-center group">
            <div
              className="rounded-xl flex items-center justify-center
              transition-colors"
            >
              <Image
                className="object-cover p-0"
                src="/images/logoVirgo.png"
                width={120}
                height={120}
                alt="Virgo"
              />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10 bg-white`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Mật khẩu</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10 bg-white`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center justify-center">
                <Checkbox />
                <span>Lưu mật khẩu?</span>
              </div>
              <div className="text-center self-end">
                <Link href="/forget-password" className="link link-primary">
                  Quên mật khẩu
                </Link>
              </div>
            </div>

            <div className="flex gap-2 flex-col">
              <button
                type="submit"
                className="btn btn-primary font-normal w-full text-lg text-white"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </button>

              <div
                onClick={() => setIsFaceIDModalOpen(true)}
                className="hover:text-white hover:bg-red-400 hover:border-white transition-colors px-4 py-2 hover:opacity-95 border-2 border-red-200 flex items-center justify-center gap-4 rounded-lg cursor-pointer"
              >
                <TbFaceId
                  size={30}
                  className="text-[#7480FF] hover:text-white-200"
                />
                <span> Đăng nhập bằng FaceID</span>
              </div>

              <div
                onClick={gg}
                className="hover:opacity-75 cursor-pointer px-4 py-2 rounded-lg border-2 border-[#8361B7] flex items-center justify-center gap-4"
              >
                <Google />
                <span>Đăng nhập bằng google</span>
              </div>
            </div>
          </form>

          <div className="flex flex-col justify-center items-center gap-10 mt-5">
            <div className="text-center">
              <p className="text-base-content/60">
                Bạn chưa có tải khoản?{" "}
                <Link
                  href="/register"
                  className="hover:underline text-blue-700"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {isFaceIDModalOpen && (
        <FaceID
          onClose={() => {
            setIsFaceIDModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
export default LoginPage;
