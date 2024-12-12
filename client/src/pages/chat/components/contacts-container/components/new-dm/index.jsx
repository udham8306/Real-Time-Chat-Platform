import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Removed DialogTrigger
import { Input } from "@/components/ui/input";
import { animationDefaultOption, getColor } from "@/lib/utils";
import Lottie from "react-lottie"; // Ensure Lottie is imported
import { HOST, SEARCH_CONTACTS_ROUTE } from "@/utils/constants";
import apiClient from "@/lib/api-client";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import useAppStore from "@/store";

const NewDm = () => {
  const [openNewContactModel, setOpenNewContactModel] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const { setSelectedChatType, setSelectedChatData } = useAppStore();

  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm && searchTerm.length > 0) {
        console.log("Searching for:", searchTerm); // Log search term for debugging
        const response = await apiClient.post(
          SEARCH_CONTACTS_ROUTE,
          { searchTerm },
          { withCredentials: true }
        );

        console.log("Response data:", response.data.contacts); // Log response for debugging

        if (response.status === 200 && response.data.contacts) {
          setSearchedContacts(response.data.contacts);
        } else {
          setSearchedContacts([]); // Handle the case where no contacts are found
        }
      } else {
        setSearchedContacts([]); // Clear results when search term is empty
      }
    } catch (error) {
      console.error("Error searching contacts:", error);
    }
  };

  const selectNewContact = (contact) => {
    setOpenNewContactModel(false);
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    setSearchedContacts([]);
  };
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="mr-4">
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300 mb-5"
              onClick={() => {
                setOpenNewContactModel(true); // Open dialog manually
              }}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            Select New Contact
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col justify-start">
          <DialogHeader>
            <DialogTitle>Please select a contact</DialogTitle>
            <DialogDescription>
              Search and select a contact to start a chat.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search contacts"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => {
                searchContacts(e.target.value);
              }}
            />
          </div>
          {searchedContacts.length > 0 && (
            <ScrollArea className="h-[250px] overflow-y-auto">
              <div>
                {searchedContacts.map((contact) => (
                  <div
                    key={contact._id}
                    className="flex gap-3 items-center cursor-pointer"
                    onClick={() => {
                      selectNewContact(contact);
                    }}
                  >
                    <div className="w-20 h-20 relative">
                      <Avatar className="w-full h-full rounded-full overflow-hidden">
                        {contact.image ? (
                          <AvatarImage
                            src={`${HOST}/${contact.image}`}
                            alt="profile"
                            className="uppercase text-lg border-[1px] flex items-center justify-center rounded-full w-full h-full "
                          />
                        ) : (
                          <div
                            className={`uppercase text-lg border-[1px] flex items-center justify-center rounded-full 
                  ${getColor(contact.color)} w-full h-full my-1`}
                          >
                            {contact.firstName
                              ? contact.firstName[0]
                              : contact?.email?.[0] || "?"}
                          </div>
                        )}
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <span>
                        {contact.firstName && contact.lastName
                          ? `${contact.firstName} ${contact.lastName}`
                          : ""}
                      </span>
                      <span className="text-xs ">{contact.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          {searchedContacts.length <= 0 && (
            <div className="flex  flex-col justify-center items-center duration-1000 transition-all mb-6 h-full mt-2">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOption}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center lg:text-2xl text-xl transition-all duration-300 text-center mb-8 mt-5 ">
                <h3 className="poppins-medium">
                  Hi <span className="text-purple-500">! </span>Search New
                  <span className="text-purple-500"> Contacts </span>
                  <span className="text-purple-500">.</span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDm;
