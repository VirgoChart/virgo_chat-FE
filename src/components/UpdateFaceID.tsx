import { useEffect, useRef, useState, useCallback } from "react";
import * as faceapi from "face-api.js";
import { toast } from "react-toastify";
import axiosRequest from "@/config/axios";
import { cn } from "@/config/utils";

interface FaceDetectionModalProps {
  visible: boolean;
  onClose: () => void;
}

const FaceDetectionModal: React.FC<FaceDetectionModalProps> = ({
  visible,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [capturedDescriptor, setCapturedDescriptor] = useState<number[]>([]);
  const [isCounting, setIsCounting] = useState(false);

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

  const startVideo = useCallback(() => {
    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current!.srcObject = stream;
        })
        .catch((err) => console.error("❌ Lỗi truy cập camera:", err));
    }
  }, []);

  const stopVideo = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  const handleFaceDetection = useCallback(async () => {
    if (!videoRef.current || !modelsLoaded || !visible) return;

    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();
    if (detections.length > 0) {
      setIsCounting(true);
      setCapturedDescriptor(Array.from(detections[0].descriptor));
    } else {
      setIsCounting(false);
      setCapturedDescriptor([]);
    }
  }, [modelsLoaded, visible]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (modelsLoaded && visible) {
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
  }, [modelsLoaded, visible, handleFaceDetection]);

  const handleSave = async () => {
    if (capturedDescriptor.length > 0) {
      try {
        await axiosRequest.put(
          "/auth/update/face-id",
          { faceId: capturedDescriptor },
          { withCredentials: true }
        );
        toast.success("FaceID cập nhật thành công");
        onClose();
      } catch (error) {
        console.error(error);
        toast.error("Có lỗi xảy ra, vui lòng thử lại");
      }
    }
  };

  useEffect(() => {
    stopVideo();
  }, [visible]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${
        visible ? "block" : "hidden"
      }`}
    >
      <div className="bg-white p-5 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-xl font-bold mb-4">Nhận diện khuôn mặt</h2>
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-full bg-gray-200 rounded-lg"
        ></video>
        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
            onClick={onClose}
          >
            Đóng
          </button>
          <button
            className={cn(
              "px-4 py-2 bg-blue-500 text-white rounded-lg",
              capturedDescriptor.length === 0 &&
                "bg-gray-300 cursor-not-allowed"
            )}
            onClick={handleSave}
            disabled={capturedDescriptor.length === 0}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaceDetectionModal;
