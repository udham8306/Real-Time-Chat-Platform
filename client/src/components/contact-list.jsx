import React, { useState } from "react";
import useAppStore from "@/store";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";

const ContactList = ({ contacts = [], isChannel = false }) => {
  const {
    selectedChatData,
    setSelectedChatData,
    selectedChatType,
    setSelectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  const [searchTerm, setSearchTerm] = useState("");

  // Handle click on a contact or channel
  const handleClick = (item) => {
    // Set the type and data based on whether it's a channel or a contact
    setSelectedChatType(isChannel ? "channel" : "contact");
    setSelectedChatData(item);

    // Reset messages if selecting a different chat
    if (selectedChatData && selectedChatData._id !== item._id) {
      setSelectedChatMessages([]);
    }
  };

  // Filter contacts or channels based on search term
  const filteredItems = contacts.filter((contact) =>
    isChannel
      ? contact.name.toLowerCase().includes(searchTerm.toLowerCase())
      : `${contact.firstName} ${contact.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full px-4 rounded-lg shadow-lg text-white relative">
      {/* Search Bar */}
      <div className="mb-4 sticky top-0">
        <input
          type="text"
          className="w-full py-1 px-2 text-black rounded-md outline-none"
          placeholder={`Search ${isChannel ? "channels" : "contacts"}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Contact or Channel List */}
      {filteredItems.length > 0 ? (
        <div className="space-y-2 h-[70vh] ">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className={`flex items-center gap-3 p-4 rounded-md cursor-pointer transition-all duration-300 hover:bg-[#3e3e4a] ${
                selectedChatData && selectedChatData._id === item._id
                  ? "bg-[#50506b]"
                  : ""
              }`}
              style={{ height: "60px", width: "100%" }} // Adjust the height and width of each item
              onClick={() => handleClick(item)}
            >
              {/* Render Avatar for Contacts */}
              {!isChannel && (
                <Avatar
                  className="w-[50px] h-[50px] rounded-full overflow-hidden"
                  style={{ minWidth: "50px", minHeight: "50px" }} // Ensure minimum width and height for consistency
                >
                  {item.image ? (
                    <AvatarImage
                      src={`${HOST}/${item.image}`}
                      alt="profile"
                      className="uppercase text-lg border-[1px] flex items-center justify-center rounded-full w-full h-full"
                    />
                  ) : (
                    <div
                      className={`uppercase text-lg border-[1px] flex items-center justify-center rounded-full 
                        ${getColor(item.color)} w-full h-full`}
                    >
                      {item.firstName
                        ? item.firstName.charAt(0)
                        : item?.email?.charAt(0) || "?"}
                    </div>
                  )}
                </Avatar>
              )}

              {/* Render Channel Icon for Channels */}
              {isChannel && (
                <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                  #
                </div>
              )}

              {/* Display Contact or Channel Name */}
              <span className="text-lg font-medium">
                {isChannel ? item.name : `${item.firstName} ${item.lastName}`}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No {isChannel ? "channels" : "contacts"} found.
        </div>
      )}
    </div>
  );
};

export default ContactList;
