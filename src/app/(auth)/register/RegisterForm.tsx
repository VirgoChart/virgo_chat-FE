"use client";

import AuthImagePattern from "@/components/AuthImagePattern";
import { useAuthStore } from "@/store/useAuthStore";
import { useGoogleLogin } from "@react-oauth/google";
import { Google } from "@/components/icons";

import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import axiosRequest from "@/config/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function RegisterForm() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: " ",
    password: "",
  });

  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isOtpInputVisible, setIsOtpInputVisible] = useState(false);
  const { signUp, isSigningUp } = useAuthStore();
  const [otp, setOtp] = useState("");

  const handleCancel = () => {
    setModalOpen(false);
    setIsOtpInputVisible(false);
  };

  const handleEnterOTP = () => {
    setIsOtpInputVisible(true);
  };

  const dataSignUp = JSON.parse(window.localStorage.getItem("registerData"));

  console.log("dataSignup", dataSignUp);

  const handleConfirmOTP = async () => {
    try {
      const verifyRes = await axiosRequest.post("/auth/signup/verify-otp", {
        email: formData.email,
        otp: otp,
      });
      if (verifyRes) {
        const signupRes = await axiosRequest.post(
          "/auth/signup",
          {
            email: dataSignUp.email,
            fullName: dataSignUp.fullName,
            password: dataSignUp.password,
          },
          { withCredentials: true }
        );

        if (signupRes) {
          toast.success("Đăng ký thành công!");
          window.localStorage.setItem("authUser", JSON.stringify(signupRes));
          window.localStorage.removeItem("registerData");
          router.push("/");
        } else {
          toast.error("Đăng ký thất bại. Vui lòng thử lại.");
        }
      } else {
        toast.error("Xác nhận OTP thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const success = validateForm();
    if (success) {
      setModalOpen(true);
      try {
        window.localStorage.setItem("registerData", JSON.stringify(formData));
        window.localStorage.setItem("emailForSignUp", formData.email);
      } catch (error: any) {
        toast.error(error);
      }
    }
  };

  const handleSendOTP = async () => {
    setIsCountingDown(true);
    try {
      const res = await axiosRequest.post("/auth/signup/send-otp", {
        email: formData.email,
      });

      toast.success("Gửi mã OTP thành công");
    } catch (error: any) {
      toast.error(error);
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

  return (
    <div
      className="min-h-screen grid lg:grid-cols-2"
      style={{
        backgroundImage: "url('/images/bg-left.png')",
        backgroundSize: "cover",
      }}
    >
      {/* left */}

      <AuthImagePattern
        title="Tham gia cộng đồng"
        subtitle="Kết nối quá facebook"
      ></AuthImagePattern>

      {/* right */}
      <div className="flex items-center justify-center">
        <div className="flex flex-col w-3/5 justify-center items-center p-6 bg-[#FEFEFE] border-2 border-[#F977F7] rounded-lg">
          <div className="w-full max-w-md space-y-8">
            <div className="flex flex-col items-center mb-8">
              <div className="bg-transparent rounded-xl flex items-center justify-center transition-colors p-0">
                <Image
                  className="object-cover p-0"
                  src="/images/logoVirgo.png"
                  width={120}
                  height={120}
                  alt="Virgo"
                />
              </div>
              <h1 className="text-2xl text-[#8361B7] font-bold">
                Chào mừng bạn đến với{" "}
                <span className="text-[#FED93F]">VirgoChat</span>
              </h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className=" w-full">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Tên đầy đủ</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10 bg-white`}
                  placeholder="Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none bg-white">
                  <Mail className="size-5 text-white-700" />
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10 bg-white rounded-l-lg`}
                  placeholder="abc@gmail.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Mật khẩu</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPass ? "text" : "password"}
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
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full text-white font-medium text-lg mt-4"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Tạo tài khoản"
              )}
            </button>
          </form>

          <div className="flex items-center w-full my-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm font-medium">Hoặc</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div
            onClick={gg}
            className="px-4 cursor-pointer hover:opacity-75 py-2 w-full rounded-lg bg-white border-2 border-[#8361B7] flex items-center justify-center gap-4"
          >
            <Google />
            <span>Đăng nhập bằng google</span>
          </div>

          <div className="text-center flex items-center gap-2 mt-4">
            <p className="text-base-content/60">Đã có tài khoản? </p>
            <Link href="/login" className="hover:underline text-blue-700">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal modal-open bg-dark-300">
          <div className="modal-box bg-dark-300">
            <h3 className="font-bold text-lg">Xác nhận email của bạn</h3>
            <p className="py-4">
              Kiểm tra lại chính xác địa chỉ email của bạn trước khi bấm gửi OTP
            </p>
            <p className="py-4 bg-[#C5B3E2]">{formData.email}</p>
            <div className="modal-action">
              {!isOtpInputVisible && (
                <button
                  className="btn btn-primary"
                  onClick={handleSendOTP}
                  disabled={isCountingDown}
                >
                  {isCountingDown ? `Gửi lại trong ${countdown}s` : "Gửi OTP"}
                </button>
              )}
              {isOtpInputVisible ? (
                <>
                  <input
                    type="text"
                    placeholder="Nhập OTP"
                    className="input input-bordered w-full max-w-xs bg-white"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleConfirmOTP}
                  >
                    Xác nhận
                  </button>
                </>
              ) : (
                <button className="btn btn-secondary" onClick={handleEnterOTP}>
                  Nhập OTP
                </button>
              )}
              <button className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
