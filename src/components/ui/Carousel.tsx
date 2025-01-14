"use client";

import { useState, useRef, useEffect, memo } from "react";
import { useIsTablet } from "@/hooks/useMediaQuery";
import { cn } from "@/config/utils";
import Image from "next/image";
import ButtonChevron from "./ButtonChevron";
import useCustomSwipeable from "@/hooks/useCustomSwipeable";

interface CarouselProps {
  images: string[];
  isShowImageBottom?: boolean;
  className?: string;
  timeAnimation?: number;
}

const Carousel = ({
  images,
  isShowImageBottom = false,
  className,
  timeAnimation = 3000,
}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const isTablet = useIsTablet();
  const widthSubtract = isTablet ? "9px" : "15px";
  const imagesLength = images.length;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isShowImageBottom) {
        handleNext();
      }
    }, timeAnimation);

    return () => {
      clearTimeout(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowImageBottom, timeAnimation]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imagesLength - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === imagesLength - 1 ? 0 : prevIndex + 1
    );
  };

  const handleSwipe = useCustomSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
  });

  useEffect(() => {
    const thumbnailChildren = thumbnailsRef.current?.children;
    const activeThumbnail = thumbnailChildren?.[currentIndex] as HTMLElement;

    if (activeThumbnail) {
      activeThumbnail.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentIndex]);

  return (
    <div {...handleSwipe} className={cn("relative", className)}>
      <div className="relative flex items-center sm:h-80 xl:h-96 overflow-hidden">
        <div
          className="flex transition-transform duration-500 h-full"
          style={{
            width: `${imagesLength * 100}%`,
            transform: `translateX(-${currentIndex * (100 / imagesLength)}%)`,
          }}
        >
          {images.map((imageURL, index) => (
            <div
              key={index}
              className={cn("w-screen", { "rounded-md": isShowImageBottom })}
            >
              <Image
                priority={index === 0}
                src={imageURL}
                alt={`Banner ${index + 1}`}
                objectFit="cover"
                width={1800}
                height={200}
                className="h-full w-full lg:aspect-square"
              />
            </div>
          ))}
        </div>
        <ButtonChevron className="left-0" onClick={handlePrev} />
        <ButtonChevron isRightButton className="right-0" onClick={handleNext} />
      </div>

      {isShowImageBottom ? (
        <div
          className={cn(
            "flex pt-2 overflow-auto scrollbar-hide w-full gap-1.5 md:gap-2"
          )}
          ref={thumbnailsRef}
        >
          {images.map((item, index) => (
            <div
              key={index}
              style={{
                width: `calc((100% - ${widthSubtract})/3)`,
              }}
              className={cn(
                "rounded-md lg:rounded-lg shrink-0 transition-shadow duration-300 box-border border-2",
                index === currentIndex ? "border-primary-800" : "border-white"
              )}
            >
              <Image
                alt="item-details"
                src={item}
                width={600}
                height={600}
                objectFit="cover"
                className={cn(
                  "rounded-md lg:rounded-lg cursor-pointer aspect-auto h-full w-full hover:shadow-lg"
                )}
                onClick={() => {
                  setCurrentIndex(index);
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center gap-2 p-2 bg-primary-800 bg-opacity-50">
          {images.map((_, index) => (
            <button
              key={index}
              className={cn("w-2 h-2 xl:w-3 xl:h-3 rounded-full", {
                "bg-primary-800": index === currentIndex,
                "bg-white": index !== currentIndex,
              })}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(Carousel);
