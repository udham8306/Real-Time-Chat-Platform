import { createContext, useContext, useEffect, useRef } from "react";
import io from "socket.io-client";
import useAppStore from "@/store";
import { HOST } from "@/utils/constants"; // Assuming HOST is defined in your constants file

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true, // Fixed typo here
        query: { userId: userInfo.id },
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket server");
      });

      // Register message listener only if socket is connected
      socket.current.on("receivedMessage", handleRecievedMessage);

      return () => {
        socket.current?.off("receivedMessage", handleRecievedMessage); // Remove listener to prevent memory leaks
        socket.current?.disconnect(); // Properly disconnect socket on cleanup
      };
    }
  }, [userInfo]);
   
  
  const handleRecievedMessage = (message) => {
    const { selectedChatType, selectedChatData, addMessage } =
      useAppStore.getState();

    // Check if the message is for the currently selected chat
    
    if (
      selectedChatType !== undefined &&
      (selectedChatData._id === message.sender._id ||
        selectedChatData._id === message.recipient._id)
    ) {
        console.log("message recieved ",message)
      addMessage(message); // Assuming addMessage is a function in the store to handle new messages
    }
  };

  return (  
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};




  