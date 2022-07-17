//* modules for user Model
import mongoose, { PassportLocalSchema } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

//***schema for users
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      default: "",
      trim: "true",
      required: "username is required",
    },
    email: {
      type: String,
      default: "",
      trim: "true",
      required: "email address is required",
    },
    displayName: {
      type: String,
      default: "",
      trim: "true",
      required: "Display Name is required",
    },
    created: {
      type: Date,
      default: Date.now(),
    },
    update: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    collection: "users",
  },
);


let options = { missingPasswordError: "Wrong/ Missing Password" };

UserSchema.plugin(passportLocalMongoose, options);

const User =  mongoose.model("User", UserSchema as PassportLocalSchema); 
export default User;
