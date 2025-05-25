"use client";

import React, { useState } from "react";
import { Paperclip, Send, XCircle } from "lucide-react";
import Image from "next/image";

interface MessageInputProps {
  roomId: string;
  sendMessage: (
    roomId: string,
    text: string,
    fileBase64: string | null,
    fileType: string | null
  ) => void;
}

const MessageInput = ({ roomId, sendMessage }: MessageInputProps) => {
  const [text, setText] = useState("");
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [fileKey, setFileKey] = useState(Date.now());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
        setFileBase64(reader.result?.toString() || "");
        setFileType(selectedFile.type);
        setFileKey(Date.now());
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      sendMessage(roomId, text, fileBase64, fileType);
      setText("");
      handleRemoveFile();
    } finally {
      setIsSending(false);
    }
  };

  // Xử lý xóa file đính kèm
  const handleRemoveFile = () => {
    setFileBase64(null);
    setFileType(null);
    setFileKey(Date.now()); // Reset key để có thể chọn lại cùng một file
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-0 p-3 bg-white">
      {/* Preview ảnh đính kèm */}
      {fileBase64 && fileType?.startsWith("image/") && (
        <div className="relative mb-3 w-24 h-24">
          <Image
            src={fileBase64}
            alt="image-preview"
            className="w-full h-full object-cover rounded-lg border shadow-sm"
            width={96}
            height={96}
          />
          <button
            type="button"
            onClick={handleRemoveFile}
            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition"
          >
            <XCircle size={18} />
          </button>
        </div>
      )}

      {/* Thanh nhập và nút gửi */}
      <div className="flex items-end gap-2">
        {/* Icon đính kèm file */}
        <label
          htmlFor="file-input"
          className="cursor-pointer w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition"
        >
          <Paperclip size={20} className="text-gray-600" />
          <input
            key={fileKey}
            id="file-input"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nhập tin nhắn..."
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          className="flex-1 bg-white resize-none px-4 py-2 rounded-2xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
        />

        {/* Nút gửi */}
        <button
          type="submit"
          disabled={isSending}
          className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 transition disabled:bg-gray-400"
        >
          <Send size={18} />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
