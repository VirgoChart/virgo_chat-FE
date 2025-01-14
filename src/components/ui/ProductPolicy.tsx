import { cn } from "@/config/utils";
import { ComponentType } from "react";

type PolicyItemData = {
  Icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  isLastItem?: boolean;
};

type ProductPolicyProps = {
  policies: PolicyItemData[];
};

const ProductPolicy = ({ policies }: ProductPolicyProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3">
      {policies.map((policy, index) => (
        <PolicyItem
          key={index}
          Icon={policy.Icon}
          title={policy.title}
          description={policy.description}
          isLastItem={policy.isLastItem}
        />
      ))}
    </div>
  );
};

const PolicyItem = ({
  Icon,
  title,
  description,
  isLastItem = false,
}: PolicyItemData) => (
  <div
    className={cn(
      "flex justify-center items-center mb-2 py-2 sm:py-0 sm:mb-6",
      isLastItem ? "col-span-2 md:col-span-1" : "border-r border-white-700"
    )}
  >
    <Icon className="w-12 mx-4 shrink-0 sm:w-16" />
    <div>
      <p className="mb-1 text-sm sm:text-base">{title}</p>
      <span className="text-xs text-dark-500 sm:text-sm">{description}</span>
    </div>
  </div>
);

export default ProductPolicy;
