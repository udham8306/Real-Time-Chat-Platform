import { Router } from "express";
import { getUserInfo, 
    signIn, 
    signUp, 
    updateProfile,
    addProfileImage,
    removeProfileImage,
    logout,
    
 } from "../controllers/AuthController.js";

import { verifyToken } from "../middlewares/Authmiddleware.js";
import multer from "multer";
const authRoutes = Router();
const upload = multer({dest :"uploads/profiles/"})
// POST request to sign up
authRoutes.post("/signup", signUp);
authRoutes.post("/signin", signIn);
authRoutes.get("/user-info",verifyToken,getUserInfo)
authRoutes.post("/update-profile",verifyToken,updateProfile)

authRoutes.post("/add-profile-image",verifyToken, upload.single("profile-image"), addProfileImage)

authRoutes.delete("/remove-profile-image",verifyToken,removeProfileImage)
authRoutes.post("/logout",logout)

export default authRoutes;


