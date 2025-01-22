import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import axiosRequest from "@/config/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const FaceID: React.FC = () => {
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
        router.push("/");
      }

      window.localStorage.setItem("authUser", JSON.stringify(response));
      console.log(response);
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  useEffect(() => {
    if (modelsLoaded) {
      startVideo();
    }
  }, [modelsLoaded]);

  return (
    <div className="absolute top-50 left-50">
      <video
        ref={videoRef}
        width="720"
        height="560"
        autoPlay
        muted
        onPlay={handleFaceRecognition}
      />
      <p>{modelsLoaded ? "Models Loaded" : "Loading Models..."}</p>
    </div>
  );
};

export default FaceID;
