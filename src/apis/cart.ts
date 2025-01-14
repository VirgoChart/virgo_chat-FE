import { IQuantityChange } from "@/components/ui/ProductItem";
import axiosRequest from "@/config/axios";

export const getCart = () => {
  try {
    return axiosRequest.get("/carts");
  } catch (error) {
    console.log(error);
  }
};

export const getAddress = (userId: string) => {
  try {
    return axiosRequest.get(`/users/${userId}/address`);
  } catch (error) {
    console.log(error);
  }
};

export const addToCart = (data: { productId: string; quantity: number }) => {
  try {
    return axiosRequest.post("/carts/add-to-cart", data);
  } catch (error) {
    console.log(error);
  }
};

export const removeFromCart = (data: { productId: string }) => {
  return axiosRequest.delete("/carts/remove-from-cart", { data });
};

export const updateQuantity = (data: IQuantityChange) => {
  return axiosRequest.put("/carts/update-quantity", data);
};

const cartAPI = {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
};

export default cartAPI;
