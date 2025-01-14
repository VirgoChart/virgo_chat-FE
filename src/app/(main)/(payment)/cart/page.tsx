"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { getCart, removeFromCart, updateQuantity } from "@/apis/cart";
import { formatPrice } from "@/utils/formatPrice";
import useDebounce from "@/hooks/useDebounce";
import Spin from "@/components/ui/Spin";
import Modal from "@/components/ui/Modal";
import { successToast, errorToast } from "@/utils/toast";
import ProductItem, {
  IProductItem,
  IQuantityChange,
} from "@/components/ui/ProductItem";
import { useRouter } from "next/navigation";

interface IDataProduct {
  _id: string;
  products: IProductItem[];
  status: string;
  totalProducts: number;
  totalPrice: number;
}

export default function Cart() {
  const router = useRouter();
  const [dataCart, setDataCart] = useState<IDataProduct>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idProductRemove, setIdProductRemove] = useState("");
  const [quantityChange, setQuantityChange] = useState<IQuantityChange>({
    productId: "",
    quantity: 0,
    type: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const debouncedQuantity = useDebounce(quantityChange, 1000);

  useEffect(() => {
    handleGetCart();
  }, []);

  useEffect(() => {
    if (debouncedQuantity.productId) {
      handleChangeQuantity(debouncedQuantity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuantity]);

  // console.log(response);
  // const [listCart, setListCart] = useState
  // const onProductChecked = (checkedItem: IProduct, isChecked: boolean) => {
  //   const checked = listProductChecked.some(
  //     (item: IProduct) => item.id === checkedItem.id
  //   );
  //   let updatedCheckedItems: IProduct[];
  //   if (isChecked && checked) {
  //     updatedCheckedItems = listProductChecked.map((item: IProduct) =>
  //       item.id === checkedItem.id ? checkedItem : item
  //     );
  //   } else {
  //     updatedCheckedItems = isChecked
  //       ? [...listProductChecked, checkedItem]
  //       : listProductChecked.filter((item) => item.id !== checkedItem.id);
  //   }
  //   setListProductChecked(updatedCheckedItems);
  // };

  const handleGetCart = async () => {
    const res = await getCart();
    setDataCart(res?.data);
    setIsLoading(false);
  };

  const handleDeleteCart = async (productId: string) => {
    setIsModalOpen(true);
    setIdProductRemove(productId);
  };

  const handleChangeQuantity = async (data: IQuantityChange) => {
    try {
      const res = await updateQuantity(data);
      handleGetCart();
      successToast("Cập nhật số lượng thành công");
    } catch (error) {
      errorToast("Phiên bản đã hết hạn");
    }
  };

  const handleDeleteModal = async () => {
    setIsLoading(true);
    try {
      setIsModalOpen(false);
      await removeFromCart({ productId: idProductRemove });
      await handleGetCart();
      successToast("Xóa sản phẩm thành công");
    } catch (error) {
      errorToast("Phiên bản đã hết hạn");
      console.log(error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCheckout = () => {
    setIsLoading(true);
    router.push("/checkout");
  };

  return (
    <div>
      <div className="container-base">
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="custom-card border-t border-t-white-400">
            {dataCart && dataCart.products?.length > 0 ? (
              dataCart.products.map((item, index) => (
                <ProductItem
                  key={index}
                  product={item}
                  isPayment={true}
                  className={
                    index === dataCart.products.length - 1
                      ? ""
                      : "border-b border-b-white-400"
                  }
                  onDeleteClick={handleDeleteCart}
                  onChange={(data: IQuantityChange) => setQuantityChange(data)}
                />
              ))
            ) : (
              <div className="min-h-28 flex flex-col items-center justify-center h-full text-xl pt-3">
                <span className="text-dark-500">Giỏ hàng trống</span>
                <Image
                  src="/images/cart-empty.png"
                  width={500}
                  height={500}
                  alt="empty-cart"
                  className="w-40 md:w-52"
                />
              </div>
            )}
          </div>

          <div className="custom-card md:w-[500px] h-full">
            <h1 className="text-lg mb-3">Tổng tiền</h1>
            <div className="flex justify-between items-center">
              <span className="text-sm">{`${dataCart?.totalProducts || 0} sản phẩm`}</span>
              <span className="text-base font-medium">
                {formatPrice(dataCart?.totalPrice || 0)}
              </span>
            </div>
            <div className="text-red text-end text-xs mb-6">Tiết kiệm: 0đ</div>
            <Spin
              isLoading={isLoading}
              className="text-dark-300 fill-primary-600"
            >
              <Button
                className="w-full text-xl font-extralight select-none"
                onClick={handleCheckout}
                disabled={!dataCart || dataCart?.products?.length === 0}
              >
                {isLoading ? "Đang xử lý..." : "Thanh toán"}
              </Button>
            </Spin>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onCancel={handleCancel}
        onOk={handleDeleteModal}
        title="Xác nhận xóa"
        okText="Đồng ý"
        cancelText="Bỏ qua"
      >
        <p>Bạn có muốn xóa sản phẩm ra khỏi giỏ hàng ?</p>
      </Modal>
    </div>
  );
}
