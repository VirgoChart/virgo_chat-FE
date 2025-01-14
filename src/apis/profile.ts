import axiosRequest from "@/config/axios";

export interface IAddressProps {
  name: string;
  city: string;
  district: string;
  ward: string;
  specificAddress: string;
  phoneNumber: string;
  zip: string;
  primary: boolean;
}

export interface IUserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export const updateUserInfo = (data: IUserData) => {
  return axiosRequest.put(`users/profile`, data);
};

export const uploadImage = (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  return axiosRequest.post("/images/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAddresses = () => {
  return axiosRequest.get(`users/address`);
};

export const getUser = () => {
  return axiosRequest.get(`users/profile`);
};

export const getAddress = (addressId: string | undefined) => {
  return axiosRequest.get(`users/address/${addressId}`);
};

export const createAddress = (formAddress: IAddressProps) => {
  return axiosRequest.post(`users/address`, formAddress);
};

export const editAddress = (
  addressId: string | undefined,
  data: IAddressProps
) => {
  return axiosRequest.put(`users/address/${addressId}`, data);
};

export const deleteAddress = (addressId: string | undefined) => {
  return axiosRequest.delete(`users/address/${addressId}`);
};

export const changePassword = (data: {
  newPassword: string;
  oldPassword: string;
}) => {
  return axiosRequest.post("users/change-password", data);
};
