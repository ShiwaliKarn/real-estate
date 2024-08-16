import mongoose from "mongoose";

const userSchema = new mongoose({
  username: {
    String,
    required: true,
  },
  email: {
    String,
    required: true,
    unique: true,
  },
  username: {
    String,
    required: true,
  },

}, {timestams: true});


const User = mongoose.model('User', userSchema);
export default User;