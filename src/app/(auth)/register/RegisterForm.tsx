"use client";

import { useState } from "react";
import Link from "next/link";
import * as yup from "yup";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@/components/ui/Input";
import { Eye, EyeInvisible } from "@/components/icons";
import Button from "@/components/ui/Button";
import { PATH } from "@/constants/paths";
import Spin from "@/components/ui/Spin";
import { register } from "@/apis/auth";
import { EMAIL_REGEX } from "@/constants";
import {
  EMAIL_REQUIRED_MESSAGE,
  EMAIL_INVALID_MESSAGE,
  PASSWORD_REQUIRED_MESSAGE,
  PASSWORD_MIN_LENGTH_MESSAGE,
  FIRST_NAME_REQUIRED_MESSAGE,
  LAST_NAME_REQUIRED_MESSAGE,
  CONFIRM_PASSWORD_REQUIRED_MESSAGE,
  MIN_PASSWORD_LENGTH,
} from "@/constants/validate";

const schema = yup
  .object({
    email: yup
      .string()
      .required(EMAIL_REQUIRED_MESSAGE)
      .matches(EMAIL_REGEX, EMAIL_INVALID_MESSAGE),
    password: yup
      .string()
      .required(PASSWORD_REQUIRED_MESSAGE)
      .min(MIN_PASSWORD_LENGTH, PASSWORD_MIN_LENGTH_MESSAGE),
    firstName: yup.string().required(FIRST_NAME_REQUIRED_MESSAGE),
    lastName: yup.string().required(LAST_NAME_REQUIRED_MESSAGE),
    confirmPassword: yup
      .string()
      .required(CONFIRM_PASSWORD_REQUIRED_MESSAGE)
      .min(MIN_PASSWORD_LENGTH, PASSWORD_MIN_LENGTH_MESSAGE),
  })
  .required();

interface IFormInput {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

const RegisterForm = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const methods = useForm<IFormInput>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<IFormInput> = async (dataRegister) => {
    setIsLoading(true);
    try {
      const { email, firstName, lastName, confirmPassword, password } =
        dataRegister;
      if (password !== confirmPassword) {
        setMessage("Mật khẩu xác nhận chưa đúng");
      } else {
        await register({
          email,
          firstName,
          lastName,
          password,
        });
        setMessage("Đăng kí thành công");
        router.push("/login");
      }
    } catch (error) {
      setMessage(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mx-auto flex flex-col gap-4">
          <Input name="email" label="Email" placeholder="Email" />
          <Input name="firstName" label="Tên" placeholder="Tên" />
          <Input name="lastName" label="Họ" placeholder="Họ" />
          <Input
            name="password"
            label="Mật khẩu"
            type={isShowPassword ? "text" : "password"}
            placeholder="Mật khẩu"
            icon={
              <div
                className="cursor-pointer text-dark-300 select-none"
                onClick={() => setIsShowPassword(!isShowPassword)}
              >
                {isShowPassword ? <EyeInvisible /> : <Eye />}
              </div>
            }
          />
          <Input
            name="confirmPassword"
            label="Nhập lại mật khẩu"
            type={isShowConfirmPassword ? "text" : "password"}
            placeholder="Nhập lại mật khẩu"
            icon={
              <div
                className="cursor-pointer text-dark-300 select-none"
                onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
              >
                {isShowConfirmPassword ? <EyeInvisible /> : <Eye />}
              </div>
            }
          />
        </div>

        <div className="text-sm text-red-900 my-3">{message}</div>

        <div className="text-center mx-auto flex flex-col">
          <Spin isLoading={isLoading} className="text-dark-300 fill-blue-800">
            <Button type="submit" className="w-full" disabled={isLoading}>
              Đăng kí
            </Button>
          </Spin>

          <span className="text-sm text-dark-400 mt-3">
            Bạn đã có tài khoản?
            <Link href={PATH.LOGIN} className="text-primary-900 font-bold ml-1">
              Đăng nhập ngay
            </Link>
          </span>
        </div>
      </form>
    </FormProvider>
  );
};

export default RegisterForm;
