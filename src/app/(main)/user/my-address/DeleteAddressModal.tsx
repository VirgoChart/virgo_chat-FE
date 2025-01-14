import Modal from "@/components/ui/Modal";
import { Warning } from "@/components/icons";

interface IDeleteAddressModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
}

const DeleteAddressModal = ({
  isOpen,
  onClose,
  onConfirm,
}: IDeleteAddressModalProps) => {
  return (
    <Modal
      onCancel={onClose}
      onOk={onConfirm}
      title="Xác nhận xóa địa chỉ"
      isOpen={isOpen}
      cancelText="Thoát"
      okText="Xác nhận"
    >
      <div className="p-4 flex gap-6">
        <Warning />
        <span>Bạn có chắc chắn muốn đăng xuất khỏi tài khoản hiện tại?</span>
      </div>
    </Modal>
  );
};

export default DeleteAddressModal;
