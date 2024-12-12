import MessageModel from "../models/MessageModel.js";
import User from "../models/UserModel.js";
import { mkdirSync, renameSync } from "fs";
import path from "path";
import multer  from "multer"
export const getMessages = async (req, res) => {
  try {
    const user1 = req.userId; // Assuming this is being set by middleware, such as JWT authentication
    const user2 = req.body.id;

    // Check if both user1 and user2 are provided
    if (!user1 || !user2) {
      return res.status(400).json({ message: "Both user1 and user2 are required" });
    }

    // Ensure that user1 and user2 are valid ObjectId types (optional, add if needed)
    if (!user1.match(/^[0-9a-fA-F]{24}$/) || !user2.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid user IDs provided" });
    }

    // Find messages exchanged between user1 and user2
    const messages = await MessageModel.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 }); // Ensure 'timestamp' is correctly named as per your schema

    // Return the fetched messages
    // console.log(messages)
    return res.status(200).json( { messages });
  } catch (error) {
    console.error("Error in fetching Messages:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};




import sanitize from 'sanitize-filename';

export const uploadFile = async (req, res) => {
  try {
    // Check if file is present in the request
    console.log(req.file);
    if (!req.file) {
      console.log("file is required");
      return res.status(400).json({ message: "File is required" });
    }

    // Validate file type
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png',
      'text/plain',
    ];

    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      console.error("Unsupported file type");
      return res.status(400).json({ message: "Unsupported file type" });
    }

    // Generate directory and file paths based on the current timestamp
    const timestamp = Date.now();
    const uploadDir = path.join("uploads", "files", `${timestamp}`);
    const newFileName = `${timestamp}_${sanitize(req.file.originalname)}`;
    const newFilePath = path.join(uploadDir, newFileName);

    // Create the directory if it doesn't exist
    try {
      mkdirSync(uploadDir, { recursive: true });
    } catch (mkdirError) {
      console.error("Error creating directory:", mkdirError);
      return res.status(500).json({ message: "Error creating upload directory" });
    }

    // Move the uploaded file to the new directory
    try {
      renameSync(req.file.path, newFilePath);
    } catch (renameError) {
      console.error("Error moving file:", renameError);
      return res.status(500).json({ message: "Error moving uploaded file" });
    }

    // Return the new file path in the response
    const fileUrl = `/${newFilePath.replace(/\\/g, '/')}`; // Adjust for URL format
    return res.status(200).json({ filePath: fileUrl });
  } catch (error) {
    console.error("Error in uploading file:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
