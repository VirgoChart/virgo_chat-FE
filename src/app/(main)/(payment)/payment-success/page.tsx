"use client";

import { Check } from "@/components/icons";
import Button from "@/components/ui/Button";

const orderInfo = [
  { label: "Mã đơn hàng:", value: "1274872192", valueClass: "text-dark-900" },
  {
    label: "Phương thức thanh toán:",
    value: "Thanh toán khi nhận hàng (COD)",
    valueClass: "text-dark-900",
  },
  {
    label: "Thời gian giao hàng dự kiến:",
    value: "3-5 ngày",
    valueClass: "text-dark-900",
  },
  { label: "Tổng thanh toán:", value: "702.000đ", valueClass: "text-red-900" },
  { label: "Tình trạng:", value: "Đã thanh toán", valueClass: "text-red-900" },
];

export default function PaymentSuccess() {
  return (
    <div className="custom-card mx-auto !px-8 !py-10 md:w-[850px] w-full">
      <div className="flex flex-col items-center justify-center">
        <Check className="mb-4 bg-[#09B825] w-14 h-14 rounded-full" />
        <h1 className="text-xl text-dark-800 text-center">
          Đặt hàng thành công
        </h1>
      </div>

      <div className="flex flex-col gap-4 mt-6 mb-12 text-dark-500">
        {orderInfo.map((item, index) => (
          <p className="flex justify-between" key={index}>
            {item.label}
            <span className={item.valueClass}>{item.value}</span>
          </p>
        ))}
      </div>

      <Button className="px-4 w-full uppercase" variant={"outlined"}>
        Tiếp tục mua sắm
      </Button>
    </div>
  );
}
