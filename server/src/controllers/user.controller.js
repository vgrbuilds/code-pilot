import User from "../models/user.model.js";
import hashPassword from "../utils/hash.password.js";
import generateToken from "../utils/generate.token.js";
import comparePassword from "../utils/compare.password.js";


// Auth controllers
const registerUser = async (req, res) => {
  try{
    const {username , password} = req.body;
    if(!username || !password){
      return res.status(400).json({message: "Username and password are required"});
    }
    const user = await User.findOne({username});
    if(user){
      return res.status(400).json({message: "Username already exists"});
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      username,
      password: hashedPassword,
    });
    await newUser.save();
    return res.status(201).json({message: "User registered successfully"});
  }
  catch(err){
    console.error(err);
    return res.status(500).json({message: "Internal server error"});

  }
}


const loginUser = async (req, res) => {
  try{
    const {username , password} = req.body;
    if(!username || !password){
      return res.status(400).json({message: "Username and password are required"});
    }
    const user = await User.findOne({username});
    if(!user){
      return res.status(400).json({message: "Invalid username or password"});
    }
    const isMatch = await comparePassword(password, user.password);
    if(!isMatch){
      return res.status(400).json({message: "Invalid username or password"});
    }
    const token = generateToken(user);
    return res.status(200).json({token});
  }
  catch(err){
    console.error(err);
    return res.status(500).json({message: "Internal server error"});
  }
}


// Generic conrollers
const getUserProfile = (req, res) => {
  if (req.user) {
    return res.status(200).json(req.user);
  }
  return res.status(404).json({ message: "User profile not found" });
}
const updateUserProfile = (req, res) => {
  // Logic for updating user profile
}
const deleteUserProfile = (req, res) => {
  // Logic for deleting user profile
}


export {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile
}