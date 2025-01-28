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
        localStorage.setItem("authUser", JSON.stringify(res.data));
        toast.success("Đăng nhập thành công");
        router.push("/");
      } catch (error: any) {
        toast.error(error);
      }
    } else {
      console.error("Google login did not return a valid credential.");
    }
  };

  const gg = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  const router = useRouter();

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2 text-[#7480FF]">
                Chào mừng trở lại
              </h1>
              <p className="text-base-content/60 text-[#7480FF]">
                Đăng nhập vào tài khoản của bạn
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-blue-700">
                  Email
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10 bg-white-500`}
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
                <span className="label-text font-medium text-blue-700">
                  Mật khẩu
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10 bg-white-500`}
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

            <div className="flex gap-2 flex-col">
              <button
                type="submit"
                className="btn btn-primary w-full text-lg text-white-700"
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

              <button
                onClick={() => setIsFaceIDModalOpen(true)}
                className="px-4 py-3 bg-red-200 flex items-center justify-center gap-4"
              >
                <TbFaceId size={30} />
                <span> Đăng nhập bằng FaceID</span>
              </button>

              <button
                onClick={gg}
                className="px-4 py-2 rounded-lg bg-red-200 flex items-center justify-center gap-4"
              >
                <Google />
                <span>Đăng nhập bằng google</span>
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-base-content/60 text-blue-700">
              Chưa có tải khoản?{" "}
              <Link href="/register" className="link link-primary">
                Tạo tài khoản ngay
              </Link>
            </p>
          </div>

          <div className="text-center -mt-6">
            <p className="text-base-content/60 text-blue-700">
              Quên mật khẩu{" "}
              <Link href="/forget-password" className="link link-primary">
                Reset mật khẩu ngay
              </Link>
            </p>
          </div>
        </div>
      </div>

      {isFaceIDModalOpen && <FaceID />}

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Chào mừng"}
        subtitle={
          "Đăng nhập để tiếp tục sử dụng dịch vụ tin nhắn và kết nối với bạn bè"
        }
      />
    </div>
  );
};
export default LoginPage;
