import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoute.js";
import ContactRoutes from "./routes/ContactRoute.js";
import setupSocket from "./socket.js";
import MessagesRoutes from "./routes/MessagesRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const databaseURL = process.env.DATABASE_URL;

// Middleware
app.use(cors({
    origin: process.env.ORIGIN || "http://localhost:3000",  // Set a default value in case .env ORIGIN is missing
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));

app.use("/uploads/profiles",express.static("uploads/profiles"))
app.use("/uploads/files",express.static("uploads/files"))



app.use(cookieParser());
app.use(express.json());

// Route middleware
app.use("/api/auth", authRoutes);
app.use("/api/contacts", ContactRoutes);
app.use("/api/messages",MessagesRoutes)
// Start server
const server = app.listen(port, () => {
  console.log("Server is running on port", port);
});

 setupSocket(server)
// Mongoose connection with try...catch for better error handling
try {
  mongoose.connect(databaseURL, {
   
  })
  .then(() => {
    console.log("DB connection is successful");
  })
  .catch((error) => {
    console.log("DB connection error:", error.message);
    process.exit(1);  // Exit the process if DB connection fails
  });
} catch (error) {
  console.log("Unexpected error:", error.message);
  process.exit(1);
}