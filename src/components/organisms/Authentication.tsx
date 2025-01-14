"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { getProfile } from "@/apis/auth";

const Authentication = () => {
  const setProfile = useAppStore((state) => state.setProfile);

  useEffect(() => {
    const getCustomerInfo = async () => {
      const res = await getProfile();
      if (res) {
        setProfile(res.data);
      }
    };
    getCustomerInfo();
  }, [setProfile]);

  return <></>;
};

export default Authentication;
