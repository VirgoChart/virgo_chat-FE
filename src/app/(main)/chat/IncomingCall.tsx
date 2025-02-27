"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";

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
  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { socket } = useAuthStore();

  useEffect(() => {
    if (!call) return;

    const setupMedia = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setStream(localStream);
        if (myVideo.current) myVideo.current.srcObject = localStream;

        peerConnectionRef.current = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        localStream.getTracks().forEach((track) => {
          peerConnectionRef.current?.addTrack(track, localStream);
        });

        peerConnectionRef.current.ontrack = (event) => {
          if (userVideo.current) userVideo.current.srcObject = event.streams[0];
        };

        peerConnectionRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("sendCandidate", {
              candidate: event.candidate,
              callId: call.id,
            });
          }
        };

        socket.on("receiveCandidate", ({ candidate }) => {
          peerConnectionRef.current?.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        });
      } catch (error) {
        console.error("❌ Lỗi khi lấy camera:", error);
      }
    };

    setupMedia();

    return () => {
      peerConnectionRef.current?.close();
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [call]);

  const handleAcceptCall = async () => {
    if (socket && call) {
      socket.emit("callAccepted", { callId: call.id });

      const offer = await peerConnectionRef.current?.createOffer();
      await peerConnectionRef.current?.setLocalDescription(offer);
      socket.emit("sendOffer", { offer, callId: call.id });

      socket.on("receiveAnswer", async ({ answer }) => {
        await peerConnectionRef.current?.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      });
    }
    onAccept();
  };

  socket.on("receiveOffer", async ({ offer }) => {
    await peerConnectionRef.current?.setRemoteDescription(
      new RTCSessionDescription(offer)
    );

    const answer = await peerConnectionRef.current?.createAnswer();
    await peerConnectionRef.current?.setLocalDescription(answer);
    socket.emit("sendAnswer", { answer, callId: call.id });
  });

  if (!call) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        <h2 className="text-lg font-semibold">
          {isCaller ? "Đang gọi..." : "Cuộc gọi đến"}
        </h2>
        <div className="flex gap-4 mt-3">
          <video
            ref={myVideo}
            autoPlay
            playsInline
            muted
            className="w-32 h-32 rounded-lg bg-black"
          />
        </div>
        <div className="flex gap-4 mt-4">
          {isCaller ? (
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              onClick={onCancel}
            >
              Hủy cuộc gọi
            </button>
          ) : (
            <>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                onClick={handleAcceptCall}
              >
                Trả lời
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                onClick={onReject}
              >
                Từ chối
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncomingCall;
