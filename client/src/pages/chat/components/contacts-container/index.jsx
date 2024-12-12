import apiClient from "@/lib/api-client";
import NewDm from "./components/new-dm/index";
import ProfileInfo from "./components/profile-info";
import { GET_DM_CONTACTS_ROUTE } from "@/utils/constants";
import { useEffect } from "react";
import useAppStore from "@/store";
import ContactList from "@/components/contact-list";

const ContactsContainer = () => {
  const { directMessagesContacts, setDirectMessagesContacts } = useAppStore();

  useEffect(() => {
    const getContacts = async () => {
      try {
        // Make sure to use `await` correctly and handle errors
        const response = await apiClient.get(GET_DM_CONTACTS_ROUTE, {
          withCredentials: true,
        });

        // Check if the contacts property exists and log the response
        if (response && response.data && response.data.contacts) {
          setDirectMessagesContacts(response.data.contacts);
          console.log("Contacts:", response.data.contacts);
        } else {
          console.error("No contacts found in response:", response);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    // Call the getContacts function inside the useEffect
    getContacts();
  }, []); // Empty dependency array to run this effect only once on mount
  return (
    <div
      className="relative md:w-[35vw] lg:w-[30vw]  xl:w-[20vw] bg-[#1b1c24] border-r-2 
      border-[#2f303b] w-full"
    >
      <div className="pt-5">
        <Logo></Logo>
      </div>

      <div className="my-5">
        <div className="flex items-center  gap-20">
          <Title text="Direct Message" className="font-sans " />

          <NewDm />
        </div>
        <div className="max-h-[38vh] overflow-y-scroll no-scrollbar">
          <ContactList contacts={directMessagesContacts}></ContactList>
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between gap-2">
          <Title text="Channels" className="font-sans"></Title>
        </div>
      </div>
      <ProfileInfo></ProfileInfo>
    </div>
  );
};

export default ContactsContainer;

const Logo = () => {
  return (
    <div className="flex p-5  justify-start items-center gap-2">
      <svg
        id="logo-38"
        width="78"
        height="32"
        viewBox="0 0 78 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {" "}
        <path
          d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
          className="ccustom"
          fill="#8338ec"
        ></path>{" "}
        <path
          d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
          className="ccompli1"
          fill="#975aed"
        ></path>{" "}
        <path
          d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
          className="ccompli2"
          fill="#a16ee8"
        ></path>{" "}
      </svg>
      <span className="text-3xl font-semibold ">Syncronus</span>
    </div>
  );
};

// export default Logo;

const Title = ({ text, className }) => {
  return (
    <h5 className={`uppercase tracking-widest text-natural-400 pl-10 mb-5 text-opacity-90 text-sm font-sans font-semibold`}>
      {text}
    </h5>
  );
};

