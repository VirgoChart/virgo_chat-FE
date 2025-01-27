import React, { useState } from "react";
import { Paperclip, Send } from "lucide-react";

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
        setFileBase64(reader.result?.toString() || "");
        setFileType(selectedFile.type);
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      sendMessage(roomId, text, fileBase64, fileType);
      setText("");
      setFileBase64(null);
      setFileType(null);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-4 bg-gray-100 border-t"
    >
      <label
        htmlFor="file-input"
        className="cursor-pointer p-2 rounded-full hover:bg-gray-200 transition"
      >
        <Paperclip size={20} className="text-gray-600" />
        <input
          id="file-input"
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nhập tin nhắn"
        className="flex-1 bg-white-900 resize-none p-3 rounded-lg border focus:ring focus:ring-blue-300 focus:outline-none"
        rows={1}
      />

      <button
        type="submit"
        disabled={isSending}
        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition disabled:bg-gray-400"
      >
        <Send size={20} />
      </button>
    </form>
  );
};

export default MessageInput;
