import { Modal, Button } from "antd";

interface BlockUserModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  requestText: string;
}

const BlockUserModal: React.FC<BlockUserModalProps> = ({
  open,
  onClose,
  onConfirm,
  requestText,
}) => {
  const isUnblock = requestText === "unBlock";

  return (
    <Modal
      title={
        isUnblock ? "Xác nhận bỏ chặn người dùng" : "Xác nhận chặn người dùng"
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="confirm"
          type="primary"
          danger={!isUnblock}
          onClick={onConfirm}
        >
          {isUnblock ? "Bỏ Block" : "Block"}
        </Button>,
      ]}
    >
      <p>
        {isUnblock
          ? "Bạn có chắc chắn muốn bỏ chặn người dùng này không?"
          : "Bạn có chắc chắn muốn chặn người dùng này không?"}
      </p>
    </Modal>
  );
};

export default BlockUserModal;
