import { Modal, Button } from "antd";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  updateParticipantCall,
  updateStatusCall,
} from "@/services/CallServices";
import { getCookie } from "@/utils/cookies";

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  callId: string;
}

const CallModal: React.FC<CallModalProps> = ({ isOpen, onClose, callId }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("calling");
  const jwt = getCookie("jwt");

  const { socket, connectSocket } = useAuthStore();

  useEffect(() => {
    if (!socket) return;

    connectSocket();

    // Lắng nghe sự kiện cuộc gọi
    socket.on("updatedCall", (updatedCall) => {
      if (updatedCall._id === callId) {
        setStatus(updatedCall.status);
      }
    });

    return () => {
      socket.off("updatedCall");
    };
  }, [socket, callId]);

  const handleAcceptCall = async () => {
    setLoading(true);
    try {
      if (!jwt) throw new Error("JWT is undefined");
      await updateParticipantCall(callId, "connection", jwt);
      setStatus("connected");
    } catch (error) {
      console.error("Lỗi chấp nhận cuộc gọi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndCall = async () => {
    try {
      if (!jwt) throw new Error("JWT is undefined");
      await updateStatusCall(callId, jwt);
      setStatus("ended");
      setStatus("ended");
      onClose();
    } catch (error) {
      console.error("Lỗi kết thúc cuộc gọi:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onCancel={onClose} footer={null}>
      <div className="flex flex-col items-center p-4">
        <h2 className="text-lg font-semibold">
          {status === "calling" ? "Cuộc gọi đến..." : "Đang gọi..."}
        </h2>

        {status === "calling" && (
          <div className="flex gap-4 mt-4">
            <Button type="primary" loading={loading} onClick={handleAcceptCall}>
              Chấp nhận
            </Button>
            <Button danger loading={loading} onClick={handleEndCall}>
              Từ chối
            </Button>
          </div>
        )}

        {status === "connected" && (
          <Button danger loading={loading} onClick={handleEndCall}>
            Kết thúc cuộc gọi
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default CallModal;
