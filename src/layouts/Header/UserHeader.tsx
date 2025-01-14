"use client";

import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { PATH } from "@/constants/paths";
import { User } from "@/components/icons";

const UserHeader = () => {
  const { profile } = useAppStore();

  return (
    <div className="flex text-white gap-1 items-center">
      {profile._id ? (
        <Link href={PATH.MY_ACCOUNT} className="flex gap-2 items-center">
          <User />
          <div className="text-base cursor-pointer">
            {profile.firstName} {profile.lastName}
          </div>
        </Link>
      ) : (
        <>
          <Link href={PATH.LOGIN} className="hover:underline text-sm">
            Đăng nhập
          </Link>
          <div>/</div>
          <Link href={PATH.REGISTER} className="hover:underline text-sm">
            Đăng ký
          </Link>
        </>
      )}
    </div>
  );
};

export default UserHeader;
