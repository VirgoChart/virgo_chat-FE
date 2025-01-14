import {
  formatPrice,
  calculateCurrentPrice,
  calculateDiscountPrice,
} from "@/utils/formatPrice";
import { cn } from "@/config/utils";
import { memo } from "react";

type ItemPriceProps = {
  price: number;
  discount?: number;
  isShowDiscountPrice?: boolean;
  isVertical?: boolean;
  currentPriceClass?: string;
  priceClass?: string;
};

const ItemPrice = ({
  price,
  discount = 0,
  isShowDiscountPrice = false,
  isVertical = false,
  currentPriceClass,
  priceClass,
}: ItemPriceProps) => {
  const currentPrice = calculateCurrentPrice(price, discount);
  const discountAmount = calculateDiscountPrice(price, currentPrice);

  return (
    <div
      className={cn(
        "items-center",
        isVertical ? "flex-col justify-between" : "flex justify-start"
      )}
    >
      <p
        className={cn(
          "text-primary-900 text-base mr-3 font-medium",
          currentPriceClass
        )}
      >
        {formatPrice(currentPrice)}
      </p>

      <p
        className={cn(
          "h-5 text-dark-300 text-sm w-20 mr-3 line-through",
          priceClass
        )}
      >
        {discount ? formatPrice(price) : null}
      </p>

      {isShowDiscountPrice && discount > 0 && (
        <p className={cn("text-red text-sm italic", priceClass)}>
          (Tiết kiệm {formatPrice(discountAmount)})
        </p>
      )}
    </div>
  );
};

export default memo(ItemPrice);
