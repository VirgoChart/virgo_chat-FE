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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const thugLifeGlasses = useRef<HTMLImageElement | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [capturedDescriptor, setCapturedDescriptor] = useState<number[]>([]);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      console.log("✅ Face API models loaded");
      setModelsLoaded(true);
    };

    const loadGlassesImage = () => {
      const img = new Image();
      img.src = "/images/thuglife.jpg";
      img.onload = () => (thugLifeGlasses.current = img);
    };

    loadModels();
    loadGlassesImage();
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

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { width, height } = videoRef.current.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    }

    if (detections.length > 0) {
      setCapturedDescriptor(Array.from(detections[0].descriptor));

      if (canvas && ctx) {
        detections.forEach((det) => {
          const box = det.detection.box;
          const landmarks = det.landmarks;
          const leftEye = landmarks.getLeftEye();
          console.log(leftEye);
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
            const eyeX = leftEyeCenter.x - 100 - eyeWidth * 0.2;
            const eyeY =
              (leftEyeCenter.y + rightEyeCenter.y) / 2 - eyeHeight * 0.5 - 150;

            // Vẽ kính
            if (thugLifeGlasses.current) {
              ctx.drawImage(
                thugLifeGlasses.current,
                eyeX,
                eyeY,
                eyeWidth * 1.5, // Điều chỉnh kích thước kính phù hợp
                eyeHeight * 2
              );
            }
          }
        });
      }
    } else {
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
      <div className="relative bg-white p-5 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-xl font-bold mb-4">Nhận diện khuôn mặt</h2>
        <div className="relative w-full h-64 bg-gray-200 rounded-lg">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="absolute top-0 left-0 w-full h-full"
          ></video>
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
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
