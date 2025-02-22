"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createPeer } from "@/services/rtc";
import { updateParticipantCall } from "@/services/callServices";
import { useAuthStore } from "@/store/useAuthStore";
import { getCookie } from "@/utils/cookies";
import { toast } from "react-toastify";

const VideoCall: React.FC = () => {
  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peer, setPeer] = useState<any>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [peerID, setPeerID] = useState<string | null>(null); // Thêm peerID

  const jwt = getCookie("jwt");

  const { socket, connectSocket } = useAuthStore();
  const searchParams = useSearchParams();
  const callId = searchParams.get("callId");
  const roomId = searchParams.get("roomId");
  const isCaller = searchParams.get("isCaller") === "true";

  const router = useRouter();

  useEffect(() => {
    connectSocket();
  }, [connectSocket]);

  useEffect(() => {
    const handleUpdatedCall = (updatedCall: any) => {
      console.log("📞 Trạng thái cuộc gọi:", updatedCall);
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
        console.log("🔍 Đang lấy danh sách thiết bị...");
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách thiết bị:", error);
      }
    };

    getDevices();
  }, []);

  useEffect(() => {
    const startCall = async () => {
      try {
        console.log("🎥 Yêu cầu quyền truy cập camera/mic...");
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: selectedDeviceId
            ? { deviceId: { exact: selectedDeviceId } }
            : true,
          audio: true,
        });

        setLocalStream(mediaStream);
        if (myVideo.current) myVideo.current.srcObject = mediaStream;

        if (isCaller) {
          console.log("📡 Người gọi tạo kết nối WebRTC...");
          const newPeer = createPeer(mediaStream, true);
          setPeer(newPeer);
          setPeerID(socket?.id); // Lưu lại peerID

          newPeer.on("signal", (signal: any) => {
            console.log("📡 Gửi tín hiệu WebRTC...", signal);
            socket?.emit("callUser", { roomId, signal, peerID: socket.id });
          });

          newPeer.on("stream", (stream: MediaStream) => {
            console.log("📡 Nhận stream từ người nhận...");
            setRemoteStream(stream);
            if (userVideo.current) userVideo.current.srcObject = stream;
          });
        }
      } catch (error) {
        console.error("❌ Lỗi truy cập camera/mic:", error);
        toast.error("Không thể truy cập camera/micro: " + error.message);
      }
    };

    if (selectedDeviceId) {
      startCall();
    }

    socket?.on("callAccepted", ({ signal, peerID: remotePeerID }: any) => {
      console.log("📡 Cuộc gọi được chấp nhận từ:", remotePeerID);
      if (peer && remotePeerID !== peerID) {
        peer.signal(signal);
      }
    });

    return () => {
      console.log("🔴 Giải phóng tài nguyên cuộc gọi...");
      localStream?.getTracks().forEach((track) => track.stop());
      remoteStream?.getTracks().forEach((track) => track.stop());
      peer?.destroy();
    };
  }, [socket, isCaller, selectedDeviceId]);

  const handleEndCall = async () => {
    console.log("📞 Kết thúc cuộc gọi...");
    if (callId) {
      await updateParticipantCall(callId, "missed", jwt);
      toast.success("Cuộc gọi đã kết thúc");
      router.push("/chat");
    }
    localStream?.getTracks().forEach((track) => track.stop());
    remoteStream?.getTracks().forEach((track) => track.stop());
    peer?.destroy();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <video
        ref={myVideo}
        autoPlay
        muted
        className="w-96 h-96 rounded-lg border"
      />
      <video ref={userVideo} autoPlay className="w-96 h-96 rounded-lg border" />
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
