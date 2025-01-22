import React, { useCallback, useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axiosRequest from "@/config/axios";
import { toast } from "react-toastify";

// Định nghĩa các kiểu dữ liệu cho các props
interface UpdateFaceIDModalProps {
  visible: boolean;
  onClose: () => void;
}

const UpdateFaceIDModal: React.FC<UpdateFaceIDModalProps> = ({
  visible,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [capturedDescriptor, setCapturedDescriptor] = useState<number[]>([]);
  const [countdown, setCountdown] = useState(5);
  const [isCounting, setIsCounting] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Hàm tải mô hình face-api.js
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      setModelsLoaded(true);
    };

    loadModels();
  }, []);

  // Hàm bắt đầu video từ webcam
  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => console.error("Lỗi truy cập camera: ", err));
  };

  // Hàm xử lý phát hiện khuôn mặt
  const handleFaceDetection = useCallback(async () => {
    if (videoRef.current && modelsLoaded && visible) {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length > 0 && !isCounting) {
        setIsCounting(true);
        // Dừng tất cả các interval cũ
        if (intervalId) clearInterval(intervalId);

        const newIntervalId = setInterval(() => {
          setCountdown((prev) => {
            const nextCountdown = prev - 1;
            if (nextCountdown === 0) {
              clearInterval(newIntervalId);
              const descriptors = detections.flatMap((detection) =>
                Array.from(detection.descriptor)
              );
              setCapturedDescriptor(descriptors);
              setIsCounting(false);
              setCountdown(5); // Reset countdown
            }
            return nextCountdown;
          });
        }, 1000);

        setIntervalId(newIntervalId);
      }

      if (detections.length === 0 && isCounting) {
        setIsCounting(false);
        setCountdown(5); // Reset countdown nếu không có khuôn mặt
      }

      requestAnimationFrame(handleFaceDetection);
    }
  }, [modelsLoaded, visible, intervalId, isCounting]);

  // Hàm lưu Face ID lên server
  const handleSave = async () => {
    if (capturedDescriptor) {
      try {
        setIsCounting(false);
        setCountdown(5);
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

  // UseEffect để bắt đầu video và nhận diện khuôn mặt khi modal mở
  useEffect(() => {
    if (modelsLoaded && visible) {
      startVideo();
      requestAnimationFrame(handleFaceDetection); // Bắt đầu nhận diện khuôn mặt ngay khi modal mở
    }
  }, [modelsLoaded, visible, handleFaceDetection]);

  return (
    <div className={`modal ${visible ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Cập nhật FaceID</h3>
        <video ref={videoRef} width="720" height="560" autoPlay muted />
        {isCounting && <p className="mt-4">Đếm ngược: {countdown}</p>}
        <div className="modal-action">
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!capturedDescriptor}
          >
            Lưu
          </button>
          <button className="btn" onClick={() => setCapturedDescriptor([])}>
            Chụp lại
          </button>
          <button className="btn btn-outline" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateFaceIDModal;
