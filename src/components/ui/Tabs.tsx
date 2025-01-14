"use client";

import { ReactNode, useState } from "react";
import { cn } from "@/config/utils";

interface Item {
  key: string;
  label?: string;
  children?: ReactNode;
  disabled?: boolean;
}

interface ITabsProps {
  className?: string;
  tabItems: Item[];
  onChange?: (key: BaseValueType) => void;
  activeKey?: BaseValueType;
  defaultActiveKey?: BaseValueType;
}

const Tabs = ({
  className,
  tabItems,
  onChange,
  activeKey,
  defaultActiveKey,
}: ITabsProps) => {
  const [currentKeySelected, setCurrentKeySelected] = useState<BaseValueType>(
    defaultActiveKey ?? tabItems[0].key
  );
  const mainValue = activeKey ?? currentKeySelected;

  const currentTab = tabItems.find((tab) => tab.key === mainValue);

  const handleChange = (key: BaseValueType) => {
    if (!activeKey) setCurrentKeySelected(key);
    onChange?.(key);
  };

  return (
    <div className={cn("w-fit", className)}>
      <div className="flex bg-primary-100 gap-4 rounded-sm">
        {tabItems?.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleChange(tab.key)}
            disabled={tab.disabled}
            className={cn(
              "p-4 hover:text-primary transition-colors duration-300 border-b-2",
              mainValue === tab.key
                ? "border-primary text-primary"
                : "border-primary-100",
              tab.disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4 bg-white shadow-sm rounded mb-2">
        {currentTab?.children}
      </div>
    </div>
  );
};

export default Tabs;
