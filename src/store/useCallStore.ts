import { create } from "zustand";
import Peer from "simple-peer";

interface CallState {
  peerConnection: Peer.Instance | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  setPeerConnection: (peer: Peer.Instance | null) => void;
  setStream: (stream: MediaStream | null) => void;
  setRemoteStream: (stream: MediaStream | null) => void;
  resetCall: () => void;
}

export const useCallStore = create<CallState>((set) => ({
  peerConnection: null,
  localStream: null,
  remoteStream: null,

  setPeerConnection: (peer) => set({ peerConnection: peer }),
  setStream: (stream) => set({ localStream: stream }),
  setRemoteStream: (stream) => set({ remoteStream: stream }),

  resetCall: () =>
    set({
      peerConnection: null,
      localStream: null,
      remoteStream: null,
    }),
}));
