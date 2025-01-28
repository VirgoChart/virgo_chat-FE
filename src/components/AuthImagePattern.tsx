"use client";
import Image from "next/image";
import React from "react";

interface IProps {
  title?: string;
  subtitle?: string;
}

const AuthImagePattern = ({ title, subtitle }: IProps) => {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center">
      <div className="max-w-md text-center">
        <Image
          src="/images/illustration.png"
          width={400}
          height={400}
          alt="Illustration"
          className="object-cover"
        />
      </div>

      <h1 className="text-[#FFDA43] text-5xl">VirgoChat</h1>

      <p className="text-[#E8E7E7] text-xl mt-4">
        -- Trò chuyện dễ dàng kết nối dài lâu --
      </p>
    </div>
  );
};

export default AuthImagePattern;
