"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createPeer } from "@/services/rtc";
import { updateParticipantCall } from "@/services/callServices";
import { useAuthStore } from "@/store/useAuthStore";
import { getCookie } from "@/utils/cookies";
import { toast } from "react-toastify";

interface VideoCallProps {
  peer: any;
}

const VideoCall: React.FC<VideoCallProps> = ({ peer: incomingPeer }) => {
  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peer, setPeer] = useState<any>(incomingPeer);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const jwt = getCookie("jwt");
  const { socket, connectSocket } = useAuthStore();
  const searchParams = useSearchParams();
  const callId = searchParams.get("callId");
  const roomId = searchParams.get("roomId");
  const isCaller = searchParams.get("isCaller") === "true";

  const router = useRouter();

  useEffect(() => {
    if (socket === null) {
      connectSocket();
    }
  }, []);

  useEffect(() => {
    const handleUpdatedCall = (updatedCall: any) => {
      console.log("📞 Cập nhật trạng thái cuộc gọi:", updatedCall);
      if (updatedCall.status === "missed") {
        router.push("/chat");
      }
    };

    socket?.on("updatedCall", handleUpdatedCall);
    return () => {
      socket?.off("updatedCall", handleUpdatedCall);
    };
  }, [socket]);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error("❌ Lỗi lấy danh sách thiết bị:", error);
      }
    };

    getDevices();
  }, []);

  useEffect(() => {
    if (!socket || !selectedDeviceId) return;

    const startCall = async () => {
      try {
        console.log("🎥 Bắt đầu lấy stream video...");
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: selectedDeviceId
              ? { exact: selectedDeviceId }
              : undefined,
          },
          audio: true,
        });

        setLocalStream(mediaStream);
        if (myVideo.current) myVideo.current.srcObject = mediaStream;
        if (userVideo.current) {
          userVideo.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error("❌ Lỗi truy cập camera/micro:", error);
        toast.error("Không thể truy cập camera/micro: " + error.message);
      }
    };

    startCall();

    const handleCallUser = ({ signal }: any) => {
      if (!localStream) {
        console.error("❌ localStream chưa sẵn sàng!");
        return;
      }
      console.log("📞 Nhận cuộc gọi với tín hiệu:", signal);
      const newPeer = createPeer(localStream, false);
      setPeer(newPeer);

      newPeer.signal(signal);
      newPeer.on("signal", (returnSignal: any) => {
        console.log("📡 Phản hồi cuộc gọi:", returnSignal);
        socket.emit("callAccepted", { roomId, signal: returnSignal });
      });

      newPeer.on("stream", (stream: MediaStream) => {
        console.log("📡 Nhận luồng video từ người gọi", stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
          userVideo.current.play(); // Đảm bảo phát video
        }
      });
    };

    socket.on("callUser", handleCallUser);

    const handleCallAccepted = ({ signal }: any) => {
      console.log("✅ Cuộc gọi được chấp nhận, tín hiệu:", signal);
      if (peer && !peer.destroyed) {
        peer.signal(signal);
      }
    };

    socket.on("callAccepted", handleCallAccepted);

    return () => {
      console.log("🛑 Dọn dẹp cuộc gọi...");
      localStream?.getTracks().forEach((track) => track.stop());
      peer?.destroy();

      socket.off("callUser", handleCallUser);
      socket.off("callAccepted", handleCallAccepted);
    };
  }, [socket, isCaller, selectedDeviceId, roomId]);

  const handleEndCall = async () => {
    console.log("🚪 Kết thúc cuộc gọi...");
    if (callId) {
      await updateParticipantCall(callId, "missed", jwt);
      toast.success("Cuộc gọi đã kết thúc");
      router.push("/chat");
    }
    localStream?.getTracks().forEach((track) => track.stop());
    peer?.destroy();
  };

  return (
    <div className="flex flex-wrap flex-col items-center space-y-4">
      <div className="flex gap-4">
        <video
          ref={myVideo}
          autoPlay
          muted
          playsInline
          className="w-96 h-96 rounded-lg border"
        />
        <video
          ref={userVideo}
          autoPlay
          playsInline
          className="w-96 h-96 rounded-lg border"
        />
      </div>
      <button
        onClick={handleEndCall}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Kết thúc
      </button>
    </div>
  );
};

export default VideoCall;
