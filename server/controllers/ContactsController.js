import mongoose from "mongoose";
import MessageModel from "../models/MessageModel.js";
import User from "../models/UserModel.js";

export const searchContacts = async (req, res) => {
  try {
    const { searchTerm } = req.body;
    // console.log(searchTerm);

    // Escape special characters in the search term for use in regex
    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    // Create a case-insensitive regex
    const regex = new RegExp(sanitizedSearchTerm, "i");

    // Query users whose firstName, lastName, or email matches the search term
    // console.log(req.userId);
    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } }, // Exclude current user
        {
          $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
        },
      ],
    });
    // console.log({ contacts });
    // Return found contacts
    return res.status(200).json({ contacts });
  } catch (error) {
    console.error("Error in searchContacts:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getContactsForDMList = async (req, res) => {
  try {
    let { userId } = req;

    // Ensure `userId` is of type ObjectId
    userId = new mongoose.Types.ObjectId(userId);

    const contacts = await MessageModel.aggregate([
      {
        // Match documents where the user is either the sender or the recipient
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        // Sort by timestamp in descending order to get the latest messages first
        $sort: { timestamp: -1 },
      },
      {
        // Group by the other user's ID (either sender or recipient)
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] }, // Check if the sender is the user
              then: "$recipient", // If true, group by the recipient (the other user)
              else: "$sender", // Otherwise, group by the sender (the other user)
            },
          },
          lastMessageTime: { $first: "$timestamp" }, // Get the timestamp of the latest message
        },
      },
      {
        // Lookup additional user details for the other user (contact) from the "users" collection
        $lookup: {
          from: "users", // Corrected typo
          localField: "_id", // Field from MessageModel (either sender or recipient ID)
          foreignField: "_id", // Field from User model (user's ID)
          as: "contactInfo",
        },
      },
      {
        // Unwind the contactInfo array to de-normalize the data
        $unwind: "$contactInfo",
      },
      {
        // Project the desired fields (lastMessageTime and contact info)
        $project: {
          _id: 1, // Keep the ID (either sender or recipient)
          lastMessageTime: 1, // Keep the last message time
          email: "$contactInfo.email", // Email from the contact info
          firstName: "$contactInfo.firstName", // First name from the contact info
          lastName: "$contactInfo.lastName", // Last name from the contact info
          image: "$contactInfo.image", // Image URL from the contact info
          color: "$contactInfo.color", // Color attribute from the contact info
        },
      },
      {
        // Sort by the last message time in descending order
        $sort: { lastMessageTime: -1 },
      },
    ]);
     console.log({contacts})
    return res.status(200).json({ contacts });
  } catch (error) {
    console.error("Error in getContactsForDMList:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
