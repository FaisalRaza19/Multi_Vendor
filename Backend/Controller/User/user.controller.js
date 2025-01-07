import { User } from "../../Models/user.model.js";
import bcryptjs from "bcryptjs";
import jsonWebToken from "jsonwebtoken";
import { InputVerifier } from "../../utils/InputVerifier.js"
import { fileUploadOnCloudinary, removeFileFromCloudinary } from "../../utils/fileUploadAndRemoveFromCloudinary.js"
import { userNameGenerator } from "../../utils/userNameGenerator.js";
import { sendEmail, verifyEmail } from "../../utils/sendAndVeriefyEmail.js";

// Get user info and send verification code
const getUserInfo = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // validate input 
        const validationResult = InputVerifier(req.body);
        if (validationResult !== true) {
            return res.status(400).json({ message: "Invalid input", errors: validationResult });
        }

        // check email is in use 
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use." });
        }

        // send email 
        const verificationCode = await sendEmail(email);
        console.log(verificationCode);
        if (!verificationCode) {
            return res.status(500).json({ message: "Failed to send verification code" });
        }

        req.session.verificationCode = verificationCode;
        req.session.userData = req.body;

        return res.status(200).json({ message: "Verification code sent to your email. Please verify." });
    } catch (error) {
        console.error("Error in getUserInfo:", error);
        return res.status(500).json({ statusCode: 200, message: "Error during registration.", error: error.message });
    }
};

// Resend verification code
const resendVerificationCode = async (req, res) => {
    try {
        const { userData } = req.session;
        if (!userData || !userData.email) {
            return res.status(400).json({ message: "Session expired or user not found." });
        }

        // resend email  
        const verificationCode = await sendEmail(userData.email);
        req.session.verificationCode = verificationCode;

        return res.status(200).json({ message: "New verification code sent to your email." });
    } catch (error) {
        console.error("Error in resendVerificationCode:", error);
        return res.status(500).json({ message: "Error while resending verification code.", error: error.message });
    }
};

// Register user
const registerUser = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ message: "Verification code is required." });
        }

        const { userData, verificationCode } = req.session;
        if (!userData || !verificationCode) {
            return res.status(400).json({ message: "Session expired. Please restart registration." });
        }

        // check code is correct 
        const isVerified = verifyEmail(code, verificationCode);
        if (isVerified !== true) {
            return res.status(400).json({ message: "Invalid verification code.", error: isVerified });
        }

        const { fullName, email, password } = userData;

        // Generate unique username
        let userName = userNameGenerator(fullName);
        while (await User.findOne({ userName })) {
            userName = userNameGenerator(fullName);
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = await User.create({
            fullName,
            email,
            userName,
            password: hashedPassword,
        });

        // create tokens 
        const refreshToken = jsonWebToken.sign(
            { id: newUser._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
        );

        const accessToken = jsonWebToken.sign(
            { id: newUser._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );

        // add token in db 
        newUser.refreshToken = refreshToken;
        await newUser.save();

        const checkUser = await User.findById(newUser._id).select("-password -refreshToken");
        req.session.verificationCode = null;
        req.session.userData = null;

        return res.status(200).json({
            message: "User created successfully.",
            data: checkUser,
            accessToken,
        });
    } catch (error) {
        console.error("Error in registerUser:", error);
        return res.status(500).json({ message: "Error during registration.", error: error.message });
    }
};

// Login the user
const login = async (req, res) => {
    try {
        const { email, userName, password } = req.body;

        // Ensure password and at least one identifier is provided
        if (!password || (!email && !userName)) {
            return res.status(400).json({ message: "Password and either email or username are required." });
        }

        // Use $or to search by email or userName
        const user = await User.findOne({
            $or: [{ email }, { userName }],
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or username." });
        }

        // Verify password
        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Incorrect password." });
        }

        // Generate tokens
        const refreshToken = jsonWebToken.sign(
            { id: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
        );

        const accessToken = jsonWebToken.sign(
            { id: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );

        // Update user's refresh token in the database
        user.refreshToken = refreshToken;
        await user.save();

        // Exclude sensitive fields before sending the response
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
        if (!loggedInUser) {
            return res.status(500).json({ message: "An error occurred while logging in." });
        }

        // Return success response
        return res.status(200).json({ statusCode: 200, message: "User logged in successfully.", data: { loggedInUser, accessToken } });
    } catch (error) {
        console.error("Error logging in the user:", error);
        return res.status(500).json({
            message: "An error occurred while logging in.",
            error: error.message,
        });
    }
};

// logOut the user
const logOut = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(400).json({ message: "User is unauthroized" })
        };

        // delete refreshToken from database 
        await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: "" } })

        // clear cookies 
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken")

        return res.status(200).json({ statusCode: 200, message: "User logOut Successfully" })

    } catch (error) {
        console.log("Something went wrong to logOut the user", error)
    }
}

// login is required  update avatar;
const updateAvatar = async (req, res) => {
    try {
        const userId = req.user._id;

        // check if avatar file is provided
        if (!req.files || !req.files.avatar || req.files.avatar.length === 0) {
            return res.status(400).json({ message: "Avatar file is required" });
        }

        // get avatar file path from req.files
        const avatarPath = req.files.avatar[0].path;

        // check if the user exists
        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        // If user has an existing avatar, clear it
        if (user.avatar.publicId) {
            await removeFileFromCloudinary(user.avatar.publicId);
        }

        // upload avatar to Cloudinary
        const folder = "Multi Vendor/User Avatar"
        const fileUpload = await fileUploadOnCloudinary(avatarPath, folder);

        await User.findByIdAndUpdate(userId, {
            avatar: {
                url: fileUpload.url,
                publicId: fileUpload.public_id,
            }
        });

        return res.status(200).json({
            statusCode: 200,
            data: fileUpload.url,
            message: "Avatar updated successfully"
        });

    } catch (error) {
        console.error("Error updating avatar:", error);
        return res.status(500).json({ message: "Something went wrong while updating the avatar", error: error.message });
    }
}

// login is required
const editProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized user" });
        }

        const { email, fullName, userName } = req.body;
        if (!email || !fullName || !userName) {
            return res.status(400).json({ message: "All fields required" })
        }

        // validate input 
        const validationResult = InputVerifier(req.body);
        if (validationResult !== true) {
            return res.status(400).json({ message: "Invalid input", errors: validationResult });
        }

        // Check if email or username is already in use by another user, excluding the current user
        const checkUser = await User.findOne({
            $or: [{ userName }, { email }],
            _id: { $ne: userId }
        });

        if (checkUser) {
            return res.status(400).json({ message: "Username or email is already taken. Please try another." });
        }

        const currentUser = await User.findById(userId).select("-password -refreshToken");
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if email has changed
        if (currentUser.email !== email) {
            // send code to emial 
            const verificationCode = await sendEmail(email);
            console.log(verificationCode)
            if (!verificationCode) {
                return res.status(500).json({ message: "Failed to send verification code" });
            }
            req.session.verificationCode = verificationCode;
            req.session.userData = req.body;
            return res.status(200).json({ message: "Verification code sent to your email. Please verify." });
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                fullName,
                email,
                userName,
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(500).json({ message: "Failed to update profile. Please try again." });
        }

        return res.status(200).json({ message: "Profile updated successfully", data: updatedUser });

    } catch (error) {
        return res.status(500).json({ message: "An error occurred while updating the profile.", error: error.message });
    }
};

// update profile in db
const updateProfile = async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ message: "Verification code is required." });
        }
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized user" });
        }

        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const { verificationCode, userData } = req.session;
        const isVerified = verifyEmail(code, verificationCode);
        if (!userData || !isVerified) {
            return res.status(400).json({ message: "User data not found in session or verification incomplete. Please complete the edit profile process again." });
        }

        const { fullName, email, userName } = userData;

        // Update the user profile
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                fullName,
                email,
                userName,
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(500).json({ message: "Failed to update profile. Please try again." });
        }

        // Clear session data after update
        req.session.verificationCode = null;
        req.session.userData = null;

        return res.status(200).json({ message: "Profile updated successfully", data: updatedUser });
    } catch (error) {
        console.error("Error in updateProfile:", error);
        return res.status(500).json({ message: "An error occurred while updating the profile.", error: error.message });
    }
};

// get user
const getUser = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user) {
            return res.status(400).json({ message: "User did not exist" })
        };

        return res.status(200).json({ statusCode: 200, data: user, message: "User get Successfully" })

    } catch (error) {
        console.log("something went wrong to get the user", error);
    }
}

const userVerifyJWT = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(400).json({ message: "User did not found" })
        };
        return res.status(200).json({ status: 200, message: "token is valid" })
    } catch (error) {
        return res.status(500).json({ message: "internal server error to verify and edit the shop", error: error })
    }
}

export {
    getUserInfo, resendVerificationCode, editProfile, registerUser, updateProfile, login, logOut,
    getUser, updateAvatar, userVerifyJWT
};