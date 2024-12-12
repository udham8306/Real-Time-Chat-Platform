import { getColor } from "@/lib/utils";
import useAppStore from "@/store";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/api-client";


const ProfileInfo = () => {
  const { userInfo,setUserInfo } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = async ()=>{
          

    try{
         const response = await apiClient.post(LOGOUT_ROUTE,{},{withCredentials:true});

         if(response.status===200)
         {
            setUserInfo(null)
            navigate("/auth")
         }
    }catch(error)
    {
        console.log(error)
    }
  }
  return (
    <div className="absolute bottom-0 flex items-center justify-between px-5 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-20 h-20 relative">
          <Avatar className="w-full h-full rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="profile"
                 className="uppercase text-lg border-[1px] flex items-center justify-center rounded-full w-full h-full "
              />
            ) : (
              <div
                className={`uppercase text-lg border-[1px] flex items-center justify-center rounded-full 
                    ${getColor(userInfo.color)} w-full h-full my-1`}
              >
                {userInfo.firstName
                  ? userInfo.firstName[0]
                  : userInfo?.email?.[0] || "?"}
              </div>
            )}
          </Avatar>
        </div>

        <div>
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : ""}
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2
                className="text-purple-500 text-xl font-medium cursor-pointer" // added cursor-pointer for better interaction
                onClick={() => {
                  navigate("/profile");
                }}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white p-2 rounded-lg">
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp
                className="text-purple-500 text-xl font-medium cursor-pointer" // added cursor-pointer for better interaction
                onClick={handleLogout}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white p-2 rounded-md">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
