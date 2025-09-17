import express from 'express';
const router= express.Router();
import {createUser,loginUser,getCurrentUserProfile} from '../controllers/userController.js'
import upload from "../middlewares/upload.js";
import { verifyToken } from '../middlewares/auth.js';

router.post("/signup", upload.single("image"), createUser);
router.post('/login',loginUser);
//router.post('/editProfile',Editprofile)
// router.post('/logout',logoutUser);
router.get('/profile',verifyToken,getCurrentUserProfile)


export default router