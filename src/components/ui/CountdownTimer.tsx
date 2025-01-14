"use client";

import { cn } from "@/config/utils";
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "@/utils/localStorage";
import { memo, useState, useEffect } from "react";

interface CountdownTimerProps {
  countdownMinutes: number;
  className?: string;
}

const CountdownTimer = ({
  countdownMinutes,
  className,
}: CountdownTimerProps) => {
  const storedTimeLeft = getLocalStorage("countdownTimer");
  const initialTimeLeft = storedTimeLeft
    ? Number(storedTimeLeft)
    : countdownMinutes * 60;

  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          removeLocalStorage("countdownTimer");
          return 0;
        }
        const newTimeLeft = prevTime - 1;
        setLocalStorage("countdownTimer", newTimeLeft);
        return newTimeLeft;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <span className={cn("font-medium mx-1", className)}>
      {minutes} : {seconds}
    </span>
  );
};

export default memo(CountdownTimer);
