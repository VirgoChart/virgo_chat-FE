"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import * as yup from "yup";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { PATH } from "@/constants/paths";
import Spin from "@/components/ui/Spin";
import { EMAIL_REGEX } from "@/constants";
import {
  EMAIL_REQUIRED_MESSAGE,
  EMAIL_INVALID_MESSAGE,
} from "@/constants/validate";
import axiosRequest from "@/config/axios";
import { Router } from "express";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";

const schema = yup
  .object({
    email: yup
      .string()
      .required(EMAIL_REQUIRED_MESSAGE)
      .matches(EMAIL_REGEX, EMAIL_INVALID_MESSAGE),
  })
  .required();

interface IForgotPasswordFormInput {
  email: string;
}

const ForgotPasswordForm = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isOtpInputVisible, setIsOtpInputVisible] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const router = useRouter();

  const methods = useForm<IForgotPasswordFormInput>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });
  const { handleSubmit } = methods;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [countdown]);

  const onSubmit: SubmitHandler<IForgotPasswordFormInput> = async (data) => {
    const email: string = data.email;
    setEmail(email);

    setIsLoading(true);
    try {
      const res = await axiosRequest.post(
        "/auth/reset-password/send-otp",
        { email },
        { withCredentials: true }
      );
      setIsModalOpen(true);

      setCountdown(60);
      setMessage("Mã xác nhận đã được gửi đến email của bạn!");
    } catch (error: any) {
      setMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const res = await axiosRequest.post(
        "auth/reset-password/verify-otp",
        {
          email: email,
          otp: otp,
        },
        { withCredentials: true }
      );
      toast.success("Xác nhận OTP thành công");
      window.localStorage.setItem("emailChangePass", JSON.stringify(email));
      router.push("/new-password");
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-md mx-auto w-4/5 p-6 bg-white rounded-lg shadow-md border-2 border-[#F977F7]">
      <FormProvider {...methods}>
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
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          {/* Email Input */}
          <Input
            name="email"
            className="bg-white"
            label="Nhập email của bạn"
            placeholder="you@example.com"
          />

          {/* Error Message */}
          <div className="text-sm text-red-500">{message}</div>

          {/* Submit Button */}
          <div className="text-center space-y-3">
            <Spin isLoading={isLoading} className="text-dark-300 fill-blue-800">
              <Button
                type="submit"
                className="w-full bg-[#7470E4] hover:opacity-85 hover:bg-[#7470E4] text-white font-normal py-2 rounded-lg"
                disabled={isLoading || countdown > 0}
              >
                {countdown > 0
                  ? `Gửi lại mã sau ${countdown}s`
                  : "Gửi mã xác nhận"}
              </Button>
            </Spin>

            {/* Back to Login Button */}
            <Button
              type="button"
              className="w-full border border-primary-900 text-primary-900 font-normal hover:bg-red-100 hover:opacity-80 hover:text-black py-2 rounded-lg bg-red-100 transition"
              variant="outlined"
            >
              <Link href={PATH.LOGIN}>Quay lại trang đăng nhập</Link>
            </Button>
          </div>
        </form>
      </FormProvider>

      {/* OTP Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <p className="text-center text-gray-700">Mã OTP đã được gửi đến</p>
            <p className="text-center bg-purple-200 text-purple-800 font-medium py-2 rounded-md">
              {email}
            </p>

            <div className="mt-4 space-y-3 text-center">
              {isOtpInputVisible ? (
                <>
                  <input
                    type="text"
                    placeholder="Nhập OTP"
                    className="w-full bg-white-200 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button
                    className="w-full bg-green-600 text-white font-medium py-2 rounded-lg hover:bg-green-700"
                    onClick={handleVerifyOTP}
                  >
                    Xác nhận
                  </button>
                </>
              ) : (
                <button
                  className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700"
                  onClick={() => setIsOtpInputVisible(true)}
                >
                  Nhập OTP
                </button>
              )}

              <button
                className="w-full bg-gray-400 text-white font-medium py-2 rounded-lg hover:bg-gray-500"
                onClick={handleCancel}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
