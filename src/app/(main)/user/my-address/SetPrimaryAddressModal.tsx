import Modal from "@/components/ui/Modal";

interface EditPrimaryModal {
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
}

const EditPrimaryModal = ({ isOpen, onClose, onConfirm }: EditPrimaryModal) => {
  return (
    <Modal
      onCancel={onClose}
      onOk={onConfirm}
      title="Đặt làm địa chỉ mặc định?"
      isOpen={isOpen}
      cancelText="Thoát"
      okText="Xác nhận"
    >
      <div className="p-4">
        Bạn có chắc chắn muốn đặt địa chỉ này thành địa chỉ mặc định
      </div>
    </Modal>
  );
};

export default EditPrimaryModal;
