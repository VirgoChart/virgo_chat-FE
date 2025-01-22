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
      setIsModalOpen(true);
      const res = await axiosRequest.post(
        "/auth/reset-password/send-otp",
        { email },
        { withCredentials: true }
      );

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
    <div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mx-auto flex flex-col gap-3">
            <Input
              name="email"
              label="Nhập email của bạn"
              placeholder="Email"
            />
          </div>

          <div className="text-sm text-red my-4">{message}</div>

          <div className="text-center mx-auto flex flex-col">
            <Spin isLoading={isLoading} className="text-dark-300 fill-blue-800">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || countdown > 0}
              >
                {countdown > 0
                  ? `Gửi lại mã sau ${countdown}s`
                  : "Gửi mã xác nhận"}
              </Button>
            </Spin>
            <Button
              type="button"
              className="w-full my-4 hover:opacity-80 hover:bg-white"
              variant="outlined"
            >
              <Link
                href={PATH.LOGIN}
                className="text-sm text-primary-900 font-bold"
              >
                Quay lại trang đăng nhập
              </Link>
            </Button>
          </div>
        </form>
      </FormProvider>

      {isModalOpen && (
        <div className="modal modal-open bg-dark-300">
          <div className="modal-box bg-dark-300">
            <p className="py-4">KMã OTP đã được gửi đến email sau</p>
            <p className="py-4 bg-[#C5B3E2]">{email}</p>
            <div className="modal-action">
              {isOtpInputVisible ? (
                <>
                  <input
                    type="text"
                    placeholder="Nhập OTP"
                    className="input input-bordered w-full max-w-xs"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button className="btn btn-primary" onClick={handleVerifyOTP}>
                    Xác nhận
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsOtpInputVisible(true)}
                >
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
};

export default ForgotPasswordForm;
