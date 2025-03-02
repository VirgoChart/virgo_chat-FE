"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createPeer } from "@/services/rtc";
import { updateParticipantCall } from "@/services/callServices";
import { useAuthStore } from "@/store/useAuthStore";
import { getCookie } from "@/utils/cookies";
import { toast } from "react-toastify";
import * as faceapi from "face-api.js";
import { Select } from "antd";

interface VideoCallProps {
  peer: any;
}

const filters = [
  { name: "Kính 1", src: "/images/thugLife.png", value: "k1" },
  { name: "Kính 2", src: "/images/kinh.png", value: "k2" },
  { name: "Tai gấu", src: "/images/taigau.png", value: "t1" },
  { name: "Tai thỏ", src: "/images/taitho.png", value: "t2" },
  { name: "Râu 1", src: "/images/rau.png", value: "r1" },
  { name: "Râu 2", src: "/images/rau2.png", value: "r2" },
];

const VideoCall: React.FC<VideoCallProps> = ({ peer: incomingPeer }) => {
  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null); // Add canvas for filter rendering
  const canvasRef2 = useRef<HTMLCanvasElement>(null); // Add canvas for filter rendering

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peer, setPeer] = useState<any>(incomingPeer);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [detector, setDetector] = useState<any>(null); // Face detector model
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const thugLifeGlasses = useRef<HTMLImageElement | null>(null);
  const filterImage = useRef<HTMLImageElement | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const jwt = getCookie("jwt");
  const { socket, connectSocket } = useAuthStore();
  const searchParams = useSearchParams();
  const callId = searchParams.get("callId");
  const roomId = searchParams.get("roomId");
  const isCaller = searchParams.get("isCaller") === "true";
  const [capturedDescriptor, setCapturedDescriptor] = useState<number[]>([]);

  const router = useRouter();

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      console.log("✅ Face API models loaded");
      setModelsLoaded(true);
    };

    loadModels();
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = selectedFilter;
    img.onload = () => {
      filterImage.current = img;
    };
  }, [selectedFilter]);

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
    if (!socket || !selectedDeviceId || !detector) return;

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
          userVideo.current.play();
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
  }, [socket, isCaller, selectedDeviceId, roomId, detector]);

  // Face detection and filter rendering function
  const handleFaceDetection = useCallback(async () => {
    if (!myVideo.current || !modelsLoaded) return;

    const detections = await faceapi
      .detectAllFaces(myVideo.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();

    const canvas1 = canvasRef.current;
    const canvas2 = canvasRef2.current;

    const ctx1 = canvas1?.getContext("2d");
    const ctx2 = canvas2?.getContext("2d");

    if (canvas1 && ctx1 && canvas2 && ctx2) {
      ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
      ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

      const { width, height } = myVideo?.current.getBoundingClientRect();
      canvas1.width = width;
      canvas1.height = height;
      canvas2.width = width;
      canvas2.height = height;
    }

    if (detections.length > 0) {
      setCapturedDescriptor(Array.from(detections[0].descriptor));

      detections.forEach((det) => {
        const box = det.detection.box;
        const landmarks = det.landmarks;
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();

        if (leftEye.length > 0 && rightEye.length > 0) {
          // Lấy trung tâm của mỗi mắt
          const leftEyeCenter = {
            x: (leftEye[0]._x + leftEye[leftEye.length - 1]._x) / 2,
            y: (leftEye[0]._y + leftEye[leftEye.length - 1]._y) / 2,
          };

          const rightEyeCenter = {
            x: (rightEye[0]._x + rightEye[rightEye.length - 1]._x) / 2,
            y: (rightEye[0]._y + rightEye[rightEye.length - 1]._y) / 2,
          };

          // Tính kích thước kính
          const eyeWidth = rightEyeCenter.x - leftEyeCenter.x;
          const eyeHeight = eyeWidth / 3;

          // Xác định vị trí kính (đặt kính vào trung tâm giữa hai mắt)
          const eyeX = leftEyeCenter.x - 160 - eyeWidth * 0.2;
          const eyeY =
            (leftEyeCenter.y + rightEyeCenter.y) / 2 - eyeHeight * 0.5 - 100;

          // Vẽ kính lên canvas1
          if (ctx1 && filterImage.current) {
            ctx1.drawImage(
              filterImage.current,
              eyeX,
              eyeY,
              eyeWidth * 1.5,
              eyeHeight * 2
            );
          }

          // Vẽ kính lên canvas2
          if (ctx2 && filterImage.current) {
            ctx2.drawImage(
              filterImage.current,
              eyeX,
              eyeY,
              eyeWidth * 1.5,
              eyeHeight * 2
            );
          }
        }
      });
    } else {
      setCapturedDescriptor([]);
    }
  }, [modelsLoaded]);

  const startVideo = useCallback(() => {
    if (myVideo.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          myVideo.current!.srcObject = stream;
        })
        .catch((err) => console.error("❌ Lỗi truy cập camera:", err));
    }
  }, []);

  const stopVideo = useCallback(() => {
    if (myVideo.current && myVideo.current.srcObject) {
      const stream = myVideo.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      myVideo.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (modelsLoaded) {
      console.log("📸 Modal opened, starting face detection...");
      startVideo();

      intervalId = setInterval(() => {
        handleFaceDetection();
      }, 1000);
    } else {
      stopVideo();
      if (intervalId) clearInterval(intervalId);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [modelsLoaded, handleFaceDetection, startVideo, stopVideo]);

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
    <div className="flex flex-wrap flex-col items-center space-y-4 relative">
      <div className="flex gap-4 relative">
        {/* Video của bạn */}
        <div className="relative">
          <video
            ref={myVideo}
            autoPlay
            muted
            playsInline
            className="w-96 h-96 rounded-lg border"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />
        </div>

        {/* Video của user */}
        <div className="relative">
          <video
            ref={userVideo}
            autoPlay
            playsInline
            className="w-96 h-96 rounded-lg border"
          />
          <canvas
            ref={canvasRef2}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />
        </div>
      </div>
      <Select
        className="border p-2 rounded mb-4 w-64"
        value={selectedFilter}
        onChange={(value) => setSelectedFilter(value)}
        options={filters.map((filter) => ({
          value: filter.src,
          label: (
            <div className="flex items-center gap-2 border-none">
              <img
                src={filter.src}
                alt={filter.name}
                className="w-8 h-8 rounded"
              />
              <span>{filter.name}</span>
            </div>
          ),
        }))}
      />
      ;
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
