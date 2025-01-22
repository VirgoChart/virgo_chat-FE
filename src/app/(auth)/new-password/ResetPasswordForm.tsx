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
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mx-auto flex flex-col gap-3">
          <InputPassword
            name="newPassword"
            label="Mật khẩu mới"
            placeholder="Mật khẩu mới"
            className="bg-white-700"
          />
          <InputPassword
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            placeholder="Xác nhận mật khẩu"
            className="bg-white-700"
          />
        </div>

        <div className="text-red-300 my-2">{message}</div>

        <div className="text-center mx-auto flex flex-col my-2">
          <Spin isLoading={isLoading} className="text-dark-300 fill-blue-800">
            <Button type="submit" className="w-full" disabled={isLoading}>
              Đặt lại mật khẩu
            </Button>
          </Spin>

          <div className="font-bold text-dark-200 text-sm py-5 relative">
            <span className="bg-white relative z-10 px-5 text-base">Hoặc</span>
            <div className="absolute bottom-[50%] left-0 w-full h-px bg-dark-200"></div>
          </div>

          <Link
            href={PATH.LOGIN}
            className="text-sm text-primary-900 font-bold mt-2"
          >
            Quay lại trang đăng nhập
          </Link>

          <span className="text-sm text-dark-400 mt-2">
            Bạn chưa có tài khoản?
            <Link
              href={PATH.REGISTER}
              className="text-primary-900 font-bold ml-1"
            >
              Đăng kí ngay
            </Link>
          </span>
        </div>
      </form>
    </FormProvider>
  );
};

export default ResetPasswordForm;
