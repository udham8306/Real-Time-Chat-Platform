import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import { renameSync, unlink, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 days

// Function to create JWT
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge / 1000,
  });
};

export const signUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).send("Email and Password are required");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send("User already exists with this email");
    }

    // Log before hashing
    // console.log("Hashing password...");

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);
    // console.log("hashed password ", hashedPassword);

    // Create a new user
    const user = new User({
      email,
      password: hashedPassword,
      profileSetup: false, // Initialize as false if it does not exist
    });

    await user.save(); // Don't forget to save the user to the database

    // Create JWT token
    const token = createToken(email, user.id);

    // Send the token as a cookie
   
    res.cookie("jwt", token, {
      maxAge: maxAge,
      httpOnly: true, // Keeps cookie inaccessible to JavaScript
      secure: process.env.NODE_ENV === "production", // Secure cookies only in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Allow cross-site in production, but not in development
    });

    // Respond with the new user's info
    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup || false,
      },
    });
    
  } catch (error) {
    console.error("Error in signUp:", error); // Log the full error for better debugging
    return res.status(500).send("Internal Server Error");
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required" });
    }

    // Find user by email
    const existingUser = await User.findOne({ email });
    // console.log(existingUser);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the hashed password

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    // console.log(isPasswordValid);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create JWT token
    const token = createToken(email, existingUser.id);

    // Set cookie with JWT token
    res.cookie("jwt", token, {
      maxAge: maxAge,
      httpOnly: true, // Keeps cookie inaccessible to JavaScript
      secure: process.env.NODE_ENV === "production", // Secure cookies only in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Allow cross-site in production, but not in development
    });


    // Respond with user details (excluding password)
    return res.status(200).json({
      user: {
        id: existingUser.id,
        email: existingUser.email,
        profileSetup: existingUser.profileSetup || false, // Assuming profileSetup exists
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        image: existingUser.image,
        color: existingUser.color,
      },
    });
  } catch (error) {
    console.error("Error in signIn:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserInfo = async (req, res, next) => {
  try {
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.status(404).send("User with given email not found");
    }
    // console.log(req.userId);

    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup || false, // Assuming profileSetup exists
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.error("Error in getting Userinfo:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req;
    const { firstName, lastName, color } = req.body;

    if (!firstName || !lastName || !color) {
      return res.status(400).send("firstName , lastName and color is required");
    }
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup || false, // Assuming profileSetup exists
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    console.error("Error in updating:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const addProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("File is required");
    }

    const date = Date.now();
    // Use req.file.originalname (lowercase 'n')
    let fileName = "uploads/profiles/" + date + req.file.originalname;

    // Rename the uploaded file
    renameSync(req.file.path, fileName);

    // Update the user's profile with the new image
    const updateUser = await User.findByIdAndUpdate(
      { _id: req.userId }, // Query by user ID (as an object)
      { image: fileName },
      { new: true, runValidators: true }
    );

    if (!updateUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      image: updateUser.image,
    });
  } catch (error) {
    console.error("Error in addProfileImage:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeProfileImage = async (req, res, next) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);

    if(!user)
    {
        res.status(404).send("User not found")
    }

    if(user.image)
    {
        unlinkSync(user.image);
    }
    user.image = null;
    await user.save();
    

    return res.status(200).send("Profile Image remove successfully");
  } catch (error) {
    console.error("Error in removeImageProfile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const logout = async (req, res, next) => {
  try {
    
    
    res.cookie("jwt","",{maxAge:1 ,secure:true,sameSite:"None"})
    return res.status(200).send("Account Logout Successfully");
  } catch (error) {
    console.error("Error in Logout:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
