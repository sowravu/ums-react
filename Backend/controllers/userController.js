import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export const createUser = async (req, res) => {
  const { Name, Phone, Email, Password } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  if (!Name || !Phone || !Email || !Password) {
    return res.send("all fields are requiered");
  }
  const user = await User.findOne({ email: Email });
  if (user) {
    return res.status(404).json({ message: "User is already exits" });
  }
  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(Password, saltRounds);
  const newUser = new User({
    name: Name,
    email: Email,
    phone: Phone,
    password: hashPassword,
    image: image,
  });

  await newUser.save();

  const accessToken = generateAccessToken(newUser);
  const refreshToken = generateRefreshToken(newUser);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    token: accessToken,
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      isAdmin: newUser.isAdmin,
      image: newUser.image,
      isBlocked: 0,
    },
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ message: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(404).json({ message: "Invalid credentials" });
  }

  if (user.isBlocked == 1) {
    return res.status(404).json({ message: "admin is blocked you" });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    message: "User logined successfully",
    token: accessToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      image: user.image,
      isBlocked: user.isBlocked,
    },
  });
};

export const getCurrentUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
      if(user.isBlocked==1){
        return res.status(404).json({message:"user is blocked you"})
      }

    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      image: user.image,
      userid: user._id,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { name, email, phone, userid } = req.body;
    console.log("req body of edit profile is ", req.body);
    const userId = userid;
    console.log("userid sii is si ", userId);
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        phone,
        ...(image && { image }),
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        ...updatedUser._doc,
        image: updatedUser.image
          ? `http://localhost:5000${updatedUser.image}`
          : null,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const refreshToken = (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  console.log("referish token is ", refreshToken);
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: "Invalid refresh token" });

    const newAccessToken = generateAccessToken(user);

    res.json({ accessToken: newAccessToken });
  });
};

export const getusersDatas = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: 0 }).select("-password");

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("getUsersDatas error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const editUserByAdmin = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const userId = req.params.id;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phone, ...(image && { image }) },
      { new: true }
    ).select("-password");

    res.json({ success: true, message: "User updated", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, message: "Not found" });

    user.isBlocked = user.isBlocked ? 0 : 1;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isBlocked ? "blocked" : "unblocked"}`,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
