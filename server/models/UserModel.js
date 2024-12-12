import mongoose from "mongoose";
import { genSalt, hash } from "bcrypt"; // Import both genSalt and hash

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required."],
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  color: {
    type: Number,
    required: false,
  },
  profileSetup: {
    type: Boolean,
    default: false,
  },
});

// // Pre-save hook to hash the password before saving it
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next(); // Only hash if the password is modified

//   const salt = await genSalt(10); // 10 is the recommended number of salt rounds
//   this.password = await hash(this.password, salt); // Hash the password with the salt
//   next();
// });

const User = mongoose.model("Users", userSchema);

export default User;
