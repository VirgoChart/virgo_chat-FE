"use client";

import { cn } from "@/config/utils";
import { useEffect, useState } from "react";

interface ToggleButtonProps {
  onClick?: (isToggle: boolean) => void;
  value?: boolean;
  defaultToggle?: boolean;
}

const ToggleButton = ({ onClick, value, defaultToggle }: ToggleButtonProps) => {
  const [isToggle, setIsToggle] = useState(!!defaultToggle);
  const isHaveValue = value !== undefined;
  const formatToggle = isHaveValue ? value : isToggle;

  const handleToggle = () => {
    const newIsToggle = !isToggle;
    setIsToggle(newIsToggle);
    onClick?.(newIsToggle);
  };

  return (
    <div
      className={cn(
        "inline-block pointer-events-auto h-6 w-11 rounded-full p-1 ring-1 ring-inset transition duration-200 ease-in-out ring-black/20 hover:cursor-pointer",
        formatToggle ? "bg-primary" : "bg-[white]"
      )}
      onClick={handleToggle}
    >
      <div
        className={cn(
          "h-4 w-4 rounded-full bg-white shadow-sm ring-1 ring-slate-700/10 transition duration-200 ease-in-out",
          formatToggle ? "translate-x-5" : "translate-x-0"
        )}
      ></div>
    </div>
  );
};

export default ToggleButton;
