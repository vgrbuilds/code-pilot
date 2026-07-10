import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";
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


// Generic controllers
const getUserProfile = (req, res) => {
  if (req.user) {
    return res.status(200).json(req.user);
  }
  return res.status(404).json({ message: "User profile not found" });
}

const updateUserProfile = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username && username !== user.username) {
      // Check if username already exists
      const exists = await User.findOne({ username });
      if (exists) {
        return res.status(400).json({ message: "Username already exists" });
      }
      user.username = username;
    }

    if (password) {
      user.password = await hashPassword(password);
    }

    await user.save();
    
    // Generate a new token if profile details changed
    const token = generateToken(user);
    return res.status(200).json({
      message: "Profile updated successfully",
      token,
      user: {
        _id: user._id,
        username: user.username
      }
    });
  } catch (err) {
    console.error("Error in updateUserProfile controller:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const deleteUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Delete user record
    await User.findByIdAndDelete(userId);

    // 2. Cascade delete all chats belonging to this user
    await Chat.deleteMany({ user_id: userId });

    return res.status(200).json({ message: "Account and associated conversations deleted successfully" });
  } catch (err) {
    console.error("Error in deleteUserProfile controller:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}


export {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile
}