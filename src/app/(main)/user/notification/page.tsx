import React from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

const Notification = () => {
  return (
    <div className="bg-white flex flex-col items-center justify-center gap-6 w-full py-10 px-4">
      <div className="text-center">
        <p className="text-lg md:text-2xl font-semibold text-gray-700">
          Danh sách sản phẩm trống
        </p>
        <p className="text-sm md:text-base text-gray-500 mt-2">
          Hiện tại bạn chưa có sản phẩm nào trong danh sách.
        </p>
      </div>

      <Image
        src="/images/emptyProfile.png"
        quality={100}
        width={300}
        height={300}
        alt="No items found"
        className="object-contain w-64 h-64"
      />

      <Link href="/user/my-account">
        <Button className="mt-6 px-6 py-2 text-sm font-medium text-white rounded-lg shadow-lg">
          Trở về trang chủ
        </Button>
      </Link>
    </div>
  );
};

export default Notification;
