import { Router } from "express";
import {
    getUserInfo, registerUser, login, logOut, getUser, userVerifyJWT, resendVerificationCode, updateAvatar, editProfile, updateProfile
} from "../Controller/User/user.controller.js";

import { addToFavourite,removeFromFavourite } from "../Controller/User/addToFavourite.controller.js";
import { verifyJWT } from "../Middleware/verifyJWT.js";
import { upload } from "../Middleware/Multer.js"
export const router = Router();

// Registration route
router.route("/register").post(upload.none(), getUserInfo);
// resend code route
router.route("/resend-code").post(resendVerificationCode);
// register user
router.route("/verify-register").post(upload.none(), registerUser);
// login user route
router.route("/login").post(upload.none(), login);
// logOut user route
router.route("/logOut").post(verifyJWT, logOut);
// get user route
router.route("/getUser").get(verifyJWT, getUser);
// verify token user route
router.route("/verifyJWT").post(verifyJWT, userVerifyJWT);
// edit profile 
router.route("/edit-profile").post(upload.none(), verifyJWT, editProfile);
// update profile
router.route("/verify-update-profile").post(upload.none(), verifyJWT, updateProfile);
// update user avatar route
router.route("/avatar").post(verifyJWT, upload.fields([
    {
        name: "avatar",
        maxCount: 1,
    }
]), updateAvatar)


// add product to wish list
router.route("/addToList").post(verifyJWT,upload.none(),addToFavourite)
router.route("/removeToList").post(verifyJWT,upload.none(),removeFromFavourite)