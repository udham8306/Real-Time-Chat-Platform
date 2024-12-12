import mongoose from "mongoose";

// Define the schema for messages
const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users", // Refers to the 'Users' collection
    required: true, // 'sender' is mandatory for each message
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: false, // 'recipient' is optional (could be group messages or system notifications)
  },
  messageType: {
    type: String,
    enum: ["text", "file"], // Only two types are allowed: text or file
    required: true, // 'messageType' is mandatory
  },
  content: {
    type: String,
    required: function () {
      return this.messageType === "text"; // 'content' is required only if messageType is 'text'
    },
  },
  fileUrl: {
    type: String,
    required: function () {
      return this.messageType === "file"; // 'fileUrl' is required only if messageType is 'file'
    },
  },
  timestamp: {
    type: Date, // 'timestamp' is of type Date
    default: Date.now, // Default value is the current date/time
  },
});

// Create a Mongoose model named 'Messages' using the schema
const MessageModel = mongoose.model("Messages", messageSchema);

export default MessageModel;









