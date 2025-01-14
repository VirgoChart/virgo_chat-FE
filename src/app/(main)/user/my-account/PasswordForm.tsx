"use client";

import { useState } from "react";
import * as yup from "yup";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { changePassword } from "@/apis/profile";
import { errorToast, successToast } from "@/utils/toast";
import Button from "@/components/ui/Button";
import Spin from "@/components/ui/Spin";
import InputPassword from "@/components/ui/InputPassword";
import {
  PASSWORD_REQUIRED_MESSAGE,
  PASSWORD_MIN_LENGTH_MESSAGE,
  MIN_PASSWORD_LENGTH,
  PASSWORD_CONFIRMATION_REQUIRED_MESSAGE,
  PASSWORD_CONFIRMATION_MATCH_MESSAGE,
  CURRENT_PASSWORD_CONFIRMATION_REQUIRED_MESSAGE,
} from "@/constants/validate";

interface IPassWordForm {
  newPassword: string;
  confirmPassword: string;
  currentPassword: string;
}

const schema = yup.object({
  newPassword: yup
    .string()
    .required(PASSWORD_REQUIRED_MESSAGE)
    .min(MIN_PASSWORD_LENGTH, PASSWORD_MIN_LENGTH_MESSAGE),
  confirmPassword: yup
    .string()
    .required(PASSWORD_CONFIRMATION_REQUIRED_MESSAGE)
    .oneOf([yup.ref("newPassword")], PASSWORD_CONFIRMATION_MATCH_MESSAGE),
  currentPassword: yup
    .string()
    .required(CURRENT_PASSWORD_CONFIRMATION_REQUIRED_MESSAGE)
    .min(MIN_PASSWORD_LENGTH, PASSWORD_MIN_LENGTH_MESSAGE),
});

const PassWordForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const methods = useForm<IPassWordForm>({
    resolver: yupResolver(schema),
  });

  const { handleSubmit, reset } = methods;

  const onSubmit = async (data: IPassWordForm) => {
    setIsLoading(true);
    try {
      const { currentPassword, newPassword } = data;
      await changePassword({
        oldPassword: currentPassword,
        newPassword: newPassword,
      });
      successToast("Đổi mật khẩu thành công");
      reset();
    } catch (error: any) {
      errorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="shadow-lg border border-dark-200 rounded-lg">
      <h1 className="text-xl border-b border-b-dark-200 p-4 font-medium">
        Thay đổi mật khẩu
      </h1>

      <Spin
        isLoading={isLoading}
        className="text-dark-300 fill-blue-800 rounded-lg"
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="p-4">
            <div className="mx-auto flex flex-col gap-6">
              <InputPassword
                name="currentPassword"
                label="Mật khẩu hiện tại"
                placeholder="Nhập mật khẩu hiện tại"
              />
              <InputPassword
                name="newPassword"
                label="Mật khẩu mới"
                placeholder="Nhập mật khẩu mới"
              />
              <InputPassword
                name="confirmPassword"
                label="Xác nhận mật khẩu mới"
                placeholder="Xác nhận mật khẩu mới"
              />
            </div>
            <Button
              type="submit"
              className="w-44 font-normal mt-6"
              disabled={isLoading}
            >
              Đặt lại mật khẩu
            </Button>
          </form>
        </FormProvider>
      </Spin>
    </div>
  );
};

export default PassWordForm;
