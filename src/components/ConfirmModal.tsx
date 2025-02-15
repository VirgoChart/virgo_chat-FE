import { Modal } from "antd";

interface IProps {
  open: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  user?: any;
}

const ConfirmModal = ({ open, onClose, onConfirm, user }: IProps) => {
  return (
    <Modal
      title="Xác nhận bỏ chặn"
      open={open}
      onOk={onConfirm}
      onCancel={onClose}
      okText="Bỏ chặn"
      cancelText="Hủy"
      okButtonProps={{ danger: true }}
    >
      <p>
        Bạn có chắc chắn muốn bỏ chặn{" "}
        <strong>{user?.to.fullName || "người dùng"}</strong> không?
      </p>
    </Modal>
  );
};

export default ConfirmModal;
