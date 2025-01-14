"use client";

import React from "react";
import { cardItems } from "@/app/ui-kits/fetchData";
import { useState, useEffect } from "react";
import CardItem from "@/components/ui/CardItem";
import Pagination from "@/components/ui/Pagination";

export type ItemType = {
  id?: number;
  price?: number;
  discount?: number;
  rating?: number;
  imgUrl?: string;
  title?: string;
  isFavorite?: boolean;
  disabled?: boolean;
};

export default function CollectionProducts() {
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  const [items, setItems] = useState<ItemType[]>([]);

  const onPaginationChange = (currentPage: number) => {
    setPage(currentPage);
  };

  useEffect(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(cardItems.length, startIndex + itemsPerPage);
    setItems(cardItems.slice(startIndex, endIndex) as ItemType[]);
  }, [page, itemsPerPage]);

  return (
    <div>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4 h-fit">
        {items.map((item) => (
          <CardItem key={item.id} cartItem={item} isVertical />
        ))}
      </div>

      <Pagination
        total={cardItems.length}
        currentPage={page}
        pageSize={itemsPerPage}
        onPageChange={onPaginationChange}
        className="my-8"
      />
    </div>
  );
}
