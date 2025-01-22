import React, { ReactNode } from "react";
import UserSidebar from "@/components/ui/UserSidebar";

const ProfileLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className="flex flex-col min-h-screen container-base">
      <div className="flex-1 md:mt-0 mt-50">{children}</div>
    </div>
  );
};

export default ProfileLayout;
