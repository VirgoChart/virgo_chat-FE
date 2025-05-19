import { Modal, Avatar, Tag } from "antd";

interface User {
  avatar: string;
  fullName: string;
  _id: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  user: User;
  joinedAt: string;
  role: string;
}

export default function UserDetailModal({
  open,
  onClose,
  user,
  joinedAt,
  role,
}: Props) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      closeIcon={false}
      className="custom-user-modal"
    >
      <div className="bg-gradient-to-br from-[#0f2a22] to-[#283b1e] rounded-xl shadow-xl p-6 flex flex-col items-center text-center space-y-5 text-white">
        <div className="relative">
          <Avatar
            size={96}
            src={user?.avatar}
            className="border-4 border-blue-500 shadow-lg"
          />
          <div className="absolute -bottom-1 -right-1 bg-blue-500 p-1 rounded-full border-2 border-white">
            <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
          </div>
        </div>

        <h2 className="text-xl font-bold tracking-wide">{user?.fullName}</h2>
        <div className="text-sm text-gray-300 font-mono">ID: {user?._id}</div>

        <div className="flex flex-col gap-1 items-center">
          <div className="text-sm">
            Ngày tham gia:
            <span className="ml-1 text-blue-400 font-semibold">
              {new Date(joinedAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
          <Tag color="geekblue" className="uppercase font-bold tracking-wider">
            {role}
          </Tag>
        </div>

        <button
          onClick={onClose}
          className="mt-4 btn btn-sm btn-outline btn-info transition-all hover:scale-105"
        >
          Đóng
        </button>
      </div>
    </Modal>
  );
}
