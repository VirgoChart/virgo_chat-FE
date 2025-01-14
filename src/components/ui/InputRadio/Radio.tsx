"use client";

import { forwardRef, useState } from "react";
import { cn } from "@/config/utils";
import "./InputRadio.scss";

interface RadioProps<T> {
  checked?: boolean;
  onChange?: (value: T) => void;
  id?: string;
  className?: string;
  label?: string;
  value?: T;
  disabled?: boolean;
}

const Radio = forwardRef(
  <T,>(
    { checked, onChange, id, className, label, value, disabled }: RadioProps<T>,
    ref: React.Ref<HTMLInputElement>
  ) => {
    return (
      <label
        className={cn("custom-radio", className, {
          "disabled-option": disabled,
        })}
      >
        <input
          type="radio"
          id={id}
          checked={checked}
          onChange={(e) => onChange?.(e.target.value as T)}
          value={String(value)}
          disabled={disabled}
          ref={ref}
        />
        <span className="radio-circle"></span>
        {label && <span className="radio-label">{label}</span>}
      </label>
    );
  }
);

interface Option<T> {
  label: string;
  value: T;
  disabled?: boolean;
}

interface RadioGroupProps<T extends BaseValueInputType> {
  options: Option<T>[];
  value?: T;
  onChange?: (selectedValue: T) => void;
  className?: string;
  defaultValue?: T;
}

const RadioGroup = forwardRef(
  <T extends BaseValueInputType>(
    { options, value, onChange, className, defaultValue }: RadioGroupProps<T>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [selectedValue, setSelectedValue] = useState<T | undefined>(
      value !== undefined ? value : defaultValue
    );

    const handleChange = (newValue: T) => {
      setSelectedValue(newValue);
      onChange?.(newValue);
    };

    return (
      <div className={cn("flex flex-col space-y-2", className)} ref={ref}>
        {options.map((option) => (
          <Radio
            key={option.value as string}
            checked={selectedValue === option.value}
            onChange={() => handleChange(option.value)}
            {...option}
          />
        ))}
      </div>
    );
  }
);

export { Radio, RadioGroup };
