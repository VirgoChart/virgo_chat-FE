import React from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function EmptyCollection() {
  return (
    <div className="bg-white flex flex-col items-center shadow-lg w-full h-1/3 lg:my-8 my-16">
      <div className="md:text-xl text-base ml-2">
        <p>Danh sách sản phẩm trống</p>
      </div>

      <Image
        src="/images/EmptyCollection.jpg"
        quality={100}
        width={300}
        height={100}
        alt="Error!, no items found"
        className="object-cover"
      />

      <Link href="/" passHref className="md:pb-5 pb-10">
        <Button className="px-4 text-sm">Trở về trang chủ</Button>
      </Link>
    </div>
  );
}
