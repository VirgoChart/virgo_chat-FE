"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { updateParticipantCall } from "@/services/callServices";
import { getCookie } from "@/utils/cookies";
import * as faceapi from "face-api.js";
import { Select } from "antd";

const socket = io("http://localhost:5000");

const VideoCall = ({ params }: { params: {} }) => {
  const [peer, setPeer] = useState<Peer.Instance | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const searchParams = useSearchParams();
  const [isSwapped, setIsSwapped] = useState(false);
  const router = useRouter();
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const thugLifeGlasses = useRef<HTMLImageElement | null>(null);
  const filterImage = useRef<HTMLImageElement | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [detector, setDetector] = useState<any>(null);
  const [capturedDescriptor, setCapturedDescriptor] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef2 = useRef<HTMLCanvasElement>(null);

  const callId = searchParams.get("callId");
  const isCaller = searchParams.get("isCaller") === "true";

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const jwt = getCookie("jwt");

  const filters = [
    { name: "Kính 1", src: "/images/thugLife.png", value: "k" },
    { name: "Kính 2", src: "/images/kinh.png", value: "k" },
    { name: "Tai gấu", src: "/images/taigau.png", value: "t" },
    { name: "Tai thỏ", src: "/images/taitho.png", value: "t" },
    { name: "Râu 1", src: "/images/rau.png", value: "r" },
    { name: "Râu 2", src: "/images/rau2.png", value: "r" },
  ];

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
    const img = new Image();
    img.src = selectedFilter;
    img.onload = () => {
      filterImage.current = img;
    };
  }, [selectedFilter]);

  useEffect(() => {
    const getMediaStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        socket.emit("join-call", callId);
      } catch (error) {
        console.error("❌ Không thể truy cập camera/mic:", error);
      }
    };

    getMediaStream();
  }, []);

  const handleFaceDetection = useCallback(async () => {
    if (!localVideoRef.current || !modelsLoaded) return;

    const detections = await faceapi
      .detectAllFaces(
        localVideoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceLandmarks()
      .withFaceDescriptors();

    const canvas1 = canvasRef.current;
    const canvas2 = canvasRef2.current;

    const ctx1 = canvas1?.getContext("2d");
    const ctx2 = canvas2?.getContext("2d");

    if (canvas1 && ctx1 && canvas2 && ctx2) {
      ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
      ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

      const { width, height } = localVideoRef?.current.getBoundingClientRect();
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
          const eyeX = leftEyeCenter.x - 165 - eyeWidth * 0.2;
          const eyeY =
            (leftEyeCenter.y + rightEyeCenter.y) / 2 - eyeHeight * 0.5 - 105;

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
    if (localVideoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          localVideoRef.current!.srcObject = stream;
        })
        .catch((err) => console.error("❌ Lỗi truy cập camera:", err));
    }
  }, []);

  const stopVideo = useCallback(() => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      localVideoRef.current.srcObject = null;
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

  useEffect(() => {
    if (!localStream) return;

    const peerInstance = new Peer({
      initiator: isCaller,
      trickle: false,
      stream: localStream,
      config: {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      },
    });

    peerInstance.on("signal", (data) => {
      console.log("📡 Gửi tín hiệu WebRTC:", data);
      socket.emit("send-signal", { callId: callId, signalData: data });
    });

    peerInstance.on("stream", (stream) => {
      setRemoteStream(stream);
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream;
    });

    peerInstance.on("error", (err) => console.error("❌ Lỗi Peer:", err));

    peerInstance.on("close", () => {
      console.log("🔴 Kết thúc cuộc gọi");
      setPeer(null);
    });

    socket.on("receive-signal", ({ signalData }) => {
      console.log("📡 Nhận tín hiệu từ đối phương");
      peerInstance.signal(signalData);
    });

    setPeer(peerInstance);

    return () => {
      peerInstance.destroy();
      socket.off("receive-signal");
    };
  }, [callId, isCaller, localStream]);

  useEffect(() => {
    socket.on("leave-call", () => {
      console.log("🔴 Đối phương đã rời cuộc gọi");
      peer?.destroy();
      setPeer(null);
      setRemoteStream(null);
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      router.push("/chat");
    });

    return () => {
      socket.off("leave-call");
    };
  }, [peer, localStream, router]);

  const endCall = async () => {
    socket.emit("leave-call", callId);
    peer?.destroy();
    setPeer(null);
    setRemoteStream(null);
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (callId) {
      await updateParticipantCall(callId, "missed", jwt);
      toast.success("Cuộc gọi đã kết thúc");
      router.push("/chat");
    } else {
      console.error("❌ callId is undefined");
    }
  };

  return (
    <div className="flex flex-wrap flex-col items-center space-y-4 relative">
      <div className="flex gap-4 relative">
        {/* Video của bạn */}
        <div className="relative">
          <video
            ref={localVideoRef}
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
            ref={remoteVideoRef}
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
        onClick={endCall}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Kết thúc
      </button>
    </div>
  );
};

export default VideoCall;
