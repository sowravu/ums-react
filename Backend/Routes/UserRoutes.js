import express from 'express';
const router= express.Router();
import {getusersDatas,createUser,loginUser,getCurrentUserProfile,refreshToken,editProfile,editUserByAdmin,toggleBlockUser} from '../controllers/userController.js'
import upload from "../middlewares/upload.js";
import { verifyToken } from '../middlewares/auth.js';
import User from '../models/User.js';

router.post("/signup", upload.single("image"), createUser);

router.post('/login',loginUser);
router.post("/refresh", refreshToken);

// router.post('/editProfile',Editprofile)
// router.post('/logout',logoutUser);

router.get('/profile',verifyToken,getCurrentUserProfile)

router.get("/home", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  if (user.isBlocked === 1) {
    return res.status(403).json({ message: "User is blocked" });
  }

  res.json({
    isValid: true,
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
});

//hai all

router.post("/editProfile", upload.single("image"), editProfile);

router.get("/dashboard",verifyToken,getusersDatas)

router.put("/dashboard/:id", verifyToken, upload.single("image"), editUserByAdmin);

router.patch("/dashboard/:id/block", verifyToken, toggleBlockUser);
export default router