import React, { useEffect, useState } from "react";
import { Badge, Dropdown, List, Spin, Button } from "antd";
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
          "notifications/update/seen",
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
        `/notifications/update/status/${notificationId}`,
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
    <div
      style={{ width: 300 }}
      className="bg-red-100 mt-4 rounded-lg py-2 px-4"
    >
      {loading ? (
        <Spin style={{ width: "100%", textAlign: "center" }} />
      ) : (
        <List
          dataSource={notifications}
          className="overflow-auto h-96"
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Image
                    src={item.sender.avatar}
                    alt="avatar"
                    style={{ width: 40, borderRadius: "50%" }}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                }
                title={item.content}
                description={new Date(item.createdAt).toLocaleString()}
                className="p-4 border border-white-600"
              />
              <div className="flex gap-2">
                <Button
                  type="primary"
                  size="small"
                  onClick={() => handleUpdateStatus(item._id, "accepted")}
                  disabled={item.receivers[0].status === "accepted"}
                >
                  Chấp nhận
                </Button>
                <Button
                  type="default"
                  size="small"
                  danger
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
