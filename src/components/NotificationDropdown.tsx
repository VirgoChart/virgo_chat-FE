import React, { useEffect, useState } from "react";
import { Badge, Dropdown, List, Spin, Button, Avatar } from "antd";
import { BellOutlined } from "@ant-design/icons";
import Image from "next/image";
import axiosRequest from "@/config/axios";
import { getCookie } from "@/utils/cookies";
import { toast } from "react-toastify";

interface NotificationDropdownProps {
  socket: any;
}

const NotificationDropdown = ({ socket }: NotificationDropdownProps) => {
  interface Notification {
    _id: string;
    content: string;
    createdAt: string;
    sender: {
      avatar: string;
    };
    receivers: {
      isSeen: boolean;
      status?: string;
    }[];
  }

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unseenCount, setUnseenCount] = useState(0);
  const jwt = getCookie("jwt");

  useEffect(() => {
    fetchNotifications();

    if (socket) {
      socket.on("newNotification", (notification: any) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnseenCount((prev) => prev + 1);
      });
    }

    return () => {
      if (socket) {
        socket.off("newNotification");
      }
    };
  }, [socket]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await axiosRequest.get("/notifications", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        withCredentials: true,
      });

      setNotifications(data.notifications);
      setUnseenCount(
        data.notifications.filter((n: any) => !n.receivers[0].isSeen).length
      );
    } catch (err: any) {
      console.error("Lỗi khi lấy thông báo:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsSeen = async () => {
    try {
      const unseenIds = notifications
        .filter((n) => !n.receivers[0].isSeen)
        .map((n) => n._id);

      if (unseenIds.length > 0) {
        await axiosRequest.put(
          "notifications/seen",
          {
            notificationIds: unseenIds,
          },
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
            withCredentials: true,
          }
        );

        setNotifications((prev) =>
          prev.map((n) => ({
            ...n,
            receivers: [{ ...n.receivers[0], isSeen: true }],
          }))
        );
        setUnseenCount(0);
      }
    } catch (err: any) {
      console.error("Lỗi cập nhật trạng thái đã xem:", err);
    }
  };

  const handleUpdateStatus = async (notificationId: string, status: string) => {
    try {
      await axiosRequest.put(
        `/notifications/${notificationId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
          withCredentials: true,
        }
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId
            ? { ...n, receivers: [{ ...n.receivers[0], status }] }
            : n
        )
      );

      toast.success("Cập nhật trạng thái thông báo thành công");
    } catch (err: any) {
      console.error("Lỗi cập nhật trạng thái thông báo:", err);
    }
  };

  const notificationMenu = (
    <div className="w-96 mt-4 bg-white shadow-lg rounded-lg py-3 px-4 border border-gray-200">
      {loading ? (
        <div className="flex justify-center items-center h-24">
          <Spin />
        </div>
      ) : (
        <List
          dataSource={notifications}
          className="overflow-auto max-h-96"
          renderItem={(item) => (
            <List.Item className="p-3 border-b border-gray-100 hover:bg-gray-100 transition flex items-center">
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={item.sender.avatar}
                    alt="avatar"
                    className="w-10 h-10 border border-gray-500 rounded-full object-cover"
                  />
                }
                title={
                  <span className="text-gray-800 font-medium text-sm">
                    {item.content}
                  </span>
                }
                description={
                  <span className="text-gray-500 text-xs">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                }
              />
              <div className="flex gap-2">
                <Button
                  type="primary"
                  size="small"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded transition"
                  onClick={() => handleUpdateStatus(item._id, "accepted")}
                  disabled={item.receivers[0].status === "accepted"}
                >
                  Chấp nhận
                </Button>
                <Button
                  type="default"
                  size="small"
                  danger
                  className="bg-red-600 hover:bg-red-700 text-black text-xs px-2 py-1 rounded transition"
                  onClick={() => handleUpdateStatus(item._id, "rejected")}
                  disabled={item.receivers[0].status === "rejected"}
                >
                  Từ chối
                </Button>
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <Dropdown overlay={notificationMenu} trigger={["click"]}>
      <Badge count={unseenCount} overflowCount={99}>
        <BellOutlined
          style={{ fontSize: "24px", cursor: "pointer" }}
          onClick={markAllAsSeen}
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationDropdown;
