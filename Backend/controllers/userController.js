import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
    image:image
  });

  await newUser.save();
  const accessToken = jwt.sign(
    { id: newUser._id, email: newUser.email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: newUser._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

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
      image:newUser.image
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

  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

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
      image:user.image
    },
  });
};

export const getCurrentUserProfile=async(req,res)=>{
try {
  
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      image: user.image,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }

}


