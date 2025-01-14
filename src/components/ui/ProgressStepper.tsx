"use client";

import { memo } from "react";
import { cn } from "@/config/utils";
import { Check } from "@/components/icons";

type StepItemType = {
  title?: string;
  stepNumber: number;
};

type ProgressStepperProps = {
  currentStep: number;
  stepItems: StepItemType[];
};

const ProgressStepper = ({ currentStep, stepItems }: ProgressStepperProps) => {
  return (
    <div className="flex justify-between">
      {stepItems.map((step, index) => (
        <ProgressStepperItem
          key={step.stepNumber}
          currentStep={currentStep}
          step={step}
          isLastStep={index === stepItems.length - 1}
        />
      ))}
    </div>
  );
};

type ProgressStepperItemProps = {
  currentStep: number;
  step: StepItemType;
  isLastStep: boolean;
};

const getBackgroundColorClass = (isActive: boolean) =>
  isActive ? "bg-primary-900" : "bg-dark-300";

const ProgressStepperItem = ({
  currentStep,
  step,
  isLastStep,
}: ProgressStepperItemProps) => {
  const isActive = currentStep >= step.stepNumber;
  const shouldAnimate = isActive || currentStep > step.stepNumber;

  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="sm:mb-2">
        <span className="block text-center text-sm sm:h-8 h-auto sm:text-base font-semibold">
          {step.title}
        </span>
      </div>

      <div className="flex w-full items-center">
        <div
          className={cn("h-[2px] w-1/2", getBackgroundColorClass(isActive), {
            "animate-[changeColor_1s]": shouldAnimate,
          })}
        ></div>
        <p
          className={cn(
            "flex items-center justify-center text-white text-sm w-7 h-7 shrink-0 rounded-full",
            getBackgroundColorClass(isActive),
            { "animate-[changeColor_1s]": shouldAnimate }
          )}
        >
          {isActive ? <Check /> : `0${step.stepNumber}`}
        </p>
        <div
          className={cn(
            "h-[2px] w-1/2",
            getBackgroundColorClass(
              currentStep > step.stepNumber || isLastStep ? isActive : false
            )
          )}
        ></div>
      </div>
    </div>
  );
};

export default memo(ProgressStepper);
