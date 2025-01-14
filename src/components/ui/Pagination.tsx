"use client";

import { memo, Fragment, useMemo } from "react";
import { cn } from "@/config/utils";
import { ChevronDown } from "@/components/icons";
import Button from "./Button";
import { useIsTablet } from "@/hooks/useMediaQuery";

export interface PaginationProps {
  total: number;
  pageSize?: number;
  currentPage?: number;
  onPageChange: (page: number) => void;
  className?: string;
  numberPage?: number;
}

const classArrow =
  "w-[30px] h-[30px] flex justify-center items-center text-gray-500 rounded-md border border-white-700 hover:bg-white-200";
const PAGINATION_SIZE = 5;

const Pagination = ({
  total,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  className,
  numberPage,
}: PaginationProps) => {
  const isTablet = useIsTablet();

  const { totalPages, pages } = useMemo(
    () =>
      getPageInfo(
        total,
        currentPage,
        pageSize,
        numberPage || isTablet ? 3 : PAGINATION_SIZE
      ),
    [total, currentPage, pageSize, numberPage, isTablet]
  );

  const isDisableButtonLeft = currentPage <= 1;
  const isDisableButtonRight = currentPage >= totalPages;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex items-center justify-between ps-4 py-2 sm:ps-6">
        <div className="flex justify-between gap-2 select-none">
          <ButtonArrow
            isLeftButton
            disabled={isDisableButtonLeft}
            onClick={() => onPageChange(currentPage - 1)}
          />

          {pages.map((number, index) => (
            <Fragment key={index}>
              {number === -1 ? (
                <span className="mx-1 text-base">. . .</span>
              ) : (
                <Button
                  variant={number === currentPage ? "primary" : "outlined"}
                  className="w-[30px] h-[30px] p-0 font-medium"
                  onClick={() => onPageChange(number)}
                >
                  {number}
                </Button>
              )}
            </Fragment>
          ))}

          <ButtonArrow
            disabled={isDisableButtonRight}
            onClick={() => onPageChange(currentPage + 1)}
          />
        </div>
      </div>
    </div>
  );
};

type ButtonArrowProps = {
  isLeftButton?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

const ButtonArrow = ({ isLeftButton, disabled, onClick }: ButtonArrowProps) => {
  return (
    <button
      className={cn(classArrow, disabled && "opacity-50 cursor-not-allowed")}
      disabled={disabled}
      onClick={onClick}
    >
      <ChevronDown
        width="10"
        height="8"
        className={cn(
          "transform duration-100",
          isLeftButton ? "rotate-90" : "rotate-[270deg]"
        )}
      />
    </button>
  );
};

const getPageInfo = (
  total: number,
  currentPage: number,
  pageSize: number,
  paginationSize: number = PAGINATION_SIZE
) => {
  const distance = Math.floor(paginationSize / 2);
  const totalPages = Math.ceil(total / pageSize);
  let startPage, endPage;

  if (totalPages <= paginationSize) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (currentPage <= Math.ceil(paginationSize / 2)) {
      startPage = 1;
      endPage = paginationSize;
    } else if (currentPage + distance >= totalPages) {
      startPage = totalPages - (paginationSize - 1);
      endPage = totalPages;
    } else {
      startPage = currentPage - distance;
      endPage = currentPage + distance;
    }
  }

  let pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (startPage > 1) {
    pages.unshift(1);
    if (startPage > 2) {
      pages.splice(1, 0, -1);
    }
  }

  if (endPage < totalPages - 1) {
    pages.push(-1);
  }
  if (endPage < totalPages) {
    pages.push(totalPages);
  }

  return {
    totalPages,
    pages,
  };
};

export default memo(Pagination);
