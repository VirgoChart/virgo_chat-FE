"use client";

import { useMemo } from "react";
import {
  Address,
  Bell,
  CartProfile,
  Ticket,
  User,
  Exit,
} from "@/components/icons";
import { PATH } from "@/constants/paths";
import { deleteTokenServer } from "@/apis/auth";
import { useAppStore } from "@/store/useAppStore";
import { usePathname, useRouter } from "next/navigation";
import FadeWrapper from "@/components/ui/FadeWrapper";
import { cn } from "@/config/utils";
import Link from "next/link";

const categories = [
  { id: 1, name: "Tài khoản của tôi", icon: <User />, path: PATH.MY_ACCOUNT },
  { id: 2, name: "Địa chỉ", icon: <Address />, path: PATH.MY_ADDRESS },
  { id: 3, name: "Thông báo", icon: <Bell />, path: PATH.NOTIFICATION },
  { id: 4, name: "Đơn hàng", icon: <CartProfile />, path: PATH.ORDER },
  { id: 5, name: "Voucher", icon: <Ticket />, path: PATH.VOUCHER },
];

interface IUserSidebarProps {
  isDropdown?: boolean;
  isMenuOpen?: boolean;
  closeMenu?: () => void;
}

const UserSidebar = ({
  isDropdown = false,
  isMenuOpen,
  closeMenu,
}: IUserSidebarProps) => {
  const { clearProfile } = useAppStore();
  const router = useRouter();
  const pathName = usePathname();

  const activeCategory = useMemo(
    () =>
      categories.findIndex((category) => pathName.includes(category.path)) + 1,
    [pathName]
  );

  const handleLogout = () => {
    deleteTokenServer();
    clearProfile();
    closeMenu?.();
    router.replace(PATH.LOGIN);
  };

  const SidebarContent = (
    <div className="w-full">
      {categories.map((category) => (
        <Link
          href={category.path}
          key={category.id}
          onClick={() => {
            closeMenu?.();
          }}
          className={`py-3 xl:py-4 cursor-pointer flex items-center gap-2 border-l-2 lg:text-lg md:text-base text-sm border-b border-dark-200 pr-20 pl-5 w-full hover:bg-gray-100 transition-colors duration-150 ${
            activeCategory === category.id
              ? "border-l-primary bg-primary-100"
              : "border-l-white hover:border-l-gray-100"
          }`}
        >
          {category.icon}
          {category.name}
        </Link>
      ))}
      <div
        onClick={handleLogout}
        className="py-4 cursor-pointer flex items-center gap-2 border-none lg:text-lg md:text-base text-sm pr-20 pl-5 w-full hover:bg-gray-200 transition-colors duration-150"
      >
        <Exit className="text-red-400" />
        <span className="font-mediumx">Đăng xuất</span>
      </div>
    </div>
  );

  if (isDropdown) {
    return (
      <FadeWrapper
        isVisible={isMenuOpen!}
        className="absolute z-50 bg-white top-10 left-0 right-0 rounded-lg shadow-xl"
        timeAnimation={400}
      >
        <div className="p-4">{SidebarContent}</div>
      </FadeWrapper>
    );
  }

  return (
    <div className={cn("flex-col hidden xl:block")}>
      <div className="bg-white lg:shadow-lg xl:my-0 lg:my-10 my-0">
        <h3 className="py-3 text-xl px-4 font-medium">Danh mục</h3>
        {SidebarContent}
      </div>
    </div>
  );
};

export default UserSidebar;
