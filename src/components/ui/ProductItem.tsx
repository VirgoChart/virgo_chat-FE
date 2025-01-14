import { useIsMobile } from "@/hooks/useMediaQuery";
import Image from "next/image";
import Counter from "./Counter";
import { Trash } from "../icons";
import { cn } from "@/config/utils";
import ItemPrice from "./ItemPrice";

export interface IProductId {
  _id: string;
  name: string;
  status: string;
  price: number;
  images: string[];
}

export interface IQuantityChange {
  productId: string;
  quantity: number;
  type: string;
}

export interface IProductItem {
  productId: IProductId;
  quantity: number;
  _id: string;
}

interface IProductItemProps {
  product: IProductItem;
  className?: string;
  isPayment?: boolean;
  onDeleteClick?: (productId: string) => void;
  onChange?: (data: IQuantityChange) => void;
}

const ProductItem = ({
  product,
  className,
  isPayment,
  onDeleteClick,
  onChange,
}: IProductItemProps) => {
  const isMobile = useIsMobile();

  // const onChangeRef = useRef(onChange);

  // const [productItem, setProductItem] = useState<IProduct>({
  //   id: product.id,
  //   title: product.title,
  //   imgUrl: product.imgUrl,
  //   price: product.price,
  //   count: 0,
  //   color: "",
  // });

  // const [isChecked, setIsChecked] = useState(false);
  // const [selectedValue, setSelectedValue] = useState("");

  // useEffect(() => {
  //   onChangeRef.current = onChange;
  // }, [onChange]);

  // useEffect(() => {
  //   onChangeRef.current?.(productItem, isChecked);
  // }, [productItem, isChecked]);

  // const handleDropdownChange = (value: string) => {
  //   setSelectedValue(value);
  //   setProductItem({ ...productItem, color: value });
  // };

  const handleCountChange = (newCount: number) => {
    const changeQuantity = product.quantity - newCount;

    onChange?.({
      productId: product.productId._id,
      quantity: Math.abs(changeQuantity),
      type: changeQuantity >= 0 ? "DECREASE" : "INCREASE",
    });
  };

  return (
    <div className={cn(className, "flex gap-2 items-start py-5")}>
      {/* {isPayment && <Checkbox defaultChecked onChange={setIsChecked} />} */}

      <Image
        src={product.productId.images[0] || ""}
        alt="product item"
        width={isPayment ? (isMobile ? 76 : 172) : 114}
        height={114}
        className="rounded-lg object-cover cursor-pointer aspect-square"
      />

      <div className="flex flex-col justify-between sm:gap-4 gap-3 ml-2 w-full">
        <h3
          className={cn("w-full text-base cursor-pointer hover:underline", {
            "sm:line-clamp-2 line-clamp-1": isPayment,
            "line-clamp-2": !isPayment,
          })}
        >
          {product.productId.name}
        </h3>

        <div className="flex items-center sm:flex-col sm:items-start gap-4">
          <ItemPrice
            price={product?.productId.price}
            isShowDiscountPrice={true}
          />

          {/* {isPayment && (
                <Dropdown
                  size="sm"
                  className="sm:h-7 h-6 sm:text-base text-xs text-dark-300 w-24 sm:w-32"
                  placeholder="Chọn màu"
                  options={product.optionColor || []}
                  value={selectedValue}
                  onChange={handleDropdownChange}
                />
              )} */}
        </div>

        {isPayment && (
          <div className="flex justify-between items-center">
            <Counter
              defaultValue={product.quantity}
              onChangeCount={handleCountChange}
              min={1}
            />
            <Trash
              className="cursor-pointer hover:opacity-70"
              onClick={() => onDeleteClick?.(product.productId._id)}
            />
          </div>
        )}

        {!isPayment && (
          <p className="text-base text-[#64748B]">
            Số lượng: {product.quantity}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductItem;
