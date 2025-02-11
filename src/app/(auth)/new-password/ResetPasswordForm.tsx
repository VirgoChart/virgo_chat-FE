"use client";

import { useState } from "react";
import Link from "next/link";
import * as yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/components/ui/Button";
import { PATH } from "@/constants/paths";
import Spin from "@/components/ui/Spin";
import {
  PASSWORD_REQUIRED_MESSAGE,
  PASSWORD_MIN_LENGTH_MESSAGE,
  MIN_PASSWORD_LENGTH,
  PASSWORD_CONFIRMATION_REQUIRED_MESSAGE,
  PASSWORD_CONFIRMATION_MATCH_MESSAGE,
} from "@/constants/validate";

import InputPassword from "@/components/ui/InputPassword";
import axiosRequest from "@/config/axios";
import Image from "next/image";

const schema = yup
  .object({
    newPassword: yup
      .string()
      .required(PASSWORD_REQUIRED_MESSAGE)
      .min(MIN_PASSWORD_LENGTH, PASSWORD_MIN_LENGTH_MESSAGE),
    confirmPassword: yup
      .string()
      .required(PASSWORD_CONFIRMATION_REQUIRED_MESSAGE)
      .oneOf([yup.ref("newPassword")], PASSWORD_CONFIRMATION_MATCH_MESSAGE),
  })
  .required();

interface IResetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const email = JSON.parse(window.localStorage.getItem("emailChangePass"));

  const router = useRouter();

  const methods = useForm<IResetPasswordForm>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });
  const { handleSubmit } = methods;

  const onSubmit = async (data: IResetPasswordForm) => {
    setIsLoading(true);
    const { newPassword } = data;
    try {
      await axiosRequest.put(
        "/auth/reset-password/",
        {
          email: email,
          newPassword: newPassword,
        },
        { withCredentials: true }
      );
      setMessage("Mật khẩu đã được đặt lại thành công.");
      router.push(PATH.LOGIN);
    } catch (error: any) {
      setMessage(error);
    } finally {
      setIsLoading(false);
    }
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
          {/* Password Fields */}
          <div className="flex flex-col gap-3">
            <InputPassword
              name="newPassword"
              label="Mật khẩu mới"
              placeholder="Mật khẩu mới"
              className="bg-gray-100 focus:ring-2 focus:ring-blue-500"
            />
            <InputPassword
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              placeholder="Xác nhận mật khẩu"
              className="bg-gray-100 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error Message */}
          <div className="text-red-500 text-sm">{message}</div>

          {/* Submit Button */}
          <div className="text-center space-y-4">
            <Spin isLoading={isLoading} className="text-dark-300 fill-blue-800">
              <Button
                type="submit"
                className="w-full bg-[#7B76F1] hover:bg-[#7B76F1] hover:opacity-80 text-white font-medium py-2 rounded-lg transition"
                disabled={isLoading}
              >
                Đặt lại mật khẩu
              </Button>
            </Spin>

            {/* Separator Line */}
            <div className="relative flex items-center justify-center py-2">
              <span className="bg-white px-4 text-gray-600 font-medium z-10">
                Hoặc
              </span>
              <div className="absolute inset-x-0 top-1/2 h-px bg-gray-300"></div>
            </div>

            <div className="flex flex-col items-center gap-2">
              {/* Back to Login */}
              <Link
                href={PATH.LOGIN}
                className="text-sm text-[#7B76F1] font-medium hover:underline"
              >
                Quay lại trang đăng nhập
              </Link>

              {/* Register Link */}
              <span className="text-sm text-gray-600">
                Bạn chưa có tài khoản?
                <Link
                  href={PATH.REGISTER}
                  className="text-[#7B76F1] font-medium ml-1 hover:underline"
                >
                  Đăng kí ngay
                </Link>
              </span>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default ResetPasswordForm;
