"use client";

import { Loader } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

const Home = () => {
  return (
    <main>
      <Navbar />
    </main>
  );
};

export default Home;
