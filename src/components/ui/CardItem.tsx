"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/config/utils";
import { Cart, Heart } from "@/components/icons";
import RatingStar from "@/components/ui/RatingStar";
import ItemPrice from "@/components/ui/ItemPrice";

export interface ICardItem {
  id?: number;
  price?: number;
  discount?: number;
  rating?: number;
  imgUrl?: string;
  title?: string;
  isFavorite?: boolean;
  disabled?: boolean;
}

interface CardItemProps {
  cartItem: ICardItem;
  isShowDiscountPrice?: boolean;
  isVertical?: boolean;
  currentPriceClass?: string;
  priceClass?: string;
}

const CardItem = ({
  cartItem: {
    price = 0,
    discount = 0,
    rating,
    imgUrl,
    title,
    isFavorite,
    disabled,
  },
  isShowDiscountPrice = false,
  isVertical = false,
  currentPriceClass,
  priceClass,
}: CardItemProps) => {
  const [favorite, setFavorite] = useState(isFavorite);

  const toggleFavorite = () => {
    setFavorite(!favorite);
  };

  return (
    <div
      className={cn("hover:shadow-md duration-300", {
        "opacity-50 pointer-events-none": disabled,
      })}
    >
      <div className="relative">
        {imgUrl && (
          <Image
            src={imgUrl}
            alt="item card"
            width={300}
            height={300}
            className="w-full h-auto object-cover rounded-t-xl"
          />
        )}
        {discount > 0 && (
          <div className="absolute top-0 left-0 px-4 py-1 font-light text-white bg-dark-500 rounded-tl-xl rounded-br-xl">
            -{discount}%
          </div>
        )}

        <div
          className="absolute top-3 right-3 bg-dark-200 p-1 rounded-full hover:bg-dark-300 cursor-pointer"
          onClick={toggleFavorite}
          aria-label="Toggle favorite"
        >
          <Heart
            className={cn(favorite ? "text-primary-900" : "text-dark-200")}
          />
        </div>
      </div>

      <div className="px-3 py-2 bg-white-300">
        <div className="flex items-center">
          <h3 className="flex-1 min-h-12 text-base text-gray-400 line-clamp-2 text-ellipsis">
            {title}
          </h3>
          <Cart className="min-w-5 ml-8 fill-none cursor-pointer stroke-[1.5px] hover:opacity-80" />
        </div>

        <div className="flex justify-between items-center">
          <ItemPrice
            price={price}
            discount={discount}
            currentPriceClass={currentPriceClass}
            priceClass={priceClass}
            isShowDiscountPrice={isShowDiscountPrice}
            isVertical={isVertical}
          />
          <RatingStar rating={rating} />
        </div>
      </div>
    </div>
  );
};

export default CardItem;
