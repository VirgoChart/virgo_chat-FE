"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

interface IncomingCallProps {
  call: any;
  onAccept: () => void;
  onReject: () => void;
  isCaller: boolean;
  onCancel: () => void;
}

const IncomingCall: React.FC<IncomingCallProps> = ({
  call,
  onAccept,
  onReject,
  onCancel,
  isCaller,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    if (!call) return;

    const startVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Gửi stream video qua WebRTC (giả định có server signaling)
        peerConnectionRef.current = new RTCPeerConnection();
        stream
          .getTracks()
          .forEach((track) =>
            peerConnectionRef.current?.addTrack(track, stream)
          );
      } catch (error) {
        console.error("❌ Lỗi khi mở camera:", error);
      }
    };

    if (isCaller) {
      startVideoStream();
    }

    return () => {
      peerConnectionRef.current?.close();
    };
  }, [call, isCaller]);

  if (!call) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        {isCaller ? (
          <>
            <h2 className="text-lg font-semibold">Đang gọi...</h2>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-32 h-32 rounded-lg mt-3 bg-black"
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition mt-4"
              onClick={() => {
                onCancel();
                (videoRef.current?.srcObject as MediaStream)
                  ?.getTracks()
                  .forEach((track) => {
                    track.stop();
                  });
                call = null;
              }}
            >
              Hủy cuộc gọi
            </button>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold">Cuộc gọi đến</h2>
            <Image
              src={call.caller?.avatar || "/default-avatar.png"}
              alt={call.caller?.fullName}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full"
            />
            <p className="text-lg font-medium">{call.caller?.fullName}</p>
            <div className="flex gap-4 mt-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                onClick={onAccept}
              >
                Trả lời
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                onClick={onReject}
              >
                Từ chối
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default IncomingCall;
