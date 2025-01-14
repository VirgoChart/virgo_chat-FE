"use client";

import { useState, useRef, useEffect, memo } from "react";
import ButtonChevron from "./ButtonChevron";
import Image from "next/image";
import { ChevronLeft } from "../icons";
import RatingStar from "./RatingStar";

interface CustomerDataProps {
  id?: number;
  name?: string;
  feedback?: string;
  stars?: number;
  reviewImg?: string;
  role?: string;
  userAvatar?: string;
}

interface CustomerReviewProps {
  title: string;
  customerDatas: CustomerDataProps[];
}

const CustomerReview = ({ customerDatas, title }: CustomerReviewProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const getVisibleItems = () => {
    const width = containerWidth;
    if (width >= 1024) return 3;
    if (width >= 768) return 3;
    return 1.5;
  };

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleItems = getVisibleItems();
  const itemWidth = containerWidth / visibleItems;
  const calculateWidth = `${itemWidth * customerDatas.length}px`;
  const transform = `translateX(-${itemWidth * currentIndex}px)`;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex <= 0 ? customerDatas.length - visibleItems : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= customerDatas.length - visibleItems ? 0 : prevIndex + 1
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden my-12 md:my-20 container-base"
    >
      {title && (
        <div className="relative mb-16">
          <h1 className="text-2xl text-primary-900 text-center uppercase font-medium">
            {title}
          </h1>
          <div className="absolute right-0 flex items-center mt-2">
            <span className="text-dark-800 cursor-pointer hover:underline">
              Xem tất cả
            </span>
            <ChevronLeft className="w-2 h-2 mt-0.5 ml-1 font-bold rotate-180" />
          </div>
        </div>
      )}
      <div
        className="flex transition-transform duration-500 py-2"
        style={{
          width: calculateWidth,
          transform: transform,
        }}
      >
        {customerDatas.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-lg shadow-md mx-2 min-w-[250px] sm:min-w-[380px] max-w-[500px] flex flex-col items-center justify-center"
          >
            {customer.reviewImg && (
              <Image
                src={customer.reviewImg}
                alt="Review Image"
                className="object-cover rounded-t-lg w-full h-52"
                width={200}
                height={200}
              />
            )}

            <div className="flex items-start p-6 flex-col w-full">
              <p className="text-gray-700 mb-4 w-full">{customer.feedback}</p>

              <div className="flex items-center justify-between w-full">
                <div className="flex gap-4 items-center">
                  {customer.userAvatar && (
                    <Image
                      src={customer.userAvatar}
                      className="rounded-full object-cover"
                      alt="User avatar"
                      width={50}
                      height={50}
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold">{customer.name}</span>
                    <span className="text-gray-400">{customer.role}</span>
                  </div>
                </div>

                <RatingStar
                  rating={customer.stars}
                  classStar="md:w-4 md:h-4 w-2 h-2"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <ButtonChevron
        className="absolute left-1"
        onClick={handlePrev}
      ></ButtonChevron>
      <ButtonChevron
        className="absolute right-1 rotate-180"
        onClick={handleNext}
      ></ButtonChevron>
    </div>
  );
};

export default memo(CustomerReview);
