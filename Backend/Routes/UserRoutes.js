import express from 'express';
const router= express.Router();
import {createUser,loginUser,getCurrentUserProfile,editProfile,refreshToken} from '../controllers/userController.js'
import upload from "../middlewares/upload.js";
import { verifyToken } from '../middlewares/auth.js';

router.post("/signup", upload.single("image"), createUser);

router.post('/login',loginUser);
router.post("/refresh", refreshToken);

//router.post('/editProfile',Editprofile)
// router.post('/logout',logoutUser);

router.get('/profile',verifyToken,getCurrentUserProfile)

router.get('/home',verifyToken, async(req,res)=>{res.json({isvalid:true})})

router.post("/editProfile", upload.single("image"), editProfile);

export default router