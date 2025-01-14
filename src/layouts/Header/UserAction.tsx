"use client";

import React, { useRef, useState } from "react";
import { CartShopping, RoundedUser } from "@/components/icons";
import { PATH } from "@/constants/paths";
import { useAppStore } from "@/store/useAppStore";
import UserSidebar from "@/components/ui/UserSidebar";
import useClickOutside from "@/hooks/useClickOutside";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserAction() {
  const { profile } = useAppStore();
  const isLogin = !!profile._id;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useClickOutside(dropdownRef, closeMenu);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const navigateToLogin = () => {
    router.push(PATH.LOGIN);
  };

  return (
    <div ref={dropdownRef}>
      <div className="flex gap-1 items-center">
        <Link href="#">
          <CartShopping className="cursor-pointer" />
        </Link>
        <RoundedUser
          onClick={isLogin ? toggleMenu : navigateToLogin}
          className="text-white-900 w-6 h-6 ml-2 mt-0 cursor-pointer"
        />
      </div>
      <UserSidebar
        isMenuOpen={isMenuOpen}
        closeMenu={closeMenu}
        isDropdown={true}
      />
    </div>
  );
}
