"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "@/utils/cookies";

interface User {
  _id: string;
  fullName: string;
  userName: string;
  avatar?: string;
}

interface Room {
  _id: string;
  members: {
    user: {
      _id: string;
      fullName: string;
      avatar?: string;
    };
    role: string;
    joinedAt: string;
  }[];
  roomType: string;
  lastMessage: {
    text: string;
    sender: {
      _id: string;
      fullName: string;
    };
    createdAt: string;
  };
}

const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [userPage, setUserPage] = useState(1);
  const [roomPage, setRoomPage] = useState(1);
  const [totalUserPages, setTotalUserPages] = useState(1);
  const [totalRoomPages, setTotalRoomPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/users?page=${userPage}`,
          {
            headers: { Authorization: `Bearer ${getCookie("jwt")}` },
            withCredentials: true,
          }
        );
        setUsers(data.data);
        setTotalUserPages(data.meta.totalPages);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, [userPage]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/rooms?page=${roomPage}`,
          {
            headers: { Authorization: `Bearer ${getCookie("jwt")}` },
            withCredentials: true,
          }
        );

        console.log(data);
        setRooms(data.rooms);
        setTotalRoomPages(data.totalPages);
      } catch (err) {
        console.error("Failed to fetch rooms", err);
      }
    };
    fetchRooms();
  }, [roomPage]);

  return (
    <div className="p-60 space-y-8">
      {/* Users Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Users</h2>
        <div>Tổng số users: {users.length}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users?.map(({ _id, avatar, fullName, userName }) => (
            <div
              key={_id}
              className="flex items-center p-4 border rounded-lg shadow-sm"
            >
              <img
                src={avatar || "/default-avatar.png"}
                alt={fullName}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <div className="font-semibold">{fullName}</div>
                <div className="text-gray-500">@{userName}</div>
              </div>
            </div>
          ))}
        </div>

        {/* User Pagination */}
        <div className="flex justify-center mt-4 space-x-2">
          <button
            disabled={userPage === 1}
            onClick={() => setUserPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled={userPage === totalUserPages}
            onClick={() =>
              setUserPage((prev) => Math.min(prev + 1, totalUserPages))
            }
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>

      {/* Rooms Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Rooms</h2>
        <div>Tổng số rooms: {rooms.length}</div>
        <div className="space-y-4">
          {rooms.map(({ _id, roomType, members, lastMessage }) => (
            <div key={_id} className="p-4 border rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div className="text-lg font-semibold">
                  {roomType.toUpperCase()} Room
                </div>
                <div className="text-sm text-gray-500">ID: {_id}</div>
              </div>
              <div className="mb-2">
                <div className="font-medium">Members:</div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {members.map(({ user, role }, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      {user?.avatar && (
                        <img
                          src={user?.avatar}
                          alt={user?.fullName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <span>{user?.fullName}</span>
                      <span className="text-xs text-gray-400">({role})</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Last Message:{" "}
                <span className="font-medium">{lastMessage?.text}</span> by{" "}
                <span className="italic">{lastMessage?.sender?.fullName}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Room Pagination */}
        <div className="flex justify-center mt-4 space-x-2">
          <button
            disabled={roomPage === 1}
            onClick={() => setRoomPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            disabled={roomPage === totalRoomPages}
            onClick={() =>
              setRoomPage((prev) => Math.min(prev + 1, totalRoomPages))
            }
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
