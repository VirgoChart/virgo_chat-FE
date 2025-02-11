import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axiosRequest from "@/config/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface FaceIDProps {
  onClose: () => void;
}

const FaceID = ({ onClose }: FaceIDProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(true);
  const router = useRouter();

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

  const handleFaceRecognition = async () => {
    if (videoRef.current && isRecognizing) {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length > 0) {
        const descriptors = detections.flatMap((detection) =>
          Array.from(detection.descriptor)
        );

        const isValid = await sendDescriptorsToBackend(descriptors);
        if (isValid) {
          setIsRecognizing(false);
          toast.success("Đăng nhập thành công");
        }
      }

      setTimeout(() => {
        requestAnimationFrame(handleFaceRecognition);
      }, 1500);
    }
  };

  const sendDescriptorsToBackend = async (descriptors: number[]) => {
    try {
      const response = await axiosRequest.post(
        "/auth/login/face-id",
        { faceId: descriptors },
        { withCredentials: true }
      );
      if (response) {
        setIsRecognizing(false);
        toast.success("Đăng nhập thành công!");
        stopVideo();
        router.push("/");
      }

      window.localStorage.setItem("authUser", JSON.stringify(response));
      console.log(response);
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (modelsLoaded) {
      startVideo();
    }
    stopVideo();
  }, [modelsLoaded]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity ${
        true ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-fit relative">
        <button className="absolute top-3 right-3" onClick={onClose}>
          <svg
            className="h-8 w-8 text-gray-600 hover:text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Nhận diện khuôn mặt
        </h2>

        <div className="flex flex-col items-center">
          <div className="border-4 border-gray-300 rounded-lg overflow-hidden w-[390px] h-[390px] bg-gray-100">
            <video
              ref={videoRef}
              width="720"
              height="560"
              autoPlay
              muted
              className="w-full h-full object-cover"
              onPlay={handleFaceRecognition}
            />
          </div>
          <p className="text-gray-500 mt-2 animate-pulse">
            {modelsLoaded ? "✅ Lấy dữ liệu thành công" : "⏳ Đang tải dữ liệu"}
          </p>
        </div>

        <div className="flex justify-end mt-6">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg transition hover:bg-gray-600"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaceID;
