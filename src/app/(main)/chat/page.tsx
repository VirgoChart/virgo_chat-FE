"use client";

import { useEffect, useState, useCallback, use, useRef } from "react";
import { Users } from "lucide-react";
import SidebarSkeleton from "@/components/skeletons/SidebarSkeleton";
import { getCookie } from "@/utils/cookies";
import axiosRequest from "@/config/axios";
import { toast } from "react-toastify";
import MessageInput from "@/app/(main)/message/MessageInput";
import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, Badge, Image } from "antd";
import {
  FaCamera,
  FaInfo,
  FaPhone,
  FaRegTrashCan,
  FaRegUser,
} from "react-icons/fa6";
import {
  IoIosInformationCircleOutline,
  IoMdNotificationsOutline,
} from "react-icons/io";
import IncomingCall from "./IncomingCall";
import { createCall, updateParticipantCall } from "@/services/callServices";
import { useRouter } from "next/navigation";
import { cn } from "@/config/utils";
import reactionOptions from "@/constants/reaction";
import { Pencil, Trash2 } from "lucide-react";
import UserDetailModal from "./UserDetailModal";

interface Message {
  reactions: any;
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
    image: string;
  };
}

const Sidebar = () => {
  const authUser = JSON.parse(window.localStorage.getItem("authUser") || "{}");
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomId, setRoomId] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [currrentUser, setCurrentUser] = useState<any>(authUser);
  const [anotherUser, setAnotherUser] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [blockedUsers, setBlockedUsers] = useState<any>([]);
  const jwt = getCookie("jwt");
  const [incomingCall, setIncomingCall] = useState<any>(null);
  const [isUserDetailModalOpen, setIsUserDetailModalOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const reactionMenuRef = useRef(null);
  const [reactionMenuId, setReactionMenuId] = useState<string | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        reactionMenuRef.current &&
        !reactionMenuRef.current.contains(event.target as Node)
      ) {
        setReactionMenuId(null);
      }
    };

    if (reactionMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [reactionMenuId]);

  let isCaller = incomingCall?.caller._id === currrentUser._id;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const { socket, connectSocket } = useAuthStore();

  useEffect(() => {
    if (socket === null) {
      connectSocket();
    }
  }, [socket, connectSocket]);

  const getRoomById = async (roomId: string, user: any) => {
    setSelectedUser(user);
    try {
      const response = await axiosRequest.get(`/rooms/${roomId}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        withCredentials: true,
      });

      const room = response?.room;
      console.log(room?.members[1]);
      const messages = response?.messages;

      setRoomId(room?._id || "");
      setMessages(messages || []);
      setBlockedUsers(room?.blockedMembers || []);
      setSelectedRoom(room || null);

      const currentUserId = authUser?._id;

      const anotherUser = room?.members.find(
        (member: any) => member?.user?._id !== currentUserId
      );
      setAnotherUser(anotherUser);
    } catch (error: any) {
      toast.error("Lỗi lấy dữ liệu phòng");
    }
  };

  console.log("anotherUser: ", anotherUser);

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

      socket.on("updatedCall", (updatedCall) => {
        console.log("📞 Nhận sự kiện updatedCall:", updatedCall);

        isCaller = updatedCall?.caller._id === currrentUser._id;

        if (!updatedCall) {
          console.error("❌ Không nhận được dữ liệu updatedCall");
          return;
        }

        if (updatedCall.status === "calling") {
          toast.success("📞 Cuộc gọi được kết nối, chuyển trang...");
          router.push(
            `/call?callId=${updatedCall._id}&userId=${updatedCall.caller._id}${updatedCall.room ? `&roomId=${updatedCall.room._id}` : ""}&isCaller=${isCaller}`
          );
          setIncomingCall(null);
        }
      });

      socket.on("newCall", (call: any) => {
        console.log("📞 Cuộc gọi đến:", call);

        setIncomingCall(call);
      });

      socket.on("reactionMessage", (updatedMessage: any) => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === updatedMessage._id
              ? { ...msg, reactions: updatedMessage.reactions }
              : msg
          )
        );
      });
    }

    return () => {
      if (socket) {
        socket.off("newMessage");
        socket.off("updatedMessage");
        socket.off("deletedMessage");
        socket.off("newCall");
        socket.off("updatedCall");
        socket.off("reactionMessage");
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
            "/messages",
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
            "/messages",
            { roomId, image: fileBase64 },
            {
              headers: { Authorization: `Bearer ${jwt}` },
              withCredentials: true,
            }
          )
        );
      }
      await Promise.all(requests);
      getRoomById(roomId, selectedUser);
    } catch (err: any) {
      toast.error(err);
    }
  };

  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string>("");

  const handleUpdate = async (messageId: string) => {
    try {
      await axiosRequest.put(
        `/messages/${messageId}`,
        { text: editedText },
        {
          headers: { Authorization: `Bearer ${jwt}` },
          withCredentials: true,
        }
      );

      setEditingMessageId(null);
      setEditedText("");
      getRoomById(roomId, selectedUser);
    } catch (error) {
      console.error("Lỗi khi cập nhật tin nhắn", error);
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      const res = await axiosRequest.delete(`/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
        withCredentials: true,
      });
      console.log(res);
      toast.success("Đã xóa tin nhắn");
      getRoomById(roomId, selectedUser);
    } catch (error) {
      console.error("Lỗi khi xóa tin nhắn", error);
    }
  };

  if (isLoading) return <SidebarSkeleton />;

  const renderMessage = (message: Message) => {
    return (
      <div className="relative">
        {message.text ? (
          <p>{message.text}</p>
        ) : message.image ? (
          <Image
            src={message.image}
            alt="Image message"
            className="object-contain w-full rounded-lg"
            width={200}
            height={200}
          />
        ) : (
          <p>Lỗi hiển thị tin nhắn</p>
        )}

        {message.reactions?.length > 0 && (
          <div className="flex items-center gap-1 mt-1">
            {message.reactions.map((reaction: any, index: number) => {
              const reactionData = reactionOptions.find(
                (r) => r.type === reaction.reactionType
              );
              return reactionData ? (
                <div key={index}>{reactionData.icon}</div>
              ) : null;
            })}
          </div>
        )}
      </div>
    );
  };

  const acceptCall = async () => {
    if (!socket.id) {
      console.error("❌ Socket chưa kết nối");
      return;
    }

    const res = await updateParticipantCall(
      incomingCall._id,
      "connection",
      jwt
    );

    console.log("📩 Phản hồi từ API:", res);
  };

  const rejectCall = async () => {
    try {
      setIncomingCall(null);
      await updateParticipantCall(incomingCall._id, "missed", jwt);
      socket.on("updatedCall", () => toast.error("Cuộc gọi đã kết thúc"));
    } catch (error) {
      console.error("❌ Lỗi từ chối cuộc gọi:", error);
    } finally {
      setIncomingCall(null);
    }
  };

  const cancelCall = async () => {
    try {
      setIncomingCall(null);
      await updateParticipantCall(incomingCall._id, "missed", jwt);
      socket.on("updatedCall", () => toast.error("Cuộc gọi kết thúc"));
    } catch (error) {
      console.error("❌ Lỗi từ chối cuộc gọi:", error);
    } finally {
      setIncomingCall(null);
    }
  };

  const handleStartCall = async () => {
    try {
      const res = await createCall(roomId, jwt);
      toast.success("📞Đang gọi...");
    } catch (error) {
      toast.error("Lỗi khi tạo cuộc gọi", error);
    }
  };

  const handleReaction = async (messageId: string, reactionType: string) => {
    try {
      const res = await axiosRequest.put(
        `messages/${messageId}/reaction`,
        { reactionType },
        {
          headers: { Authorization: `Bearer ${jwt}` },
          withCredentials: true,
        }
      );
      console.log(res);
    } catch (error) {
      console.error("Lỗi khi thêm reaction", error);
    } finally {
      setReactionMenuId(null);
    }
  };

  const handleDeleteAllMessage = async () => {
    try {
      const res = await axiosRequest.delete(`messages/all`, {
        headers: { Authorization: `Bearer ${jwt}` },
        withCredentials: true,
      });
      console.log(res);
    } catch (error) {
      console.error("Lỗi xóa tin nhắn", error);
    } finally {
      setReactionMenuId(null);
    }
  };

  return (
    <div className="flex h-full p-10">
      <aside className="h-[550px] overflow-y-auto w-20 lg:w-72 border border-gray-300 flex flex-col transition-all duration-200 mt-10 rounded-l-xl">
        <div className="border-b border-gray-300 w-full py-4 px-5 lg:block hidden">
          <div className="items-center gap-2 justify-between lg:flex hidden">
            <div className="flex items-center gap-2 rounded-lg p-2">
              <Users className="size-6" />
              <span className="font-medium hidden lg:block">
                Danh sách bạn bè
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto w-full py-0 border-b border-b-dark-400">
          {rooms?.map((room: Room) => {
            const admin = room.members.find(
              (user: any) => user?.user?._id !== currrentUser?._id
            );

            return (
              <button
                key={room._id}
                onClick={() => getRoomById(room._id, admin)}
                className={`w-full p-3 flex items-center gap-3 transition-colors ${
                  selectedRoom?._id === room._id ? "bg-[#D7BFF4]" : ""
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
                    {admin?.user?.avatar ? (
                      <Avatar
                        src={admin?.user?.avatar}
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
                    {admin?.user?.fullName}
                  </div>
                  <div className="text-gray-400 text-sm text-zinc-400 truncate">
                    {room?.lastMessage?.image
                      ? room?.lastMessage?.sender?._id === currrentUser?._id
                        ? "Bạn đã gửi một ảnh"
                        : `${room?.lastMessage?.sender?.fullName} đã gửi một ảnh`
                      : room?.lastMessage?.text || "Chưa có tin nhắn"}
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
            <div className="h-auto w-full border-b border-gray-200 py-1 px-6 flex justify-between items-center bg-white shadow-sm">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                <Avatar
                  src={selectedUser?.user?.avatar}
                  icon={<FaRegUser />}
                  size={48}
                  className="border border-gray-300"
                />
                <h1 className="text-lg lg:text-xl font-semibold text-gray-800">
                  {selectedUser?.user?.fullName}
                </h1>
              </div>

              {/* Các nút hành động */}
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full hover:bg-blue-100 transition cursor-pointer">
                  <FaPhone size={22} className="text-blue-500" />
                </div>
                <div
                  onClick={handleStartCall}
                  className="p-2 rounded-full hover:bg-blue-100 transition cursor-pointer"
                >
                  <FaCamera size={22} className="text-blue-500" />
                </div>
                <div
                  onClick={() => setIsUserDetailModalOpen(true)}
                  className="p-2 rounded-full hover:bg-blue-100 transition cursor-pointer"
                >
                  <FaInfo size={22} className="text-blue-500" />
                </div>
              </div>
            </div>

            {/* Vùng tin nhắn */}
            <div className="overflow-y-auto p-4 space-y-3 h-[400px]">
              {messages.map((message) => {
                const isCurrentUser =
                  message.sender.fullName === currrentUser.fullName;
                const isEditing = editingMessageId === message._id;

                const isImage = message.image !== undefined;

                return (
                  <div
                    key={message._id}
                    className={cn(
                      "relative w-fit p-3 border rounded-xl shadow-sm group transition",
                      isCurrentUser
                        ? isImage
                          ? "ml-auto text-right bg-white"
                          : "ml-auto text-right bg-[#DBB3DB]"
                        : "mr-auto text-left bg-gray-100"
                    )}
                    style={{ maxWidth: "70%" }}
                  >
                    {/* Header người gửi + thời gian */}
                    <div className="flex flex-col items-start gap-0.5">
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          isCurrentUser ? "text-blue-600" : "text-gray-700"
                        )}
                      >
                        {message.sender.fullName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {/* Icon Reaction (góc trên phải) */}
                    <div className="absolute top-2 right-2 hidden group-hover:flex">
                      <button
                        onClick={() => setReactionMenuId(message._id)}
                        className="bg-gray-200 hover:bg-gray-300 p-1 rounded-full shadow transition"
                      >
                        😊
                      </button>
                    </div>

                    {/* Menu Emoji Reaction */}
                    {reactionMenuId === message._id && (
                      <div
                        ref={reactionMenuRef}
                        className="absolute top-0 right-10 flex gap-1 bg-white p-2 rounded-lg shadow-lg border z-10"
                      >
                        {reactionOptions.map((reaction) => (
                          <button
                            key={reaction.type}
                            onClick={() => {
                              handleReaction(message._id, reaction.type);
                              setReactionMenuId(null);
                            }}
                            className="text-xl hover:scale-110 transition"
                          >
                            {reaction.icon}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Nội dung hoặc ảnh */}
                    <div
                      className={cn(
                        "mt-2 text-gray-700",
                        isImage ? "flex justify-center" : ""
                      )}
                    >
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedText}
                          onChange={(e) => setEditedText(e.target.value)}
                          className="border border-gray-300 bg-white rounded px-2 py-1 w-full"
                        />
                      ) : (
                        renderMessage(message)
                      )}
                    </div>

                    {/* Reaction đã chọn */}
                    {message.reaction && (
                      <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
                        {
                          reactionOptions.find(
                            (r) => r.type === message.reaction
                          )?.icon
                        }
                        <span>{message.reaction}</span>
                      </div>
                    )}

                    {/* Nút Sửa / Xóa */}
                    {isCurrentUser && (
                      <div className="absolute top-16 left-2 hidden group-hover:flex items-center gap-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleUpdate(message._id)}
                              className="text-green-600 hover:text-green-800 transition"
                            >
                              Lưu
                            </button>
                            <button
                              onClick={() => setEditingMessageId(null)}
                              className="text-red-500 hover:text-red-700 transition"
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
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(message._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={18} />
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
            {/* Vùng nhập tin nhắn */}
            {blockedUsers.map((user: any) => {
              if (user._id !== selectedUser.user._id) {
                return (
                  <div key={user._id} className="p-2 bg-white border-t">
                    <p className="text-red-500 text-center">
                      Bạn đã bị chặn tin nhắn trong nhóm này
                    </p>
                  </div>
                );
              } else {
                return (
                  <div key={user._id} className="p-2 bg-white border-t">
                    <p className="text-red-500 text-center">
                      Bạn đã chặn người này
                    </p>
                  </div>
                );
              }
            })}
            {(() => {
              const isBlocked = blockedUsers.some(
                (user: any) => user._id === selectedUser.user._id
              );
              if (!isBlocked) {
                return (
                  <div className="p-2 bg-white border-t">
                    <MessageInput roomId={roomId} sendMessage={sendMessage} />
                  </div>
                );
              }
              return null;
            })()}
          </div>

          <div className="h-[550px] mt-10 w-96 border border-gray-300 rounded-r-xl overflow-hidden shadow-sm flex flex-col bg-white">
            {/* Top: Avatar + Action Circles */}
            <div className="p-5 flex flex-col items-center border-b border-gray-200 gap-3 bg-gradient-to-b from-gray-100 to-white">
              <Avatar
                src={selectedUser?.user?.avatar}
                size={72}
                className="border-2 border-violet-200 shadow-sm"
              />
              <div className="flex gap-3">
                <div className="w-11 h-11 rounded-full bg-green-500 flex items-center justify-center text-white hover:scale-105 transition cursor-pointer shadow-md">
                  <IoMdNotificationsOutline size={22} />
                </div>
                <div
                  onClick={handleDeleteAllMessage}
                  className="w-11 h-11 rounded-full bg-red-400 flex items-center justify-center text-white hover:scale-105 transition cursor-pointer shadow-md"
                >
                  <FaRegTrashCan size={20} />
                </div>
                <div
                  onClick={() => setIsUserDetailModalOpen(true)}
                  className="w-11 h-11 rounded-full bg-blue-400 flex items-center justify-center text-white hover:scale-105 transition cursor-pointer shadow-md"
                >
                  <IoIosInformationCircleOutline size={22} />
                </div>
              </div>
            </div>

            {/* Middle: 2 Equal Boxes */}

            {/* Bottom: Ảnh Chat */}
            <div className="flex-1 bg-gray-50 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-3">
                {messages.map((message, index) =>
                  message.image ? (
                    <Image
                      key={index}
                      src={message.image}
                      alt={`Room Image ${index + 1}`}
                      className="w-full h-36 object-cover rounded-lg shadow-sm hover:scale-105 transition border-2 border-gray-200"
                      width={110}
                      height={110}
                    />
                  ) : null
                )}
              </div>
              {messages.filter((m) => m.image).length === 0 && (
                <div className="text-center text-gray-400 mt-4">
                  Chưa có ảnh nào được gửi
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-4/5 ml-4 h-full rounded-lg p-10 flex items-center justify-center bg-[#AA8BE2] text-white text-center px-6 mt-20">
          <div className="max-w-md">
            <Image
              src="/images/logoVirgo.png"
              alt="Logo"
              className="mx-auto mb-6"
              width={124}
              height={124}
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

      {incomingCall && (
        <IncomingCall
          call={incomingCall}
          onAccept={acceptCall}
          onReject={cancelCall}
          isCaller={isCaller}
          onCancel={rejectCall}
        />
      )}

      <UserDetailModal
        open={isUserDetailModalOpen}
        onClose={() => setIsUserDetailModalOpen(false)}
        user={anotherUser?.user}
        joinedAt={anotherUser?.joinedAt}
        role={anotherUser?.role}
      />
    </div>
  );
};

export default Sidebar;
