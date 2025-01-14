"use client";

import { useState, useRef, useEffect, memo } from "react";
import ButtonChevron from "./ButtonChevron";
import { ChevronLeft } from "../icons";
import CardItem from "./CardItem";
import { ICardItem } from "./CardItem";
import { useIsMobile, useIsTablet } from "@/hooks/useMediaQuery";

interface CardItemSliderProps {
  title?: string;
  cardItems: ICardItem[];
}

const CardItemSlider = ({ title, cardItems }: CardItemSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [visibleItems, setVisibleItems] = useState<number>(5);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cartItemsLength = cardItems.length;
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const calculateWidth = `calc(${(containerWidth / visibleItems) * cartItemsLength}px + ${(cartItemsLength - visibleItems - 2) * 0.5}rem)`;
  const transform = `translateX(-${(containerWidth / visibleItems) * currentIndex}px)`;

  useEffect(() => {
    if (containerRef.current) {
      const screenWidth = containerRef.current.offsetWidth;
      setContainerWidth(screenWidth);

      setVisibleItems(() => {
        if (isMobile) {
          return 2;
        } else if (isTablet) {
          return 4;
        }
        return 5;
      });
    }
  }, [isMobile, isTablet]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? cartItemsLength - visibleItems : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= cartItemsLength - visibleItems ? 0 : prevIndex + 1
    );
  };

  return (
    <div ref={containerRef} className="relative overflow-hidden mb-12 md:mb-20">
      {title && (
        <div className="relative mb-16">
          <h1 className="text-2xl text-primary-900 text-center uppercase font-medium">
            {title}
          </h1>
          <div className="absolute right-0 flex items-center">
            <span className="text-dark-800 cursor-pointer hover:underline">
              Xem tất cả
            </span>
            <ChevronLeft className="w-2 h-2 mt-0.5 ml-1 font-bold rotate-180" />
          </div>
        </div>
      )}

      <div
        className="grid gap-3 transition-transform duration-500"
        style={{
          gridTemplateColumns: isMobile
            ? "repeat(2, 1fr)"
            : `repeat(${cartItemsLength}, 1fr)`,
          width: isMobile ? "auto" : calculateWidth,
          transform: isMobile ? "none" : transform,
        }}
      >
        {cardItems.slice(0, isMobile ? 6 : cartItemsLength).map((item) => (
          <CardItem key={item.id} cartItem={item} isVertical />
        ))}
      </div>

      {!isMobile && (
        <>
          <ButtonChevron className="left-0" onClick={handlePrev} />
          <ButtonChevron
            isRightButton
            className="right-0"
            onClick={handleNext}
          />
        </>
      )}
    </div>
  );
};

export default memo(CardItemSlider);
