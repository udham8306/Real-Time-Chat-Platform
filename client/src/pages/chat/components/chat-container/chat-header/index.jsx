import { getColor } from "@/lib/utils";
import useAppStore from "@/store";
import { HOST } from "@/utils/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { RiCloseFill } from "react-icons/ri";

const ChatHeader = () => {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center w-full justify-between">
        {/* Avatar and User/Channel Info */}
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10">
            <Avatar className="w-full h-full rounded-full overflow-hidden">
              {selectedChatData?.image ? (
                <AvatarImage
                  src={`${HOST}/${selectedChatData.image}`}
                  alt="profile"
                  className="uppercase text-lg border-[1px] flex items-center justify-center rounded-full w-full h-full"
                />
              ) : (
                <div
                  className={`uppercase text-lg border-[1px] flex items-center justify-center rounded-full 
                  ${getColor(selectedChatData?.color)} w-full h-full my-1`}
                >
                  {selectedChatData?.firstName?.charAt(0) ||
                    selectedChatData?.name?.charAt(0) ||
                    selectedChatData?.email?.charAt(0) ||
                    "?"}
                </div>
              )}
            </Avatar>
          </div>
          {/* Displaying Chat Header Information */}
          <div className="text-lg font-medium">
            {selectedChatType === "contact" ? (
              <span>
                {selectedChatData?.firstName} {selectedChatData?.lastName}
              </span>
            ) : selectedChatType === "channel" ? (
              <span>{selectedChatData?.name}</span>
            ) : (
              "No Chat Selected"
            )}
          </div>
        </div>

        {/* Close Chat Button */}
        <div className="flex gap-5 items-center">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
