"use client";

import { CartPlus } from "@/components/icons";
import Button from "@/components/ui/Button";
import Counter from "@/components/ui/Counter";
import SelectorColor from "@/components/ui/SelectorColor";
import React from "react";
import { IProduct } from "../page";

const ProductForm = ({ productData }: { productData: IProduct }) => {
  const handleChangeColor = (color: string) => {
    console.log(color);
  };
  const handleChangeCount = (count: number) => {
    console.log(count);
  };

  const handleClickAddToCart = () => {};
  const handleClickBuyNow = () => {};

  return (
    <>
      <div className="my-6">
        <SelectorColor
          title="Màu sắc"
          defaultValue={productData.colors[0]}
          colors={productData.colors}
          onChangeColor={handleChangeColor}
        />
      </div>
      <div className="mb-10">
        <p className="mb-1">Số lượng</p>
        <Counter defaultValue={1} min={1} onChangeCount={handleChangeCount} />
      </div>

      <div className="flex justify-between gap-6">
        <Button
          variant="outlined"
          className="w-1/2 font-light"
          onClick={handleClickAddToCart}
        >
          <CartPlus /> THÊM VÀO GIỎ HÀNG
        </Button>
        <Button className="w-1/2 font-light" onClick={handleClickBuyNow}>
          MUA NGAY
        </Button>
      </div>
    </>
  );
};

export default ProductForm;
