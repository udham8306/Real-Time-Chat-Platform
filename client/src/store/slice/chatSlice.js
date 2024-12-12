
export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessagesContacts: [],



  isUploading: false,
  isDownloading: false,
  fileUploadProgress : 0,
  fileDownloadProgress :0,
  
  filePreview : false,
  
  setFilePreview :(filePreview) => {
    set({ filePreview });
  },


  setIsUploading: (isUploading) => {
    set({ isUploading });
  },
  setIsDownloading: (isDownloading) => {
    set({ isDownloading });
  },
  setFileUploadProgress: (fileUploadProgress) => {
    set({ fileUploadProgress });
  },
  setFileDownloadProgress: (fileDownloadProgress) => {
    set({ fileDownloadProgress });
  },



   setDirectMessagesContacts: (directMessagesContacts) => {
    set({ directMessagesContacts });
  },
  setSelectedChatType: (selectedChatType) => {
    set({ selectedChatType });
  },
  setSelectedChatData: (selectedChatData) => {
    set({ selectedChatData });
  },
  setSelectedChatMessages: (selectedChatMessages) => {
    set({ selectedChatMessages });
  },
  closeChat: () => {
    set({
      selectedChatType: undefined,
      selectedChatData: undefined,
      selectedChatMessages: [],
    });
  },
  addMessage: (message) => {
    // Check if message and required fields exist
    if (!message || !message.sender || !message.recipient) {
      console.error("Invalid message format: ", message);
      return;
    }

    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;

    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          recipient:
            selectedChatType === "channel"
              ? message.recipient
              : message.recipient?._id, // Use optional chaining to prevent undefined errors
          sender:
            selectedChatType === "channel"
              ? message.sender
              : message.sender?._id, // Use optional chaining to prevent undefined errors
        },
      ],
    });
  },
});
