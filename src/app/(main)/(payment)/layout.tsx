"use client";

import { ReactNode, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import ProgressStepper from "@/components/ui/ProgressStepper";
import { ChevronLeft } from "@/components/icons";
import CountdownTimer from "@/components/ui/CountdownTimer";
import { removeLocalStorage } from "@/utils/localStorage";

const LayoutCheckout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/cart") {
      setCurrentStep(1);
    } else if (pathname === "/checkout") {
      setCurrentStep(2);
    } else if (pathname === "/payment-success") {
      setCurrentStep(3);
    }
  }, [pathname]);

  return (
    <div className="bg-white-900 w-full">
      <div className="container-base">
        <div className="relative flex items-start h-14">
          {currentStep > 1 && (
            <span
              className="flex items-center pt-2 text-dark-400 cursor-pointer hover:underline"
              onClick={() => {
                removeLocalStorage("countdownTimer");
                router.push("/cart");
              }}
            >
              <ChevronLeft className="mr-1" />
              Quay lại
            </span>
          )}

          {currentStep === 2 && (
            <div className="absolute h-10 left-1/2 transform -translate-x-1/2 text-dark-450 font-light">
              <p className="pt-2">
                Đơn hàng của bạn sẽ được đặt trong
                <CountdownTimer countdownMinutes={10} />
                phút nữa
              </p>
            </div>
          )}
        </div>

        <div className="w-full mb-12 sm:px-20 px-0">
          <ProgressStepper
            currentStep={Number(currentStep)}
            stepItems={[
              { title: "Đăng nhập", stepNumber: 1 },
              { title: "Thanh toán", stepNumber: 2 },
              { title: "Hoàn thành", stepNumber: 3 },
            ]}
          />
        </div>
        <div className="pb-12">{children}</div>
      </div>
    </div>
  );
};

export default LayoutCheckout;
