"use client";

import { useState } from "react";
import { Search, CartPlus } from "@/components/icons";
import { cn } from "@/config/utils";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import CardItem from "@/components/ui/CardItem";
import Category from "@/components/ui/Category";
import FilterPrice from "@/components/ui/FilterPrice";
import Pagination from "@/components/ui/Pagination";
import Filter from "../../components/ui/Filter";
import Image from "next/image";
import Header from "@/layouts/Header";
import Footer from "@/layouts/Footer";
import Carousel from "@/components/ui/Carousel";
import Counter from "@/components/ui/Counter";
import Selector from "@/components/ui/Selector";
import ProgressStepper from "@/components/ui/ProgressStepper";
import ProductReview from "@/components/ui/Review";
import { addToCart } from "@/apis/cart";
import Tabs from "@/components/ui/Tabs";

import {
  dataFilter,
  dataReview,
  dataCategory,
  images,
  cardItems,
  optionsDropdown,
  products,
} from "./fetchData";
import Table from "@/components/ui/Table";
import TableDemo from "./_component/TableDemo";
import { RadioGroup } from "@/components/ui/InputRadio/Radio";
import InputPassword from "@/components/ui/InputPassword";

const selectorValues = [
  { label: "xl", value: "a", isAvailable: true },
  { label: "sm", value: "v", isAvailable: true },
  { label: "2xl", value: "g", isAvailable: false },
  { label: "3xl", value: "e", isAvailable: true },
  { label: "m", value: "k", isAvailable: false },
  { label: "l", value: "x", isAvailable: false },
];

const tabData = [
  {
    key: "1",
    label: "Tab 1",
    children: "Nội dung tab 1",
    disabled: true,
  },
  {
    key: "2",
    label: "Tab 2",
    children: "Nội dung tab 2",
  },
  {
    key: "3",
    label: "Tab 3",
    children: "Nội dung tab 3",
  },
];

export default function UIKits() {
  const [selectedItem, setSelectedItem] = useState("");
  const [page, setPage] = useState(1);
  const [orderCount, setOrderCount] = useState(0);
  const [activeItem, setActiveItem] = useState<string | number>("43");
  const [count, setCount] = useState(1);
  const [activeTab, setActiveTab] = useState<BaseValueType>(tabData[0].key);
  const handlePaymentMethodChange = (value: number | string) => {
    console.log(value);
  };

  const onPaginationChange = (currentPage: number) => {
    setPage(currentPage);
  };

  const [selectedValue, setSelectedValue] = useState<BaseValueType>(1);

  const handleChange = (selectedValue: BaseValueType, selectedItem: any) => {
    setSelectedValue(selectedValue);
    console.log("Selected Value:", selectedValue);
    console.log("Selected Item:", selectedItem);
  };

  const handleChangePrice = (min: number, max: number) => {
    console.log("max: ", min, max);
  };

  const handleAddToCart = async (data: {
    productId: string;
    quantity: number;
  }) => {
    await addToCart(data);
  };

  // const onProductChecked = (checkedItem: IProduct, isChecked: boolean) => {
  //   const checked = listProductChecked.some(
  //     (item: IProduct) => item.id === checkedItem.id
  //   );
  //   let updatedCheckedItems: IProduct[];
  //   if (isChecked && checked) {
  //     updatedCheckedItems = listProductChecked.map((item: IProduct) =>
  //       item.id === checkedItem.id ? checkedItem : item
  //     );
  //   } else {
  //     updatedCheckedItems = isChecked
  //       ? [...listProductChecked, checkedItem]
  //       : listProductChecked.filter((item) => item.id !== checkedItem.id);
  //   }
  //   setListProductChecked(updatedCheckedItems);
  // };
  return (
    <>
      {/* <Header />
      <Counter
        min={0}
        max={10}
        onChangeCount={(count) => {
          console.log(count);
        }}
      />
      <div className="max-w-64">
        <h1>Filters</h1>
        <Filter data={dataFilter} onChange={() => {}} />
        <FilterPrice maxPrice={1000} onChange={handleChangePrice} />
      </div> */}

      <main className={cn("mx-10 mt-10 mb-20 space-y-4")}>
        <TableDemo />

        <RadioGroup
          options={[
            { label: "Thanh toán khi nhận hàng", value: "cod" },
            { label: "Thanh toán chuyển khoản", value: "bank" },
            {
              label: "Thanh toán qua thẻ",
              value: "card",
              disabled: true,
            },
          ]}
          defaultValue="bank"
          onChange={handlePaymentMethodChange}
        />

        <Button
          variant="outlined"
          onClick={() =>
            handleAddToCart({
              productId: "66acd909f465553de5b87cb7",
              quantity: 2,
            })
          }
        >
          <CartPlus /> AddToCart Test 1
        </Button>
        <InputPassword label="Nhập mật khẩu" placeholder="Nhập mật khẩu" />
        <Button
          variant="outlined"
          onClick={() =>
            handleAddToCart({
              productId: "66aca2f1f465553de5b87c96",
              quantity: 10,
            })
          }
        >
          <CartPlus /> AddToCart Test 1
        </Button>
        <div>
          {/* <Carousel
            images={images}
            isShowImageBottom={true}
            className="w-1/2x"
          /> */}
          <button
            className="text-3xl mr-10"
            onClick={() => setCount(count + 1)}
          >
            +
          </button>
          <button className="text-3xl" onClick={() => setCount(count - 1)}>
            -
          </button>
          <ProgressStepper
            currentStep={count}
            stepItems={[
              { title: "Đăng nhập", stepNumber: 1 },
              { title: "Nhập thông tin", stepNumber: 2 },
              { title: "Thanh toán", stepNumber: 3 },
              { title: "Hoàn thành", stepNumber: 4 },
            ]}
          />
        </div>
        {/* <ProductReview dataReviews={dataReview} /> */}
        <h1>Product Items</h1>
        <button
          onClick={() => {
            console.log("");
          }}
          className="border-2 border-primary-800 p-2 hover:bg-primary-800 hover:text-white rounded-md"
        >
          Show ProductItems
        </button>
        <h1>Buttons</h1>
        <div className="space-x-2">
          <Button
            variant="outlined"
            onClick={() => {
              console.log("baodang");
            }}
          >
            <CartPlus /> Outlined Button
          </Button>
          <Button disabled variant="outlined">
            <CartPlus /> Disabled Outlined Button
          </Button>
          <Button>
            <CartPlus /> Primary Button
          </Button>
          <Button disabled>
            <CartPlus /> Disabled Primary Button
          </Button>
        </div>
        <Image
          priority={false}
          alt=""
          width={1000}
          height={500}
          src="https://images.unsplash.com/photo-1653832919710-348081cb9e87?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <h1>Inputs</h1>
        <Input
          type="text"
          placeholder="Outlined Input"
          error="Sample error"
          icon={<Search className="text-primary-600" />}
        />
        <Input
          type="text"
          placeholder="Outlined Input"
          icon={<Search className="text-primary-600" />}
        />
        <Input type="text" disabled placeholder="Disabled Input" />
        <Input
          type="text"
          variant={"standard"}
          placeholder="Standard Input"
          error="Sample error"
          icon={<Search className="text-primary-600" />}
        />
        <Input type="text" variant={"filled"} placeholder="Filled Input" />
        <h1>Selector</h1>
        <Selector
          options={selectorValues}
          value={selectedValue}
          onChange={handleChange}
        />
        <h1>Dropdown</h1>
        <Dropdown
          size="lg"
          className="w-60"
          isShowSearch
          value={selectedItem}
          onChange={setSelectedItem}
          placeholder="Chọn tỉnh / thành"
          options={[
            { value: "HN", label: "Hà Nội" },
            { value: "HD", label: "Hải Dương" },
            { value: "HP", label: "Hải Phòng" },
            { value: "HB", label: "Hòa Bình" },
            { value: "PT", label: "Phú Thọ" },
            { value: "CB", label: "Cao Bằng" },
            { value: "LS", label: "Lạng Sơn" },
            { value: "DB", label: "Điện Biên" },
            { value: "TH", label: "Thanh Hóa" },
          ]}
        />
        <Dropdown
          size="lg"
          className="w-60"
          placeholder="Chọn tỉnh / thành"
          onChange={(value) => console.log("value", value)}
          options={[
            { value: "DB2", label: "Điện Biên 2" },
            { value: "TH2", label: "Thanh Hóa 2" },
          ]}
        />
        <Dropdown
          size="lg"
          disabled
          placeholder="Chọn tỉnh / thành"
          className="w-60"
          options={[
            { value: "HN", label: "Hà Nội" },
            { value: "HD", label: "Hải Dương" },
            { value: "HP", label: "Hải Phòng" },
            { value: "HB", label: "Hòa Bình" },
            { value: "PT", label: "Phú Thọ" },
            { value: "CB", label: "Cao Bằng" },
          ]}
        />
        <Dropdown size="sm" placeholder="Sản phẩm" options={optionsDropdown} />
        <Dropdown
          size="sm"
          disabled
          placeholder="Sản phẩm"
          options={optionsDropdown}
        />
        <h1>Pagination</h1>
        <Pagination
          total={200}
          currentPage={page}
          pageSize={10}
          onPageChange={onPaginationChange}
        />

        <Tabs
          tabItems={tabData}
          onChange={setActiveTab}
          activeKey={activeTab}
        />

        <Tabs tabItems={tabData} />

        <Tabs tabItems={tabData} defaultActiveKey={tabData[1].key} />

        <div className="max-w-64">
          <h1>Filters</h1>
          <Filter data={dataFilter} onChange={console.log} />
          <FilterPrice maxPrice={1000} onChange={handleChangePrice} />
        </div>
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {/* {cardItems.map((item) => (
            <CardItem key={item.id} cartItem={item} isVertical />
          {cardItems.map((item) => (
            <CardItem key={item.id} cartItem={item} isVertical />
          ))} */}
        </div>
        <div>
          <h1 className="mt-12 text-3xl text-center font-semibold">
            Featured Products
          </h1>
          <p className="text-center mt-2 font-thin mb-8">
            See What’s Trending Right Now
          </p>
          {/* <Category categories={dataCategory} /> */}
          {/* <Category categories={dataCategory} /> */}
        </div>
      </main>
      {/* <Footer /> */}
    </>
  );
}
