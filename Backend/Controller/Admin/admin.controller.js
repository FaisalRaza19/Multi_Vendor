import jsonWebToken from "jsonwebtoken";
import bcrypt from "bcryptjs"
import { Shops } from "../../Models/Admin.model.js";
import { sendEmail, verifyEmail } from "../../utils/sendAndVeriefyEmail.js"
import { InputVerifier } from "../../utils/InputVerifier.js"
import { fileUploadOnCloudinary } from "../../utils/fileUploadAndRemoveFromCloudinary.js";
import { removeFileFromCloudinary } from "../../utils/fileUploadAndRemoveFromCloudinary.js";

// get shop info 
const RegisterShop = async (req, res) => {
    try {
        const { shopName, shopDescription, phoneNumber, email, password, country, state, city, zipCode, homeAddress } = req.body;

        if (!shopName || !shopDescription || !phoneNumber || !email || !password || !country || !state || !city || !zipCode || !homeAddress) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate input fields
        const validationResult = InputVerifier(req.body);
        if (validationResult !== true) {
            return res.status(400).json({ message: "Invalid input", errors: validationResult });
        }

        // Check if email and phone number already exists
        const existingUser = await Shops.findOne({
            $or: [
                { "personalInfo.email": email },
                { phoneNumber: phoneNumber }
            ]
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email or phone number." });
        }

        // Send OTP to email
        const otpCode = await sendEmail(email);
        console.log(otpCode)
        if (!otpCode) {
            return res.status(500).json({ message: "Failed to send verification code" });
        }

        // Store OTP and admin data in session
        req.session.code = otpCode;
        req.session.adminData = req.body;

        return res.status(200).json({ message: "Verification code sent to your email. Please verify it." });
    } catch (error) {
        console.error("Error in registerShop:", error);
        return res.status(500).json({ message: "Failed to register shop", error: error.message });
    }
};

// resend code on email 
const resendVerificationCode = async (req, res) => {
    try {
        const { admin_data } = req.session;
        if (!admin_data || !admin_data.email) {
            return res.status(400).json({ message: "Session expired or user not found." });
        }

        const verificationCode = await sendEmail(admin_data.email);
        req.session.code = verificationCode;

        return res.status(200).json({ message: "New verification code sent to your email." });
    } catch (error) {
        console.error("Error in resendVerificationCode:", error);
        return res.status(500).json({ message: "Error while resending verification code.", error: error.message });
    }
};

// verify code and create shop in db
const verifyAndCreate = async (req, res) => {
    try {
        const { otp } = req.body;

        if (!otp || otp.length !== 6 || isNaN(otp)) {
            return res.status(400).json({ message: "Invalid OTP. It must be a 6-digit number." });
        }

        const { code, adminData } = req.session;
        if (!code || !adminData) {
            return res.status(400).json({ message: "Session expired. Please register again." });
        }

        // Verify OTP
        const isVerified = verifyEmail(otp, code);
        if (!isVerified) {
            return res.status(400).json({ message: "Invalid verification code." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(adminData.password, 10);
        if (!hashedPassword) {
            return res.status(500).json({ message: "Failed to hash password." });
        }

        // Create shop in the database
        const newShop = await Shops.create({
            personalInfo: {
                email: adminData.email,
                address: {
                    country: adminData.country,
                    state: adminData.state,
                    city: adminData.city,
                    homeAddress: adminData.homeAddress,
                    zipCode: adminData.zipCode,
                }
            },
            password: hashedPassword,
            shopName: adminData.shopName,
            shopDescription: adminData.shopDescription,
            phoneNumber: adminData.phoneNumber,
        });

        // Generate tokens
        const refreshToken = jsonWebToken.sign(
            { id: newShop._id },
            process.env.ADMIN_REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.ADMIN_REFRESH_TOKEN_EXPIRY }
        );

        const accessToken = jsonWebToken.sign(
            { id: newShop._id },
            process.env.ADMIN_ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ADMIN_ACCESS_TOKEN_EXPIRY }
        );

        newShop.refreshToken = refreshToken;
        await newShop.save();

        // Retrieve created shop without sensitive data
        const createdUser = await Shops.findById(newShop._id).select("-password -refreshToken");

        if (!createdUser) {
            return res.status(500).json({ message: "Failed to retrieve created shop." });
        }

        // clear session 
        req.session.code = null;
        req.session.adminData = null;

        return res.status(200).json({
            message: "Shop created successfully.",
            data: { createdUser, accessToken }
        });
    } catch (error) {
        console.error("Error in verifyAndCreateShop:", error);
        return res.status(500).json({ message: "Failed to verify and create shop", error: error.message });
    }
};

//  login into shop
const shopLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!req.body) {
            return res.status(400).json({ message: "all fields are required" })
        }
        // validate input
        const verifyInput = InputVerifier(req.body)
        if (verifyInput !== true) {
            return res.status(400).json({ messages: "Invalid input", error: validateInput })
        };

        // find the user 
        const user = await Shops.findOne({ "personalInfo.email": email });
        if (!user) {
            return res.status(400).json({ messages: "User did not found" });
        }

        // check password
        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword) {
            return res.status(400).json({ message: "Incorrect password." });
        };

        // create tokens 
        const refreshToken = jsonWebToken.sign(
            { id: user._id },
            process.env.ADMIN_REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.ADMIN_REFRESH_TOKEN_EXPIRY }
        );

        const accessToken = jsonWebToken.sign(
            { id: user._id },
            process.env.ADMIN_ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ADMIN_ACCESS_TOKEN_EXPIRY }
        );

        user.refreshToken = refreshToken;
        await user.save();

        // check user log in 
        const userLogin = await Shops.findById(user._id).select("-password -refreshToken");
        if (!userLogin) {
            return res.status(500).json({ message: "An error occurred while logging in." });
        }

        return res.status(200).json({ statusCode: 200, data: { userLogin, accessToken }, message: "user login into the shop Successfully" });
    } catch (error) {
        return res.status(500).json({ message: "internal server error to login the shop", error: error })
    }
}

// update shop logo 
const updateShopLogo = async (req, res) => {
    try {
        const userId = req.admin._id;
        if (!userId) {
            return res.status(400).json({ message: "User did not found" })
        };

        // Check if shopLogo file is provided
        if (!req.files || !req.files.shopLogo || req.files.shopLogo.length === 0) {
            return res.status(400).json({ message: "shopLogo file is required" });
        }

        // Get shopLogo file path from req.files
        const shopLogo = req.files.shopLogo[0].path;

        // Check if the Shop exists
        const shop = await Shops.findById(userId).select("-password -refreshToken");
        if (!shop) {
            return res.status(404).json({ message: "User does not exist" });
        }

        // Upload shopLogo to Cloudinary
        const folder = "Multi Vendor/Shop Logos"
        const fileUpload = await fileUploadOnCloudinary(shopLogo, folder);

        // If the shop has an existing shopLogo, clear it
        if (shop.shopLogo.publicId) {
            await removeFileFromCloudinary(shop.shopLogo.publicId);
        }

        // Update the shop's shopLogo with the new image
        shop.shopLogo.url = fileUpload.url;
        shop.shopLogo.publicId = fileUpload.public_id,
            await shop.save();

        return res.status(200).json({
            statusCode: 200,
            data: fileUpload.url,
            message: "Shop logo updated successfully"
        });

    } catch (error) {
        console.error("Error updating shop logo:", error);
        return res.status(500).json({ message: "Something went wrong while updating the shop logo", error: error.message });
    }
};

// logout into the shop 
const shopLogOut = async (req, res) => {
    try {
        const userId = req.admin._id;
        if (!userId) {
            return res.status(400).json({ message: "User did not found" })
        };

        // find the shop 
        const shop = await Shops.findByIdAndUpdate(userId, { $set: { refreshToken: "" } })
        if (!shop) {
            return res.status(404).json({ message: "User does not exist" });
        }

        // clear cookies 
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken")

        return res.status(200).json({ statusCode: 200, message: "User logOut to the Shop Successfully" })
    } catch (error) {
        return res.status(500).json({ message: "internal server error to logOut the shop", error: error })
    }
}

// get Shop 
const getShop = async (req, res) => {
    try {
        const userId = req.admin._id;
        if (!userId) {
            return res.status(400).json({ message: "User did not found" })
        };

        // find the shop 
        const shop = await Shops.findOne(userId).select("-refreshToken -password")
        if (!shop) {
            return res.status(404).json({ message: "User does not exist" });
        }

        return res.status(200).json({ statusCode: 200, data: { shop }, message: "Shop get Successfully" })
    } catch (error) {
        return res.status(500).json({ message: "internal server error to logOut the shop", error: error })
    }
}

// edit shop 
const editShop = async (req, res) => {
    try {
        const userId = req.admin._id;
        if (!userId) {
            return res.status(400).json({ message: "User did not found" })
        };

        const { shopName, shopDescription, phoneNumber, email, country, state, city, zipCode, homeAddress } = req.body;
        if (!shopName || !shopDescription || !phoneNumber || !email || !country || !state || !city || !zipCode || !homeAddress) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate input fields
        const validationResult = InputVerifier(req.body);
        if (validationResult !== true) {
            return res.status(400).json({ message: "Invalid input", errors: validationResult });
        }

        // find the shop 
        const shop = await Shops.findOne(userId).select("-refreshToken -password")
        if (!shop) {
            return res.status(404).json({ message: "User does not exist" });
        }

        // check email is change 
        if (shop.personalInfo.email !== email) {
            // send code to email
            const otpCode = await sendEmail(email);
            console.log(otpCode)
            if (!otpCode) {
                return res.status(500).json({ message: "Failed to send verification code" });
            }

            req.session.code = otpCode;
            req.session.adminData = req.body
            return res.status(200).json({ statusCode: 200,message: "OTP send to your new email please verify it." })
        }

        const editShop = await shop.updateOne({
            "personalInfo.address": {
                country,
                state,
                city,
                homeAddress,
                zipCode,
            },
            shopName,
            phoneNumber,
            shopDescription,
        })

        if (!editShop) {
            return res.status(500).json({ message: "Failed to update profile. Please try again." });
        }
        return res.status(200).json({ statusCode: 200, data: { editShop }, message: "Shop edit Successfully" })
    } catch (error) {
        return res.status(500).json({ message: "internal server error to edit the shop", error: error })
    }
}

// verfiy email and edit the shop
const verifyAndEdit = async (req, res) => {
    try {
        const { otp } = req.body;
        if (!otp || otp.length !== 6 || isNaN(otp)) {
            return res.status(400).json({ message: "Invalid OTP. It must be a 6-digit number." });
        }
        const userId = req.admin._id;
        if (!userId) {
            return res.status(400).json({ message: "User did not found" })
        };
        const { code, adminData } = req.session;
        if (!code || !adminData) {
            return res.status(400).json({ message: "Session expired. Please register again." });
        }

        // Verify OTP
        const isVerified = verifyEmail(otp, code);
        if (!isVerified) {
            return res.status(400).json({ message: "Invalid verification code." });
        }

        // find shop 
        const shop = await Shops.findOne(userId).select("-refreshToken -password")
        if (!shop) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const editShop = await shop.updateOne({
            "personalInfo": {
                email: adminData.email,
                adress: {
                    country: adminData.country,
                    state: adminData.state,
                    city: adminData.city,
                    homeAddress: adminData.homeAddress,
                    zipCode: adminData.zipCode,
                }
            },
            shopName: adminData.shopName,
            phoneNumber: adminData.phoneNumber,
            shopDescription: adminData.shopDescription,
        })

        if (!editShop) {
            return res.status(500).json({ message: "Failed to update profile. Please try again." });
        }

        // clear session 
        req.session.code = null;
        req.session.adminData = null;
        
        return res.status(200).json({ statusCode: 200, data: { editShop }, message: "Shop edit Successfully" })
    } catch (error) {
        return res.status(500).json({ message: "internal server error to verify and edit the shop", error: error })
    }
}

export { RegisterShop, resendVerificationCode, verifyAndCreate, shopLogin, updateShopLogo, shopLogOut, getShop,editShop,verifyAndEdit}