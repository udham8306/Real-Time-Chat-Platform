import useAppStore from "@/store";
import React, { useEffect, useRef, useState } from "react";
import moment from "moment"; // Make sure to import moment if not already imported
import { HOST } from "@/utils/constants";

import { IoMdArrowRoundDown } from "react-icons/io";
import apiClient from "@/lib/api-client";
import { IoMdClose } from "react-icons/io";

import { MdFolderZip, MdPictureAsPdf, MdDescription } from "react-icons/md"; // Material Design icons
import { AiFillFileWord, AiFillFileExcel, AiFillFile } from "react-icons/ai"; // Ant Design icons

const MessageContainer = () => {
  const scrollRef = useRef();

  // Destructure states from your app's store
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setIsDownloading,
    setFileDownloadProgress,
    filePreview,

  } = useAppStore();
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (scrollRef.current) {
      // Scroll to the latest message
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|.gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };
  const renderMessages = () => {
    let lastDate = null;

    return selectedChatMessages.map((message, index) => {
      // Format the timestamp and decide if the date separator should be shown
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index}>
          {/* Show a date separator if the date has changed */}
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}{" "}
              {/* Fixed format usage */}
            </div>
          )}
          {/* Render direct messages if the selected chat type is 'contact' */}
          {selectedChatType === "contact" && renderDMmessages(message)}
        </div>
      );
    });
  };
  const handleDownloadFile = async (fileurl) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);
    try {
      // Make the request to get the file as a blob
      const response = await apiClient.get(`${HOST}/${fileurl}`, {
        responseType: "blob",
        onDownloadProgress: (progress) => {
          const { loaded, total } = ProgressEvent;
          percentCompleted = Math.round((100 * loaded) / total);
          setFileDownloadProgress(percentCompleted);
        },
      });

      // Create a URL for the blob
      const urlBlob = window.URL.createObjectURL(new Blob([response.data]));

      // Create a link element
      const link = document.createElement("a");
      link.href = urlBlob;

      // Use fileurl to get the filename
      const fileName = fileurl.split("_").pop();
      link.setAttribute("download", fileName);

      // Append link to the body, click it to trigger download, then remove it
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Revoke the blob URL after download
      window.URL.revokeObjectURL(urlBlob);
      setIsDownloading(false);
      setFileDownloadProgress(0);
    } catch (error) {
      console.error("Error downloading the file: ", error);
    }
  };

  // Function to render direct messages with appropriate styling

// Utility function to determine the file type and return an appropriate icon
const getFileTypeIcon = (fileUrl) => {
  const extension = fileUrl.split(".").pop().toLowerCase(); // Get file extension

  switch (extension) {
    case "pdf":
      return <MdPictureAsPdf />; // PDF icon
    case "doc":
    case "docx":
      return <AiFillFileWord />; // Word file icon
    case "xls":
    case "xlsx":
      return <AiFillFileExcel />; // Excel file icon
    case "zip":
    case "rar":
      return <MdFolderZip />; // Zip file icon
    default:
      return <AiFillFile />; // Generic file icon
  }
};

const renderDMmessages = (message) => {
  return (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border border-[#8417ff]/50 "
              : "bg-[#8417ff]/5 text-white border border-white/20"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div>
      )}

      {message.messageType === "file" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border border-[#8417ff]/50 "
              : "bg-[#8417ff]/5 text-white border border-white/20"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {checkIfImage(message.fileUrl) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setShowImage(true);
                setImageUrl(message.fileUrl);
              }}
            >
              <img
                src={`${HOST}/${message.fileUrl}`}
                height={300}
                width={300}
                alt="Uploaded file"
              />
              <p>{message?.content}</p>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              {/* Dynamically display the file type icon */}
              <span className="text-[#8417ff]/90 text-3xl bg-[#8417ff]/5 rounded-full">
                {getFileTypeIcon(message.fileUrl)}
              </span>
              <span>{message.fileUrl.split("_").filter(Boolean).pop()}</span>
              <span
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 transition-all duration-300 cursor-pointer"
                onClick={() => {
                  handleDownloadFile(message.fileUrl);
                }}
              >
                <IoMdArrowRoundDown />
              </span>
              <p>{message?.content}</p>
            </div>
          )}
        </div>
      )}

      {/* Display timestamp below the message */}
      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}{" "}
      </div>
    </div>
  );
};


  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      {/* Reference for scrolling to the latest message */}
      <div ref={scrollRef}></div>
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={`${HOST}/${imageUrl}`}
              alt=""
              className="h-[80vh] w-full bg-cover"
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 transition-all duration-300 cursor-pointer "
              onClick={() => {
                handleDownloadFile(imageUrl);
              }}
            >
              <IoMdArrowRoundDown />
            </button>{" "}
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 transition-all duration-300 cursor-pointer "
              onClick={() => {
                setShowImage(false);
                setImageUrl(null);
              }}
            >
              <IoMdClose />
            </button>{" "}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
