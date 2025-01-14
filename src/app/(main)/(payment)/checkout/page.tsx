"use client";

import * as yup from "yup";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Dropdown from "@/components/ui/Dropdown";
import { useState, useEffect } from "react";
import { getProvinces, getDistricts, getWards } from "vietnam-provinces";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import {
  ADDRESS_REQUIRED_MESSAGE,
  DISTRICT_REQUIRED_MESSAGE,
  FULL_NAME_REQUIRED_MESSAGE,
  PAYMENT_METHOD_MESSAGE,
  PHONE_NUMBER_INVALID_MESSAGE,
  PHONE_NUMBER_REQUIRED_MESSAGE,
  PROVINCE_REQUIRED_MESSAGE,
  WARD_REQUIRED_MESSAGE,
} from "@/constants/validate";
import ProductItem, { IProductItem } from "@/components/ui/ProductItem";
import { useRouter } from "next/navigation";
import { getCart } from "@/apis/cart";
import Spin from "@/components/ui/Spin";
import { formatPrice } from "@/utils/formatPrice";
import { removeLocalStorage } from "@/utils/localStorage";
import FieldController from "@/components/ui/FieldController";
import { InferType } from "yup";
import { RadioGroup } from "@/components/ui/InputRadio/Radio";
import { ILocation, IOption } from "@/@types/Address.type";

export interface IFormInput {
  fullName: string;
  phoneNumber: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  paymentMethod: string;
}

const paymentMethodOptions = [
  { label: "Thanh toán khi nhận hàng", value: "cod" },
  { label: "Thanh toán chuyển khoản", value: "bank" },
  {
    label: "Thanh toán qua thẻ",
    value: "card",
    disabled: true,
  },
];

const schema = yup
  .object({
    fullName: yup.string().required(FULL_NAME_REQUIRED_MESSAGE),
    phoneNumber: yup
      .string()
      .required(PHONE_NUMBER_REQUIRED_MESSAGE)
      .matches(/^[0-9]+$/, PHONE_NUMBER_INVALID_MESSAGE),
    address: yup.string().required(ADDRESS_REQUIRED_MESSAGE),
    province: yup.string().nullable().required(PROVINCE_REQUIRED_MESSAGE),
    district: yup.string().nullable().required(DISTRICT_REQUIRED_MESSAGE),
    ward: yup.string().nullable().required(WARD_REQUIRED_MESSAGE),
    paymentMethod: yup.string().required(PAYMENT_METHOD_MESSAGE),
  })
  .required();

export default function Checkout() {
  const [provinceOptions, setProvinceOptions] = useState<IOption[]>([]);
  const [districtOptions, setDistrictOptions] = useState<IOption[]>([]);
  const [wardOptions, setWardOptions] = useState<IOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  type IFormInput = InferType<typeof schema>;
  const methods = useForm<IFormInput>({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const {
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = methods;

  useEffect(() => {
    const provinces = mapOptions(getProvinces());
    setProvinceOptions(provinces);
  }, []);

  const handleDropdownChange =
    (field: "province" | "district" | "ward") => (selectedValue: string) => {
      const actions = {
        province: () => {
          let districts = mapOptions(getDistricts(selectedValue));
          setDistrictOptions(districts);
          setWardOptions([]);
          setValue("district", "");
          setValue("ward", "");
        },
        district: () => {
          let wards = mapOptions(getWards(selectedValue));
          setWardOptions(wards);
          setValue("district", selectedValue);
          setValue("ward", "");
        },
        ward: () => {
          setValue("ward", selectedValue);
        },
      };

      actions[field]?.();
      clearErrors(field);
      setValue(field, selectedValue);
    };

  const mapOptions = (items: ILocation[]) => {
    return items.map((item) => ({
      value: item.code,
      label: item.name,
    }));
  };

  const handlePaymentMethodChange = (value: number | string) => {
    setValue("paymentMethod", String(value));
  };

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
    setIsLoading(true);
    removeLocalStorage("countdownTimer");
    router.push("/payment-success");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="custom-card mb-6">
              <h1 className="text-lg mb-3 font-semibold">Giao tới</h1>
              <div className="mx-auto mb-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-8">
                <Input name="fullName" placeholder="Họ tên" />
                <Input
                  name="phoneNumber"
                  type="text"
                  placeholder="Số điện thoại"
                />
                <Dropdown
                  size="lg"
                  className="w-full"
                  placeholder="Chọn Tỉnh/Thành"
                  isShowSearch
                  options={provinceOptions}
                  error={errors?.province?.message}
                  onChange={handleDropdownChange("province")}
                />

                <Dropdown
                  size="lg"
                  className="w-full"
                  placeholder="Chọn Quận/Huyện"
                  isShowSearch={districtOptions.length > 0}
                  disabled={districtOptions.length === 0}
                  options={districtOptions}
                  error={errors?.district?.message}
                  onChange={handleDropdownChange("district")}
                />
                <Dropdown
                  size="lg"
                  className="w-full"
                  placeholder="Chọn Phường/Xã"
                  isShowSearch={wardOptions.length > 0}
                  disabled={wardOptions.length === 0}
                  options={wardOptions}
                  error={errors?.ward?.message}
                  onChange={handleDropdownChange("ward")}
                />
                <Input
                  name="address"
                  type="text"
                  placeholder="Địa chỉ chi tiết"
                />
              </div>
            </div>

            <div className="custom-card">
              <FieldController
                name="paymentMethod"
                title="Phương thức thanh toán"
                isUncontrolled={true}
                defaultValue="bank"
                className="font-semibold"
              >
                <RadioGroup
                  options={paymentMethodOptions}
                  onChange={handlePaymentMethodChange}
                />
              </FieldController>
            </div>
          </div>

          <div className="custom-card md:w-[500px] h-full">
            <CheckoutSummary />
            <Spin
              isLoading={isLoading}
              className="text-dark-300 fill-primary-600"
            >
              <Button
                type="submit"
                className="w-full text-xl font-normal select-none uppercase"
              >
                {isLoading ? "Đang xử lý..." : "Đặt hàng"}
              </Button>
            </Spin>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

interface IDataProduct {
  _id: string;
  products: IProductItem[];
  status: string;
  totalProducts: number;
  totalPrice: number;
}

const CheckoutSummary = () => {
  const [dataCart, setDataCart] = useState<IDataProduct>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    handleGetCart();
  }, []);

  const handleGetCart = async () => {
    const res = await getCart();
    setDataCart(res?.data);
    setIsLoading(false);
  };

  const summaryItems = [
    { label: "Tạm tính", value: formatPrice(dataCart?.totalPrice ?? 0) },
    { label: "Giảm giá", value: "0đ" },
    { label: "Vocher", value: "0đ" },
    { label: "Combo", value: "0đ" },
    { label: "Phí vận chuyển", value: "0đ" },
  ];

  return (
    <Spin isLoading={isLoading} className="text-dark-300 fill-primary-600">
      <h1 className="text-lg font-semibold">Thông tin thanh toán</h1>
      <div>
        {dataCart?.products?.map((item, index) => (
          <ProductItem
            key={index}
            product={item}
            isPayment={false}
            className="border-b border-b-white-400"
          />
        ))}
      </div>

      <div className="flex flex-col gap-2 mt-6 mb-12 text-dark-500">
        {summaryItems?.map((item, index) => (
          <p className="flex justify-between" key={index}>
            {item.label}
            <span className="text-dark-900">{item.value}</span>
          </p>
        ))}

        <p className="flex justify-between pt-3 text-lg border-t border-t-white-400">
          Tổng cộng
          <span className="text-dark-900">
            {formatPrice(dataCart?.totalPrice ?? 0)}
          </span>
        </p>
      </div>
    </Spin>
  );
};
