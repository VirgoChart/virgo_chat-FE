"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import Input, { InputProps } from "./Input";

interface InputPasswordProps extends Omit<InputProps, "icon"> {}

const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
  ({ ...props }, ref) => {
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

    const togglePasswordVisibility = () =>
      setIsShowPassword((prevState) => !prevState);

    const passwordIcon = (
      <div
        className="cursor-pointer text-dark-300"
        onClick={togglePasswordVisibility}
      >
        {isShowPassword ? <EyeClosed /> : <Eye />}
      </div>
    );

    return (
      <Input
        type={isShowPassword ? "text" : "password"}
        icon={passwordIcon}
        ref={ref}
        {...props}
      />
    );
  }
);

export default InputPassword;
