"use client";

import React from "react";
import Dropdown from "@/components/ui/Dropdown";
import { FilterIcon } from "@/components/icons";
import useFilterCollection from "@/store/useFilterCollectionStore";

export default function CollectionSort() {
  const { setDropdownValue } = useFilterCollection();
  const { isShowFilters, setIsShowFilters } = useFilterCollection();

  return (
    <div className="flex justify-between pb-6 items-center">
      <button
        className="flex gap-2 items-center px-2 py-1 rounded-md h-8 border border-dark-300"
        onClick={() => {
          setIsShowFilters(!isShowFilters);
        }}
      >
        <FilterIcon />

        <p className="text-base md:text-lg">Bộ lọc</p>
      </button>

      <Dropdown
        size="sm"
        placeholder="Sắp xếp theo"
        className="w-40 md:w-60 h-8"
        options={[
          { value: "BC", label: "Bán chạy nhất" },
          { value: "GT", label: "Giá tăng dần" },
          { value: "GG", label: "Giá giảm dần" },
        ]}
        onChange={setDropdownValue}
      />
    </div>
  );
}
