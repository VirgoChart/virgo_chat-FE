import VideoCall from "@/components/VideoCall";
import IncomingCall from "../chat/IncomingCall";

const CallPage = ({ params }: { params: { roomId: string } }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <IncomingCall />
      <VideoCall roomId={params.roomId} isCaller={true} callId="someCallId" />
    </div>
  );
};

export default CallPage;
