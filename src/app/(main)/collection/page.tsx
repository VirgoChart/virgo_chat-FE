"use client";

import React from "react";
import { cardItems } from "@/app/ui-kits/fetchData";
import CollectionSort from "./_component/CollectionSort";
import CollectionSidebar from "./_component/CollectionSidebar";
import CollectionProducts from "./_component/CollectionProducts";
import EmptyCollection from "./_component/EmptyCollection";

export default function Collection() {
  return (
    <div className="relative container-base bg-white py-10">
      <h2 className="text-center text-2xl font-medium xl:text-primary my-10 cursor-pointer hover:underline">
        Collection
      </h2>

      <CollectionSort />

      <div className="flex gap-14 lg:gap-20">
        <CollectionSidebar />

        {cardItems.length ? <CollectionProducts /> : <EmptyCollection />}
      </div>
    </div>
  );
}
