import { Server as SocketIOServer } from "socket.io";
import MessageModel from "./models/MessageModel.js";

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const disconnect = (socket) => {
    console.log(`client disconnected : ${socket.id}`);

    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message) => { // Added 'message' parameter
    console.log("Message object before saving:", message); 
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient); // Corrected this line

    try {
      // Create and populate the message
      
      const createdMessage = await MessageModel.create(message);
      
      const messageData = await MessageModel.findById(createdMessage._id)
        .populate("sender", "id email firstName lastName color")
        .populate("recipient", "id email firstName lastName color"); // Fixed 'populate' typo

      // Emit the message to the recipient and sender if they are connected
      console.log("createdMessage : " ,messageData)
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receivedMessage", messageData);
      }

      if (senderSocketId) {
        io.to(senderSocketId).emit("receivedMessage", messageData);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const userSocketMap = new Map();

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`user connected : ${userId} with Socket ID :${socket.id}`);
    } else {
      console.log("User id not provided during connection");
    }

    // Register 'sendMessage' event with a handler function
    socket.on("sendMessage", (message) => sendMessage(message));
    // Handle disconnect
    socket.on("disconnect", () => {
      disconnect(socket);
    });
  });
};

export default setupSocket;
