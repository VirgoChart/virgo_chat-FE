import { useEffect, useState, useCallback, use } from "react";
import { Users } from "lucide-react";
import Image from "next/image";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { getCookie } from "@/utils/cookies";
import axiosRequest from "@/config/axios";
import { toast } from "react-toastify";
import MessageInput from "@/app/(main)/message/MessageInput";
import { useAuthStore } from "@/store/useAuthStore";

interface SidebarProps {
  socket: any;
}

interface Message {
  file: any;
  _id: string;
  sender: {
    fullName: string;
  };
  createdAt: string;
  messageType: string;
  text: string;
}

interface Room {
  _id: string;
  name: string;
  lastMessage?: {
    sender: {
      profilePic: string;
    };
    text: string;
  };
}

const Sidebar = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomId, setRoomId] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [currrentUser, setCurrentUser] = useState<any>(null);
  const jwt = getCookie("jwt");

  const { socket, connectSocket } = useAuthStore();

  useEffect(() => {
    if (socket === null) {
      connectSocket();
    }
  }, []);

  console.log(roomId);

  const getRoomById = async (roomId: string) => {
    try {
      const response = await axiosRequest.get(`/rooms/${roomId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        withCredentials: true,
      });
      setRoomId(response.room._id);
      setMessages(response.messages);
      setSelectedRoom(response.room);
    } catch (error: any) {
      toast.error(error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(window.localStorage.getItem("authUser") || "{}");
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (newMessage: any) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    }

    return () => {
      if (socket) {
        socket.off("newMessage");
      }
    };
  }, [socket]);

  const getRooms = useCallback(async () => {
    try {
      const response = await axiosRequest.get(`/rooms`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        withCredentials: true,
      });
      setRooms(response.rooms);
    } catch (error: any) {
      toast.error(error.message || "An error occurred while fetching rooms.");
    } finally {
      setIsLoading(false);
    }
  }, [jwt]);

  useEffect(() => {
    getRooms();
  }, [getRooms]);

  const sendMessage = async (
    roomId: string,
    text: string,
    fileBase64: string | null
  ) => {
    if (!text && !fileBase64) {
      toast.error("Vui lòng nhập tin nhắn hoặc chọn file");
      return;
    }

    try {
      const response = await axiosRequest.post(
        "/messages/create",
        {
          roomId: roomId,
          text,
          file: fileBase64,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );

      toast.success(response.message);

      getRoomById(roomId);
    } catch (err: any) {
      toast.error(err);
    }
  };

  if (isLoading) return <SidebarSkeleton />;

  return (
    <div className="flex h-4/5 gap-10 p-10">
      <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 mt-20">
        <div className="border-b border-base-300 w-full p-5">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium hidden lg:block">Danh sách phòng</span>
          </div>
        </div>

        <div className="overflow-y-auto w-full py-3">
          {rooms?.map((room: Room) => (
            <button
              key={room._id}
              onClick={() => getRoomById(room._id)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                selectedRoom?._id === room._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }`}
            >
              <div className="relative mx-auto lg:mx-0">
                <Image
                  src={room?.lastMessage?.sender.profilePic || "/avatar.png"}
                  alt={room?.name}
                  className="size-12 object-cover rounded-full"
                  width={20}
                  height={20}
                />
              </div>

              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{room?.name}</div>
                <div className="text-sm text-zinc-400 truncate">
                  {room?.lastMessage?.text || "Chưa có tin nhắn"}
                </div>
              </div>
            </button>
          ))}

          {rooms?.length === 0 && (
            <div className="text-center text-zinc-500 py-4">
              Không có phòng nào
            </div>
          )}
        </div>
      </aside>

      {messages.length !== 0 ? (
        <div className={"flex h-96 w-full flex-col mt-10"}>
          <div className="flex-1 overflow-y-scroll h-96 p-4 space-y-3">
            {messages.map((message) => {
              const isCurrentUser =
                message.sender.fullName === currrentUser.fullName;

              return (
                <div
                  key={message._id}
                  className={`w-fit p-3 border rounded-md shadow-sm bg-white hover:bg-gray-50 ${
                    isCurrentUser
                      ? "ml-auto text-right bg-blue-200"
                      : "mr-auto text-left bg-gray-100"
                  }`}
                  style={{
                    maxWidth: "70%",
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`font-semibold ${isCurrentUser ? "text-blue-500" : "text-gray-700"}`}
                    >
                      {message.sender.fullName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 text-gray-700">
                    {message.messageType === "text" ? (
                      <p>{message.text}</p>
                    ) : message.messageType === "file" ? (
                      <a
                        href={message.file.fileUrl}
                        download
                        className="text-blue-500 underline"
                      >
                        Tải về tệp
                      </a>
                    ) : message.messageType === "image" ? (
                      <div className="w-full max-w-sm mx-auto">
                        <Image
                          src={message.file.fileUrl}
                          alt="Image message"
                          className="object-contain"
                          width={500}
                          height={500}
                        />
                      </div>
                    ) : (
                      <p>[Unsupported message type]</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <MessageInput roomId={roomId} sendMessage={sendMessage} />
        </div>
      ) : (
        <div className="mt-40">
          <div>Chọn phòng để bắt đầu nhắn tin</div>
          <MessageInput roomId={roomId} sendMessage={sendMessage} />
        </div>
      )}
    </div>
  );
};

export default Sidebar;