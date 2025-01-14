"use client";

import React, { useRef } from "react";
import { dataFilter } from "@/app/ui-kits/fetchData";
import { XMark } from "@/components/icons";
import Filter from "@/components/ui/Filter";
import FilterPrice from "@/components/ui/FilterPrice";
import Accordion from "@/components/ui/Accordion";
import SelectorColor from "@/components/ui/SelectorColor";
import Image from "next/image";
import useFilterCollectionStore from "@/store/useFilterCollectionStore";
import useClickOutside from "@/hooks/useClickOutside";
import { useWindowSize } from "@/hooks";

export default function CollectionSidebar() {
  const { isShowFilters, setIsShowFilters } = useFilterCollectionStore();
  const isSideBarVisible = useWindowSize();
  const collectionSidebarRef = useRef<HTMLDivElement>(null);

  useClickOutside(collectionSidebarRef, () => setIsShowFilters(false));

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="flex-col hidden lg:flex">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {isSideBarVisible && (
        <div
          className={`fixed inset-0 z-50 transition-transform duration-300 bg-dark-150 ${
            isShowFilters
              ? "transform translate-x-0"
              : "transform -translate-x-full"
          } flex`}
        >
          <div
            className="bg-white h-full p-4 shadow-lg md:w-72 overflow-y-auto"
            ref={collectionSidebarRef}
          >
            <div className="flex justify-between mb-4 items-center">
              <p className="inline-block font-medium">Tìm kiếm nâng cao</p>

              <button onClick={() => setIsShowFilters(false)}>
                <XMark />
              </button>
            </div>

            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}

const SidebarContent = () => {
  const setSelectedColor = useFilterCollectionStore(
    (state) => state.setSelectedColor
  );
  const setSelectedPriceRange = useFilterCollectionStore(
    (state) => state.setSelectedPriceRange
  );
  const setFiltersProducts = useFilterCollectionStore(
    (state) => state.setFiltersProducts
  );

  const colors = [
    "#DBBCB4",
    "#D3CDC7",
    "#33496C",
    "#FFC961",
    "#D9A767",
    "#A35427",
  ];

  return (
    <div className="w-[230px] xl:mb-0 mb-10">
      <Filter
        data={dataFilter}
        className="mb-4"
        onChange={setFiltersProducts}
      />

      <FilterPrice maxPrice={1000} onChange={setSelectedPriceRange} />

      {colors.length && (
        <Accordion headerTitle="Màu sắc">
          <SelectorColor
            title=""
            defaultValue={colors[0]}
            colors={colors}
            onChangeColor={setSelectedColor}
            className="pl-1 pb-1"
          />
        </Accordion>
      )}

      <Image
        alt="Color select"
        src="https://s3-alpha-sig.figma.com/img/7cbc/c3e5/5e6991c70d2d505062ab9fb5ed94c97a?Expires=1717977600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=afuYkw3nRAeYLStQWxvYwg-esGIJ3VGxi2JEkcJWy9AX-3jMMFcGYy9ZVvx~NL8CC-X7Dn8p7Q7L8nNJGWF1iEIYcZA1ToR6mLRdt-QzH9cjeS7jAGC7CxrL5ECHneQHOef6~QZ~1Nw8dBXK2Y0lqd-h-QaXR5fHM6ZaPpo3pmsnROS4yih1u8trunh0-Al8ceLwb4knpsrFpePkzd3oVfH4o6qCXtAoO194RZtZBQU2zll6juKYFlaj0iLme~zaDIUtKfNWkZ~uKEX5Am~yCipBrC~-bIbfyyJd6HBWj2gREORhk1BJ5r5OR7sLkp~w0G6xm19mBN5fVIKcCd4Vdw__"
        width={200}
        height={200}
        className="rounded-lg"
      />
    </div>
  );
};
