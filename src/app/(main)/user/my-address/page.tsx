"use client";

import {
  createAddress,
  deleteAddress,
  editAddress,
  getAddresses,
  getAddress,
} from "@/apis/profile";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { Trash, Pen, Check } from "@/components/icons";
import { cn } from "@/config/utils";
import AddressModal from "./AddressModal";
import { successToast, errorToast } from "@/utils/toast";
import DeleteAddressModal from "./DeleteAddressModal";
import EditPrimaryModal from "./SetPrimaryAddressModal";
import Spin from "@/components/ui/Spin";
import { IAddressProps } from "@/apis/profile";

interface IAddress {
  name: string;
  country: string;
  city: string;
  district: string;
  ward: string;
  specificAddress: string;
  phoneNumber: string;
  zip: string;
  primary: boolean;
  _id: string | undefined;
}

const AddressList = () => {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [currentAddress, setCurrentAddress] = useState<IAddress>();
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [editPrimaryModalOpen, setEditPrimaryModalOpen] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchAddressList();
  }, []);

  const fetchAddressList = async () => {
    setIsLoading(true);
    try {
      const res = await getAddresses();
      setAddresses(res.data);
    } catch (error: any) {
      errorToast(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeAddress = (data: IAddressProps) => {
    const newData = { ...data, country: "Việt Nam" };
    setIsAddressModalOpen(false);
    if (isEdit) {
      handleEditAddress(currentAddress?._id, newData);
    } else {
      handleCreateAddress(newData);
    }
  };

  const handleDeleteAddress = async (addressId: string | undefined) => {
    setIsLoading(true);
    try {
      setDeleteModalOpen(false);
      await deleteAddress(addressId);
      successToast("Xóa địa chỉ thành công");
      setAddresses((prevAddresses) =>
        prevAddresses.filter((address) => address._id !== addressId)
      );
    } catch (error: any) {
      errorToast(error);
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const handleCreateAddress = async (formData: IAddressProps) => {
    try {
      const response = await createAddress(formData);
      setAddresses(response.data);
      successToast("Thêm địa chỉ thành công");
    } catch (error: any) {
      errorToast(error);
    } finally {
      setIsAddressModalOpen(false);
    }
  };

  const handleEditAddress = async (
    addressId: string | undefined,
    data: IAddressProps
  ) => {
    const newData = { ...data, country: "Việt Nam" };
    try {
      await editAddress(addressId, newData);
      await getAddress(addressId);
      successToast("Sửa địa chỉ thành công");
      fetchAddressList();
    } catch (error: any) {
      errorToast(error);
    } finally {
      setIsAddressModalOpen(false);
    }
  };

  const handleModalOpen = () => {
    setIsAddressModalOpen(true);
    setCurrentAddress(undefined);
  };

  const handleSetPrimaryAddress = async (
    addressId: string | undefined,
    data: IAddressProps
  ) => {
    setIsLoading(true);
    try {
      const updatedAddress = {
        name: data.name,
        city: data.city,
        district: data.district,
        ward: data.ward,
        specificAddress: data.specificAddress,
        phoneNumber: data.phoneNumber,
        zip: data.zip,
        primary: true,
        country: "Việt Nam",
      };

      await editAddress(addressId, updatedAddress);
      successToast("Đặt làm địa chỉ mặc định thành công");

      fetchAddressList();
    } catch (error: any) {
      errorToast(error);
    } finally {
      setIsLoading(false);
      setEditPrimaryModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsEdit(false);
    setCurrentAddress(undefined);
    setIsAddressModalOpen(false);
  };

  const sortedAddresses = [
    ...addresses.filter((address) => address.primary),
    ...addresses.filter((address) => !address.primary),
  ];

  return (
    <Spin
      isLoading={isLoading}
      className="text-dark-300 fill-blue-800 rounded-lg"
    >
      <div className="border border-dark-200 rounded-lg mb-10 xl:my-0 my-10 h-full">
        <div className="flex items-center justify-between md:px-10 px-6 py-4">
          <h2 className="md:text-xl text-lg font-medium sm:mb-0">
            Địa chỉ của tôi
          </h2>

          <Button
            variant="outlined"
            className="px-8 rounded font-normal md:text-lg text-base"
            onClick={handleModalOpen}
          >
            + Thêm địa chỉ
          </Button>
        </div>

        <div className="px-4 pt-0">
          {sortedAddresses.map((address, index) => (
            <AddressItem
              key={address._id}
              address={address}
              isLast={index === sortedAddresses.length - 1}
              onEdit={(address) => {
                setIsAddressModalOpen(true);
                setIsEdit(true);
                setCurrentAddress(address);
              }}
              onDelete={(address) => {
                setDeleteModalOpen(true);
                setCurrentAddress(address);
              }}
              onSetPrimary={(address) => {
                setEditPrimaryModalOpen(true);
                setCurrentAddress(address);
              }}
            />
          ))}
        </div>

        <DeleteAddressModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={() => handleDeleteAddress(currentAddress?._id)}
        />

        <EditPrimaryModal
          isOpen={editPrimaryModalOpen}
          onClose={() => setEditPrimaryModalOpen(false)}
          onConfirm={() => {
            handleSetPrimaryAddress(currentAddress?._id, currentAddress!);
          }}
        />
      </div>

      <AddressModal
        onChange={handleChangeAddress}
        onCancel={handleCancel}
        isEdit={isEdit}
        initialData={isEdit ? currentAddress : undefined}
        isOpen={isAddressModalOpen}
      />
    </Spin>
  );
};
export default AddressList;

interface IAddressItemProps {
  address: IAddress;
  isLast: boolean;
  onEdit: (address: IAddress) => void;
  onDelete: (address: IAddress) => void;
  onSetPrimary: (address: IAddress) => void;
}

const AddressItem: React.FC<IAddressItemProps> = ({
  address,
  isLast,
  onEdit,
  onDelete,
  onSetPrimary,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row justify-between items-start md:items-center p-6 bg-white border-t border-t-dark-200 gap-3",
        !isLast && ""
      )}
    >
      <div className="flex flex-col sm:w-60 lg:w-96">
        <h3 className="font-normal">{address.name}</h3>
        <p className="text-dark-500">{address.phoneNumber}</p>
        <p className="sm:line-clamp-2 text-dark-500">
          {address.specificAddress}, {address.ward}, {address.district},{" "}
          {address.city}, {address.country}
        </p>
      </div>

      <div className="flex gap-1 items-center">
        {address.primary ? (
          <div className="px-4 py-1 text-sm font-medium flex gap-2 items-center">
            <Check />
            <span>Mặc định</span>
          </div>
        ) : (
          <Button
            variant="outlined"
            className="border-none md:text-base text-sm h-fit text-black font-normal py-1 px-4 rounded-md hover:underline hover:bg-white hover:text-black"
            onClick={() => onSetPrimary(address)}
          >
            Đặt làm mặc định
          </Button>
        )}

        <Button
          variant="outlined"
          className="border-none hover:underline md:text-base text-sm rounded-md h-fit py-1 px-4 flex items-center justify-center font-normal gap-2 hover:bg-white hover:text-primary"
          onClick={() => onEdit(address)}
        >
          <Pen />
          <span>Chỉnh sửa</span>
        </Button>

        <div
          className="border-none bg-none hover:bg-none h-10 flex items-center justify-center text-red-500 cursor-pointer"
          onClick={() => onDelete(address)}
        >
          <Trash className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};
