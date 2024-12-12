import React, { useState } from "react";
import Background from "../../assets/login2.png";
import Victory from "../../assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FiEye, FiEyeOff } from "react-icons/fi"; // Import icons from react-icons
import apiClient from "../../lib/api-client";
import { SIGNUP_ROUTE } from "@/utils/constants";
import { SIGNIN_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import  useAppStore  from "@/store/index";



const Auth = () => {

  const navigate = useNavigate();
  const {setUserInfo} = useAppStore();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");



  const [showPassword, setShowPassword] = useState(false); // For toggling password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // For confirm password visibility
   


  const validateSignUp = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };
  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    
    return true;
  };

  const handleSignIn = async () => {
    if (validateLogin()) { // Ensure that validation is performed
     
     
      const response = await apiClient.post(SIGNIN_ROUTE, { email, password }, { withCredentials: true }); // Make POST request
        console.log(response.data); // Log the response data

        if(response.data.user.id)
        {
          setUserInfo(response.data.user);
          if(response.data.user.profileSetup)
          {
              navigate("/chat")
          } 
          else{
              navigate("/profile")
          }
        }
    }
    
  };
  
  const handleSignUp = async () => {
    // Validate the input fields before proceeding
    if (validateSignUp()) {
      try {
        // Make a POST request to the SIGNUP_ROUTE with the email and password
        const response = await apiClient.post(SIGNUP_ROUTE, 
          { email, password },
          { withCredentials: true }
        );
  
        // Axios automatically parses the JSON response, so you can directly access the data
        const responseData = response.data;
  
        // Log the response data for debugging
        console.log("Sign up successful:", responseData);
        if(response.data.user.id)
          {
              setUserInfo(response.data.user);
                navigate("/profile")
            
          }
        // Redirect or perform other actions after successful signup
        // For example, you might want to store user info in a state management system or navigate to a different page
      } catch (error) {
        // Handle errors from the API request
        console.error(
          "Sign up failed:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };
  

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center bg-red-50">
      <div
        className="h-[80vh] w-[80vw] bg-white border-2 border-white text-opacity-90 
        shadow-2xl md:w-[90vw] lg:w-[60vw] rounded-3xl flex flex-row justify-center items-center"
      >
        <div className="flex flex-col justify-center items-center ">
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-row justify-center items-center ml-10">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={Victory} alt="Victory Icon" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with the chat app
            </p>
          </div>
          <div className="flex flex-row justify-center items-center w-full">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="bg-transparent flex flex-row w-full">
                <TabsTrigger
                  value="login"
                  className="text-black text-opacity-90 border-b-2 w-full
                  data-[state=active]:font-semibold data-[state=active]:border-purple-500 p-3 transition-all duration-300"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="text-black text-opacity-90 border-b-2 w-full
                  data-[state=active]:font-semibold data-[state=active]:border-purple-500 p-3 transition-all duration-300"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="login"
                className="flex flex-col gap-5 ml-4 mt-4"
              >
                <Input
                  placeholder="Email"
                  className="rounded-full p-6"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="relative">
                  <Input
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    className="rounded-full p-6"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </div>
                </div>
                <Button className="p-6 rounded-full" onClick={handleSignIn}>
                  Sign In
                </Button>
              </TabsContent>
              <TabsContent
                value="signup"
                className="flex flex-col gap-5 ml-4 mt-2"
              >
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="relative">
                  <Input
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    className="rounded-full p-6"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </div>
                </div>
                <div className="relative">
                  <Input
                    placeholder="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="rounded-full p-6"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <div
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </div>
                </div>
                <Button className="p-6 rounded-full" onClick={handleSignUp}>
                  Sign Up
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden lg:flex justify-center items-center">
          <img src={Background} className="h-[500px]" />
        </div>
      </div>
    </div>
  );
};

export default Auth ; 
