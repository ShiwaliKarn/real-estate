import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
import dotenv from "dotenv";

dotenv.config();

export const signUp = async (req, res) => {
  const { username, email, password } = req.body;
  const salt = bcryptjs.genSaltSync(Number(process.env.SALT));
  const hashedPassword =bcryptjs.hashSync(password,salt);
  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();
  res.status(201).json('User created successfully!')
};
