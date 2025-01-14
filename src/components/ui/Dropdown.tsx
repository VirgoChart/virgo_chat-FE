"use client";

import { ChevronDown } from "@/components/icons";
import { cn } from "@/config/utils";
import useClickOutside from "@/hooks/useClickOutside";
import { useState, useRef, useMemo, useEffect } from "react";
import ErrorMessage from "./ErrorMessage";

interface IDropdownItem {
  label: string;
  value: BaseValueInputType;
}

interface DropdownProps<T extends BaseValueType> {
  size?: "sm" | "lg";
  placeholder?: string;
  options: IDropdownItem[];
  disabled?: boolean;
  className?: string;
  isShowSearch?: boolean;
  value?: T;
  defaultValue?: T;
  error?: string;
  onChange?: (selectedValue: T, selectedItem: IDropdownItem) => void;
  onSearchChange?: (searchValue: T) => void;
}

const Dropdown = <T extends BaseValueType>({
  size = "sm",
  placeholder,
  options,
  value,
  defaultValue,
  className,
  error,
  disabled = false,
  isShowSearch = false,
  onChange,
  onSearchChange,
}: DropdownProps<T>) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownTop, setIsDropdownTop] = useState(false);

  const [selectedValue, setSelectedValue] =
    useState<BaseValueType>(defaultValue);
  const [searchTerm, setSearchTerm] = useState("");
  const isHaveValue = value !== undefined;

  useEffect(() => {
    if (!options.find((option) => option.value === selectedValue)) {
      setSelectedValue(defaultValue);
    }
  }, [options, selectedValue, defaultValue]);
  const formatSelectedValue = isHaveValue ? value : selectedValue;

  const selectedItem = useMemo(
    () => options.find((option) => option.value === formatSelectedValue),
    [options, formatSelectedValue]
  );

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const toggleDropdown = (toggleValue?: boolean) => {
    const dropdownEl = dropdownRef.current;
    if (dropdownEl && !isOpen) {
      const rect = dropdownEl.getBoundingClientRect();
      setIsDropdownTop(window.innerHeight - rect.bottom < 300);
    }
    setIsOpen(toggleValue === undefined ? !isOpen : toggleValue);
  };

  const handleSelectItem = (item: IDropdownItem) => {
    toggleDropdown();

    if (!isHaveValue) {
      setSelectedValue(item.value);
    }

    onChange?.(item.value as T, item);
    setSearchTerm("");
    onSearchChange?.("" as T);
  };

  const filteredOptions = useMemo(
    () =>
      isShowSearch
        ? options.filter((option) =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : options,
    [searchTerm, options, isShowSearch]
  );

  const onChangeSearch = (value: string) => {
    onSearchChange?.(value as T);
    setSearchTerm(value);
  };

  useEffect(() => {
    if (isOpen && isShowSearch) {
      inputRef.current?.focus();
    }
  }, [isOpen, isShowSearch]);

  return (
    <div className={cn("relative w-fit h-fit", className)} ref={dropdownRef}>
      <div
        className={cn(
          "flex items-center justify-between select-none cursor-pointer border border-dark-300 hover:border-primary",
          {
            "px-2 py-0.5 rounded": size === "sm",
            "px-3.5 py-3 rounded-xl": size === "lg",
            "text-dark-400": !formatSelectedValue || disabled,
            "opacity-75 pointer-events-none": disabled,
          }
        )}
        onClick={() => toggleDropdown(true)}
      >
        <input
          ref={inputRef}
          placeholder={selectedItem?.label || placeholder}
          value={searchTerm}
          onChange={(e) => onChangeSearch(e.target.value)}
          className={cn(
            disabled || !isShowSearch ? "hidden" : "inline-block",
            formatSelectedValue || (searchTerm && !formatSelectedValue)
              ? "placeholder:text-dark text-dark"
              : "placeholder:text-dark-400",
            "w-full border-none outline-none focus:ring-0"
          )}
        />
        {!isShowSearch && <span>{selectedItem?.label || placeholder}</span>}
        <ChevronDown className="ml-2 my-auto" />
      </div>
      {error && <ErrorMessage message={error} className={className} />}

      {isOpen && (
        <div
          className={cn(
            "absolute max-h-[300px] w-full py-1 z-10 mt-2 rounded-md bg-white shadow-lg border border-dark-300 cursor-pointer scrollbarStyle",
            isDropdownTop
              ? "bottom-full mb-2 animate-[fadeInUp_0.2s]"
              : "top-full mt-2 animate-[fadeInDown_0.2s]"
          )}
        >
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2">Không tìm thấy kết quả</div>
          ) : (
            filteredOptions.map((item) => (
              <div
                key={item.value}
                onClick={() => handleSelectItem(item)}
                className={cn(
                  "text-dark",
                  item.value === formatSelectedValue
                    ? "bg-white-200 font-medium"
                    : "hover:bg-white-300",
                  {
                    "px-3 py-1": size === "sm",
                    "px-4 py-3": size === "lg",
                  }
                )}
              >
                {item.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
