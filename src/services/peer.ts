class PeerService {
  public peer: RTCPeerConnection | null = null;

  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
  }

  async getAnswer(
    offer: RTCSessionDescriptionInit
  ): Promise<RTCSessionDescriptionInit | undefined> {
    if (this.peer) {
      await this.peer.setRemoteDescription(offer);
      const ans = await this.peer.createAnswer();
      await this.peer.setLocalDescription(new RTCSessionDescription(ans));
      return ans;
    }
  }

  async setLocalDescription(ans: RTCSessionDescriptionInit): Promise<void> {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    }
  }

  async getOffer(): Promise<RTCSessionDescriptionInit | undefined> {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  }
}

// Export a singleton instance
const peerServiceInstance = new PeerService();
export default peerServiceInstance;
