import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "@/context/socketContext";
import apiClient from "@/lib/api-client";
import useAppStore from "@/store";
import { GET_MESSAGES_ROUTE, UPLOAD_FILE_ROUTE } from "@/utils/constants";
import EmojiPicker from "emoji-picker-react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import FilePreview from "./FilePreview"; // Correct import

const MessageBar = () => {
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const fileInputRef = useRef();
  const emojiRef = useRef();

  const socket = useSocket();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setSelectedChatMessages,
    filePreview,
    setFilePreview,
  } = useAppStore();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (selectedChatData._id && selectedChatType === "contact") {
      getMessages();
    }
  }, [selectedChatData, selectedChatType]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [emojiRef]);

  const handleAddEmoji = (emoji) => setMessage((msg) => msg + emoji.emoji);

  const handleSendMessage = (message) => {
    if (!message && !filePreview) return; // Prevent empty messages and no file
    else {
      // Send text message
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    }
    setMessage("");
  };

  const handleSendFileMessage = async (message) => {
    try {
      const formData = new FormData();
      formData.append("file", filePreview.file);

      const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
        withCredentials: true,
        // onUploadProgress: (data) =>
        //   Math.round((100 * data.loaded) / data.total),
      });

      if (response.status === 200 && response.data) {
        // Emit the message with file details (without the message content)
        socket.emit("sendMessage", {
          sender: userInfo.id,
          content: message, // Empty content since you're only sending a file
          recipient: selectedChatData._id,
          messageType: "file",
          fileUrl: response.data.filePath, // File URL from the server
        });
        setFilePreview(null); // Clear file preview after sending
        setMessage(""); // Clear message field if there was any residual message
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the file input
    }
  };

  const handleAttachmentChange = (event) => {
    const file = event.target.files[0];
  
    if (file && file.size < 5 * 1024 * 1024) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "application/msword", // .doc
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
        "application/vnd.ms-excel", // .xls
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
        "text/plain", // .txt
      ];
      
      if (allowedTypes.includes(file.type)) {
        // Set the file preview with file name and type
        setFilePreview({ file, name: file.name, type: file.type });
      } else {
        console.error("Invalid file type.");
      }
    } else {
      console.error("File is too large or not selected.");
    }
  };
  
  // File input
  <input
    type="file"
    className="hidden"
    ref={fileInputRef}
    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.txt"
    onChange={handleAttachmentChange}
  />
  

  const handleCancelFile = () => {
    setFilePreview(null); // Cancel the file selection
  };

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        {/* Message Input */}
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:outline-none"
          placeholder="Enter Message Here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!!filePreview} // Disable input when file is being previewed
        />

        {/* Attachment Button */}
        <button
          className="text-neutral-500 focus:outline-none hover:text-white duration-300 transition-all"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-2xl" />
        </button>

        <input
          type="file"
          className="hidden"
         
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />

        {/* Emoji Picker Button */}
        <div className="relative">
          <button
            className="text-neutral-500 focus:outline-none hover:text-white duration-300 transition-all"
            onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>

          {emojiPickerOpen && (
            <div className="absolute bottom-16 right-0" ref={emojiRef}>
              <EmojiPicker
                theme="dark"
                onEmojiClick={handleAddEmoji}
                autoFocusSearch={false}
              />
            </div>
          )}
        </div>
      </div>

      <button
        className="bg-[#8417ff] flex items-center justify-center p-5 text-[#ffffff] hover:bg-[#741bda] focus:outline-none focus:text-white duration-300 transition-all"
        onClick={handleSendMessage}
        disabled={!message } // Disable send if no message and no file
      >
        <IoSend className="text-2xl" />
      </button>

      {/* Render FilePreview if filePreview exists */}
      {filePreview && (
        <FilePreview
          filePreview={filePreview}
          handleCancelFile={handleCancelFile}
          handleSendFileMessage={handleSendFileMessage}
          handleSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
};

export default MessageBar;
