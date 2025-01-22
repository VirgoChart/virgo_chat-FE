"use client";

import AuthImagePattern from "@/components/AuthImagePattern";
import { useAuthStore } from "@/store/useAuthStore";

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

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8"></div>
          <div className="flex flex-col items-center gap-2 group">
            <div className="size-12 bg-white-400 rounded-xl bg-primary flex items-center justify-center transition-colors">
              <MessageSquare className="size-6 text-primary"></MessageSquare>
            </div>
            <h1 className="text-lg text-[#E0ABE5] font-bold">Tạo tài khoản</h1>
            <p className="text-md">Bắt đầu với tài khoản free</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-4 w-4/5">
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
                className={`input input-bordered w-full pl-10 bg-white-400`}
                placeholder="Nhập tên đầy đủ"
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
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none bg-white-400">
                <Mail className="size-5 text-white-700" />
              </div>
              <input
                type="email"
                className={`input input-bordered w-full pl-10 bg-white-400 rounded-l-lg`}
                placeholder="Nhập email của bạn"
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
                className={`input input-bordered w-full pl-10 bg-white-400`}
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
            className="btn btn-primary w-full text-lg"
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

        <div className="text-center flex items-center gap-2">
          <p className="text-base-content/60">Đã có tài khoản? </p>
          <Link href="/login" className="hover:underline text-blue-700">
            Đăng nhập ngay
          </Link>
        </div>
      </div>

      <AuthImagePattern
        title="Tham gia cộng đồng"
        subtitle="Kết nối quá facebook"
      ></AuthImagePattern>

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
                    className="input input-bordered w-full max-w-xs"
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
