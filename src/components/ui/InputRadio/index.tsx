"use client";

import { forwardRef, useEffect, useState } from "react";
import "./InputRadio.scss";
import { cn } from "@/config/utils";

interface Option<T> {
  label: string;
  value: T;
  isDisabled?: boolean;
}

interface InputRadioProps<T extends BaseValueInputType> {
  title?: string;
  options: Option<T>[];
  isVertical?: boolean;
  className?: string;
  value?: T;
  defaultValue?: T;
  onChange?: (selectedValue: T) => void;
}

const InputRadio = forwardRef(
  <T extends BaseValueInputType>(
    {
      title,
      options,
      isVertical = false,
      className,
      value,
      defaultValue,
      onChange,
    }: InputRadioProps<T>,
    ref: React.Ref<HTMLInputElement>
  ) => {
    const [selectedValue, setSelectedValue] = useState(defaultValue);

    useEffect(() => {
      if (value !== undefined && value !== selectedValue) {
        setSelectedValue(value);
      }
    }, [value, selectedValue]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value as T;
      setSelectedValue(newValue);
      onChange?.(newValue);
    };

    return (
      <div className={cn("relative w-fit h-fit", className)}>
        <h1 className="text-lg mb-3">{title}</h1>
        <div className={cn("flex gap-4", isVertical ? "flex-col" : "flex-row")}>
          {options.map((option) => (
            <label
              key={option.value}
              className={cn("custom-radio", {
                "disabled-option": option.isDisabled,
              })}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={option.value}
                checked={selectedValue === option.value}
                onChange={handleChange}
                disabled={option.isDisabled}
                className="mr-2"
                ref={ref}
              />
              <span className="radio-circle"></span>
              <span className="ml-2 font-light">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }
);

export default InputRadio;
