import { cn } from "@/config/utils";
import { ChevronLeft } from "@/components/icons";

interface ButtonChevronProps {
  isRightButton?: boolean;
  className?: string;
  onClick?: () => void;
}

const ButtonChevron = ({
  className,
  onClick,
  isRightButton,
}: ButtonChevronProps) => {
  return (
    <button
      className={cn(
        "absolute z-10 top-1/2 transform -translate-y-1/2 md:p-3 p-2 mx-2 bg-white rounded-full hover:shadow-xl",
        className
      )}
      onClick={onClick}
    >
      <ChevronLeft
        className={cn(
          "w-4 h-4 xl:w-5 xl:h-5 fill-primary font-bold",
          isRightButton && "rotate-180"
        )}
      />
    </button>
  );
};

export default ButtonChevron;
