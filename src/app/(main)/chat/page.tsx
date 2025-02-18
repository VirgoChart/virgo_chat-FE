"use client";

import { useEffect, useState, useCallback, use, useRef } from "react";
import { CircleUser, Users } from "lucide-react";
import SidebarSkeleton from "@/components/skeletons/SidebarSkeleton";
import { getCookie } from "@/utils/cookies";
import axiosRequest from "@/config/axios";
import { toast } from "react-toastify";
import MessageInput from "@/app/(main)/message/MessageInput";
import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, Badge, Image } from "antd";
import { FaCamera, FaInfo, FaPhone, FaRegUser } from "react-icons/fa6";

interface Message {
  file: any;
  _id: string;
  image: string;
  sender: {
    fullName: string;
  };
  createdAt: string;
  messageType: string;
  text: string;
}

interface Room {
  members: any;
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
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Khi messages thay đổi, cuộn xuống tin nhắn mới nhất
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const { socket, connectSocket } = useAuthStore();

  useEffect(() => {
    if (socket === null) {
      connectSocket();
    }
  }, []);

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
      if (response.room) setSelectedRoom(response.room);
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

      socket.on("updatedMessage", (updatedMessage: any) => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === updatedMessage._id ? updatedMessage : msg
          )
        );
      });

      socket.on("deletedMessage", ({ messageId }: { messageId: string }) => {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== messageId)
        );
      });
    }

    return () => {
      if (socket) {
        socket.off("newMessage");
        socket.off("updatedMessage");
        socket.off("deletedMessage");
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
      console.log(response.rooms);
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
      const requests = [];

      if (text) {
        requests.push(
          axiosRequest.post(
            "/messages/create",
            { roomId, text },
            {
              headers: { Authorization: `Bearer ${jwt}` },
              withCredentials: true,
            }
          )
        );
      }

      if (fileBase64) {
        requests.push(
          axiosRequest.post(
            "/messages/create",
            { roomId, image: fileBase64 },
            {
              headers: { Authorization: `Bearer ${jwt}` },
              withCredentials: true,
            }
          )
        );
      }

      await Promise.all(requests);
      getRoomById(roomId);
    } catch (err: any) {
      toast.error(err);
    }
  };

  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string>("");

  const handleUpdate = async (messageId: string) => {
    try {
      await axiosRequest.put(
        `/messages/update/${messageId}`,
        { text: editedText },
        {
          headers: { Authorization: `Bearer ${jwt}` },
          withCredentials: true,
        }
      );

      setEditingMessageId(null);
      setEditedText("");
      getRoomById(roomId);
    } catch (error) {
      console.error("Lỗi khi cập nhật tin nhắn", error);
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      const res = await axiosRequest.delete(`/messages/delete/${messageId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
        withCredentials: true,
      });
      console.log(res);
      toast.success("Đã xóa tin nhắn");
      getRoomById(roomId);
    } catch (error) {
      console.error("Lỗi khi xóa tin nhắn", error);
    }
  };

  if (isLoading) return <SidebarSkeleton />;

  const renderMessage = (message: Message) => {
    if (message.text) {
      return <p>{message.text}</p>;
    } else if (message.image) {
      return (
        <Image
          src={message.image}
          alt="Image message"
          className="object-contain"
          width={200}
          height={200}
        />
      );
    }

    return <p>Lỗi hiển thị tin nhắn</p>;
  };

  return (
    <div className="flex h-full p-10">
      <aside className="h-[550px] overflow-y-auto w-20 lg:w-72 border border-gray-300 flex flex-col transition-all duration-200 mt-10">
        <div className="border-b border-base-300 w-full p-5">
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-2 cursor-pointer">
              <Users className="size-6" />
              <span className="font-medium hidden lg:block">Bạn bè</span>
            </div>
            <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-2 cursor-pointer">
              <Users className="size-6" />
              <span className="font-medium hidden lg:block">Nhóm</span>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto w-full py-3">
          {rooms?.map((room: Room) => {
            const admin = room.members.find(
              (user: any) => user.user._id !== currrentUser._id
            );

            return (
              <button
                key={room._id}
                onClick={() => getRoomById(room._id)}
                className={`w-full p-3 flex items-center gap-3 transition-colors ${
                  selectedRoom?._id === room._id
                    ? "bg-[#AA8BE2] rounded-lg"
                    : ""
                }`}
              >
                <div className="relative mx-auto lg:mx-0">
                  <Badge
                    style={{
                      fontSize: "12px",
                      width: "10px",
                      height: "10px",
                      minWidth: "10px",
                    }}
                    dot
                    color="green"
                    offset={[-5, 40]}
                  >
                    {admin?.user.avatar ? (
                      <Avatar
                        src={admin.user.avatar}
                        // icon={<FaRegUser />}
                        size={48}
                        className="border border-gray-400 m-0"
                      />
                    ) : (
                      <Avatar
                        src={""}
                        icon={<FaRegUser />}
                        size={48}
                        className="border border-gray-400 m-0"
                      />
                    )}
                  </Badge>
                </div>

                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-medium truncate">
                    {admin?.user.fullName}
                  </div>
                  <div className="text-gray-400 text-sm text-zinc-400 truncate">
                    {room?.lastMessage?.text || "Chưa có tin nhắn"}
                  </div>
                </div>
              </button>
            );
          })}

          {rooms?.length === 0 && (
            <div className="text-center text-zinc-500 py-4">
              Không có phòng nào
            </div>
          )}
        </div>
      </aside>

      {roomId ? (
        <div className="flex flex-1 items-center">
          <div className="flex flex-col h-[550px] w-full mt-10 border">
            {/* Vung detail user*/}

            <div className="h-auto w-full border-b-2 py-2 px-6 flex justify-between">
              <div className="flex items-center w-fit p-2 gap-2 rounded-lg cursor-pointer hover:bg-gray-200">
                <Avatar src={""} icon={<FaRegUser />} size={48} />
                <h1>Kien PT</h1>
              </div>
              <div className="flex gap-5 items-center">
                <FaPhone
                  size={26}
                  className="text-blue-400 hover:bg-dark-200 rounded-lg"
                />
                <FaCamera
                  size={26}
                  className="text-blue-400 hover:bg-dark-200 rounded-lg"
                />
                <FaInfo
                  size={26}
                  className="text-blue-400 hover:bg-dark-200 rounded-lg"
                />
              </div>
            </div>

            {/* Vùng tin nhắn */}
            <div className="overflow-y-auto p-4 space-y-3 h-[400px]">
              {messages.map((message) => {
                const isCurrentUser =
                  message.sender.fullName === currrentUser.fullName;
                const isEditing = editingMessageId === message._id;

                return (
                  <div
                    key={message._id}
                    className={`relative w-fit p-3 border rounded-md shadow-sm bg-white hover:bg-gray-50 group ${
                      isCurrentUser
                        ? "ml-auto text-right bg-blue-200"
                        : "mr-auto text-left bg-gray-100"
                    }`}
                    style={{ maxWidth: "70%" }}
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
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedText}
                          onChange={(e) => setEditedText(e.target.value)}
                          className="border border-gray-300 rounded p-1 w-full"
                        />
                      ) : (
                        renderMessage(message)
                      )}
                    </div>

                    {/* Hiển thị nút khi hover */}
                    {isCurrentUser && (
                      <div className="absolute top-6 right-full hidden group-hover:flex gap-2 p-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleUpdate(message._id)}
                              className="text-green-600 hover:underline"
                            >
                              Lưu
                            </button>
                            <button
                              onClick={() => setEditingMessageId(null)}
                              className="text-red-600 hover:underline"
                            >
                              Hủy
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingMessageId(message._id);
                                setEditedText(message.text);
                              }}
                              className="text-blue-600 hover:underline"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDelete(message._id)}
                              className="text-red-600 hover:underline"
                            >
                              Xóa
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={chatEndRef}></div>
            </div>

            <div className="p-2 bg-white border-t">
              <MessageInput roomId={roomId} sendMessage={sendMessage} />
            </div>
          </div>

          <div className="h-[550px] mt-10 border w-96 border-gray-300 flex flex-col">
            {/* Top section with circles */}
            <div className="p-4 flex flex-col items-center border-b border-gray-300">
              <div className="w-16 h-16 rounded-full bg-gray-300 mb-2"></div>
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
              </div>
            </div>

            {/* Middle section with two equal boxes */}
            <div className="flex border-b border-blue-500">
              <div className="w-1/2 h-20 bg-gray-300 border-r border-blue-500"></div>
              <div className="w-1/2 h-20 bg-gray-300"></div>
            </div>

            {/* Bottom section with one large box */}
            <div className="flex-1 bg-gray-300 overflow-y-auto max-h-[600px] p-2">
              <div className="grid grid-cols-2 gap-2">
                {messages.map((message, index) =>
                  message.image ? (
                    <Image
                      key={index}
                      src={message.image}
                      alt={`Room Image ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                      width={110}
                      height={110}
                    />
                  ) : null
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full ml-4 h-full rounded-lg p-10 flex items-center justify-center bg-[#AA8BE2] text-white text-center px-6 mt-20">
          <div className="max-w-md">
            <Image
              src="/images/logoVirgo.png"
              alt="Logo"
              className="mx-auto mb-6"
              width={124}
              height={124}
              quality={100}
            />
            <h1 className="text-3xl font-bold mb-4">
              Chào mừng đến với VirgoChat
            </h1>
            <p className="text-lg mb-6">
              Kết nối với bạn bè và gia đình một cách dễ dàng và nhanh chóng.
            </p>
            <button
              onClick={() =>
                toast.success("Hãy tìm một người bạn và gửi yêu cầu nhắn tin")
              }
              className="bg-white text-blue-500 px-6 py-2 rounded-lg font-semibold shadow-md"
            >
              Bắt đầu ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
