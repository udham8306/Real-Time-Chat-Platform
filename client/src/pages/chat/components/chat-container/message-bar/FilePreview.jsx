import React, { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";

const FilePreview = ({ filePreview, handleCancelFile, handleSendFileMessage }) => {
  const [fileContent, setFileContent] = useState(null);
  const [message, setMessage] = useState(""); // New state for the message

  useEffect(() => {
    if (filePreview && filePreview.file) {
      const file = filePreview.file;

      const reader = new FileReader();
      if (file.type === "application/pdf") {
        // Handle PDF preview
        reader.readAsArrayBuffer(file);
        reader.onload = (e) => {
          const blob = new Blob([e.target.result], { type: "application/pdf" });
          const pdfUrl = URL.createObjectURL(blob);
          setFileContent(pdfUrl); // Set the PDF URL to preview
        };
      } else if (file.type.startsWith("image/")) {
        // Handle image preview 
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          setFileContent(e.target.result); // Set image as base64 URL
        };
      } else if (file.type.startsWith("text/")) {
        // Handle text file preview
        reader.readAsText(file);
        reader.onload = (e) => {
          setFileContent(e.target.result); // Set text content
        };
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        // Handle .docx file
        setFileContent(null); // No preview, inform the user
      } else {
        // Unsupported file type
        setFileContent(null);
      }
    }
  }, [filePreview]);

  const handleSend = () => {
    handleSendFileMessage(message); // Call the send file message with the text
    setMessage(""); // Clear the message input after sending
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />

      {/* File Preview Box */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-3/4 md:w-1/2 bg-[#2a2b33] p-4 rounded-md gap-2 items-start z-50">
        <p className="text-white">File Name: {filePreview.name}</p>
        <p className="text-white">File Type: {filePreview.type}</p>

        {/* Preview PDF */}
        {filePreview.type === "application/pdf" && fileContent && (
          <iframe
            src={fileContent}
            width="100%"
            height="300px" // Adjusted height
            title="PDF Preview"
            className="rounded-md"
          />
        )}

        {/* Preview Image */}
        {filePreview.type.startsWith("image/") && fileContent && (
          <img
            src={fileContent}
            alt="Image Preview"
            className="rounded-md h-[50vh] w-[50vw] object-contain"
          />
        )}

        {/* Preview Text */}
        {filePreview.type.startsWith("text/") && fileContent && (
          <pre className="text-white whitespace-pre-wrap">{fileContent}</pre>
        )}

        {/* Unsupported File Type Message */}
        {filePreview.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
          <p className="text-white">
           doc.x
          </p>
        )}

        {/* Generic Unsupported File Type Message
        {filePreview && !fileContent && !filePreview.type.startsWith("image/") && !filePreview.type.startsWith("text/") && (
          <p className="text-white">Unsupported file type for preview.</p>
        )} */}

        {/* Text Input and Buttons */}
        <div className="flex items-center mt-4">
          <input
            type="text"
            className="flex-1 p-2 bg-transparent border border-gray-500 rounded-md focus:outline-none text-white"
            placeholder="Enter a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            className="ml-2 p-2 text-white cursor-pointer"
            onClick={handleSend}
           
          >
            <IoSend className="text-2xl" />
          </button>

          <button
            className="ml-2 p-2 rounded-md text-white"
            onClick={handleCancelFile}
          >
            <AiOutlineClose className="text-xl" />
          </button>
        </div>
      </div>
    </>
  );
};

export default FilePreview;
