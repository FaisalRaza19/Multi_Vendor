import { sendOTP, verifyOTP } from "../../utils/phoneVerify.js";
import { Shops } from "../../Models/Admin.model.js";
import { User } from "../../Models/user.model.js";
import { fileUploadOnCloudinary } from "../../utils/fileUploadAndRemoveFromCloudinary.js";
import { removeFileFromCloudinary } from "../../utils/fileUploadAndRemoveFromCloudinary.js";
import IBAN from "iban";
import CryptoJS from "crypto-js";

// Encryption function
function encryptNumber(number, secretKey) {
    return CryptoJS.AES.encrypt(number.toString(), secretKey).toString();
}

// Decryption function
function decryptNumber(encrypted, secretKey) {
    const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

// validate input fields
const validateShopDetails = ({ shopName, phoneNumber, bankName, accountHolderName, country, state, city, homeAddress, zipCode, }) => {
    const errors = [];

    // Validate shopName (minimum 3 characters)
    if (!shopName || shopName.trim().length < 3) {
        errors.push("Shop name must be at least 3 characters.");
    }

    // Validate phoneNumber (10-15 digits, allow spaces, dashes, or parentheses)
    if (!phoneNumber || !/^\+?[0-9]{10,15}$/.test(phoneNumber)) {
        errors.push("Phone number must be between 10 and 15 digits and can optionally start with '+'.");
    }

    // Validate bankName (minimum 3 characters)
    if (!bankName || bankName.trim().length < 3) {
        errors.push("Bank name must be at least 3 characters.");
    }

    // Validate accountHolderName (only letters and spaces, minimum 3 characters)
    if (
        !accountHolderName ||
        !/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/.test(accountHolderName.trim()) ||
        accountHolderName.trim().length < 3
    ) {
        errors.push("Account holder name must be at least 3 characters and contain only letters and spaces.");
    }

    // Validate country (minimum 3 characters)
    if (!country || country.trim().length < 3) {
        errors.push("Country must be at least 3 characters.");
    }

    // Validate state (minimum 3 characters)
    if (!state || state.trim().length < 3) {
        errors.push("State must be at least 3 characters.");
    }

    // Validate city (minimum 3 characters)
    if (!city || city.trim().length < 3) {
        errors.push("City must be at least 3 characters.");
    }

    // Validate homeAddress (minimum 5 characters)
    if (!homeAddress || homeAddress.trim().length < 5) {
        errors.push("Home address must be at least 5 characters.");
    }

    // Validate zipCode (numeric, or alphanumeric based on format, e.g., US ZIP code)
    if (!zipCode || !/^\d{5}(-\d{4})?$/.test(zipCode.trim())) {
        errors.push("ZIP code must be a valid US ZIP code (e.g., 12345 or 12345-6789).");
    }

    return errors;
}

// Get information and send code
const shopAdmin = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ message: "User does not exist." });
        }

        // Check for encryption key
        const secretKey = process.env.SECRET_KEY;
        if (!secretKey) {
            return res.status(500).json({ message: "Encryption key not found." });
        }

        const { shopName, phoneNumber, bankName, accountHolderName, accountNumber, country, state, city, homeAddress, zipCode } = req.body;

        // Validate input fields
        const errors = validateShopDetails({
            shopName, phoneNumber, bankName, accountHolderName, country, state, city, homeAddress, zipCode
        });

        if (errors.length) {
            return res.status(400).json({ message: "Validation error.", errors });
        }

        if (!IBAN.isValid(accountNumber)) {
            return res.status(400).json({ message: "account number is invalid." });
        }

        // send otp code 
        const otpResponse = await sendOTP(phoneNumber);
        if (otpResponse.error) {
            return res.status(500).json({ message: "Failed to send OTP." });
        }
        console.log(otpResponse.code);

        const encryptedAccountNumber = encryptNumber(accountNumber, secretKey);

        req.session.bankDetails = { bankName, accountHolderName, encryptedAccountNumber };
        req.session.userData = { userId: userId._id, shopName, phoneNumber };
        req.session.code = otpResponse.code;
        req.session.address = { country, state, city, homeAddress, zipCode };

        return res.status(200).json({ message: "Otp send to your phone number" });
    } catch (error) {
        console.error("Error in getShop:", error);
        return res.status(500).json({
            message: "Something went wrong while retrieving the shop.",
            error: error.message,
        });
    }
};

// resend code to number 
const resendCodeToNumber = async (req, res) => {
    try {
        const { userData } = req.session;
        if (!userData) {
            return res.status(400).json({ message: "session is expire please try again." })
        }

        // send code to number
        const otpResponse = await sendOTP(phoneNumber);
        if (otpResponse.error) {
            return res.status(500).json({ message: "Failed to send OTP." });
        }
        console.log(otpResponse.code);

        req.session.code = otpResponse.code;
        return res.status(400).json({ message: "OTP send to your phone number please verify it" });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong while retrieving the shop.",
            error: error.message,
        });
    }
}

// add shop in data base 
const registerShop = async (req, res) => {
    try {
        const { otpCode } = req.body;
        if (!otpCode) {
            return res.status(400).json({ message: "verification code is required." })
        }
        const { bankDetails, userData, address, code } = req.session;
        // check code 
        const isValid = verifyOTP(otpCode, code)
        if (!isValid || !bankDetails || !userData || !address) {
            return res.status(400).json({ message: "Shop data not found in session. Please complete the Shop registration process again." })
        }
        const { bankName, accountHolderName, encryptedAccountNumber } = req.session.bankDetails;
        const { userId, shopName, phoneNumber } = req.session.userData;
        const { country, state, city, homeAddress, zipCode } = req.session.address;

        // Create new shop
        const newShop = await Shops.create({
            personalInfo: {
                userId,
                address: {
                    country,
                    state,
                    city,
                    homeAddress,
                    zipCode,
                },
            },
            shopName,
            phoneNumber,
            bankDetails: { bankName, accountHolderName, encryptedAccountNumber },
        });

        // Clear session data
        req.session.bankDetails = null;
        req.session.userData = null;
        req.session.code = null;
        req.session.address = null;

        return res.status(200).json({
            message: "Shop created successfully.",
            data: newShop,
        });
    } catch (error) {
        return res.status(500).json({ message: "something went wrong to register shop", error: error })
    }
}

// get shop 
const getShop = async (req, res) => {
    try {
        // Ensure user is authenticated
        const userId = req.user?._id;
        if (!userId) {
            return res.status(404).json({ message: "User not authenticated" });
        }

        // Verify encryption key is set
        const secretKey = process.env.SECRET_KEY;
        if (!secretKey) {
            return res.status(500).json({ message: "Encryption key not found." });
        }

        // Fetch shop details, excluding sensitive fields
        const shop = await Shops.findOne({ "personalInfo.userId": userId }).select("-personalInfo -phoneNumber");

        // Return 404 if shop not found
        if (!shop) {
            return res.status(404).json({ message: "Shop not found." });
        }

        const { bankDetails } = shop;
        let decryptedNumber = null;

        // Decrypt account number if available
        if (bankDetails?.encryptedAccountNumber) {
            decryptedNumber = decryptNumber(bankDetails.encryptedAccountNumber, secretKey);
        }

        // Return shop data with decrypted bank details
        return res.status(200).json({
            statusCode: 200,
            data: shop,
            bankDetails: {
                holderName: bankDetails?.accountHolderName,
                bankName: bankDetails?.bankName,
                accountNumber: decryptedNumber,
            },
            message: "Shop retrieved successfully.",
        });

    } catch (error) {
        console.error("Error in getShop:", error);
        return res.status(500).json({
            message: "Something went wrong while retrieving the shop.",
            error: error.message,
        });
    }
};

// update shop logo 
const updateShopLogo = async (req, res) => {
    try {
        // Get user id from req.user
        const userId = req.user._id;

        // Check if shopLogo file is provided
        if (!req.files || !req.files.shopLogo || req.files.shopLogo.length === 0) {
            return res.status(400).json({ message: "shopLogo file is required" });
        }

        // Get shopLogo file path from req.files
        const shopLogo = req.files.shopLogo[0].path;

        // Check if the user exists
        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        // Find the shop associated with the user
        const shop = await Shops.findOne({ "personalInfo.userId": userId });
        if (!shop) {
            return res.status(404).json({ message: "Shop not found for this user" });
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

// edit shop
const editShop = async (req, res) => {
    try {
        // Check for authenticated user
        const userId = req.user?._id;
        if (!userId) {
            return res.status(400).json({ message: "User does not exist." });
        }

        // Check for encryption key
        const secretKey = process.env.SECRET_KEY;
        if (!secretKey) {
            return res.status(500).json({ message: "Encryption key not found." });
        }

        const { shopName, phoneNumber, bankName, accountHolderName, accountNumber, country, state, city, homeAddress, zipCode } = req.body;

        // Validate input fields
        const errors = validateShopDetails({
            shopName, phoneNumber, bankName, accountHolderName, country, state, city, homeAddress, zipCode
        });

        if (errors.length) {
            return res.status(400).json({ message: "Validation error.", errors });
        }


        if (!IBAN.isValid(accountNumber)) {
            return res.status(400).json({ message: "Please enter a valid account number (IBAN)." });
        }

        const encryptedNumber = encryptNumber(accountNumber, secretKey);

        // Retrieve the existing shop data
        const existingShop = await Shops.findOne({ "personalInfo.userId": userId }).select("phoneNumber");

        // Check if phone number has changed
        if (existingShop.phoneNumber !== phoneNumber) {
            const otpResponse = await sendOTP(phoneNumber);
            if (otpResponse.error) {
                return res.status(500).json({ message: "Failed to send OTP." });
            }
            console.log(otpResponse.code)
            req.session.code = otpResponse.code;
            req.session.isValid = false;
        } else {
            const shop = await Shops.findOne({ "personalInfo.userId": userId })
            if (!shop) {
                return res.status(404).json({ message: "User does not exist" });
            }
            const updatedShop = await shop.updateOne({
                shopName,
                phoneNumber,
                bankDetails: {
                    bankName,
                    accountHolderName,
                    encryptedAccountNumber: accountNumber,
                },
                "personalInfo.address": {
                    country,
                    state,
                    city,
                    homeAddress,
                    zipCode,
                },
            });

            if (!updatedShop) {
                return res.status(500).json({ message: "Failed to update profile. Please try again." });
            }

            return res.status(200).json({ message: "Profile updated successfully", data: updatedShop});
        }

        // Save shop data in session for later update
        req.session.shopData = { shopName, phoneNumber, bankName, accountHolderName, accountNumber: encryptedNumber, country, state, city, homeAddress, zipCode };

        return res.status(200).json({ message: "OTP send to your phone Number please verify it." });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong while editing 123 shop", error });
    }
};

// update shop in db
const updateShop = async (req, res) => {
    try {
        const {otpCode} = req.body;
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized user" });
        }

        const shop = await Shops.findOne({ "personalInfo.userId": userId })
        if (!shop) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const { code, shopData } = req.session;
        if (code !== null) {
            const isValid = verifyOTP(code, otpCode)
            if (!shopData || !isValid) {
                return res.status(400).json({ message: "User data not found in session or verification incomplete. Please complete the edit profile process again." });
            }

            const { shopName, phoneNumber, bankName, accountHolderName, accountNumber, country, state, city, homeAddress, zipCode } = shopData;

            // Update the user profile
            const updatedShop = await shop.updateOne({
                shopName,
                phoneNumber,
                bankDetails: {
                    bankName,
                    accountHolderName,
                    encryptedAccountNumber: accountNumber,
                },
                "personalInfo.address": {
                    country,
                    state,
                    city,
                    homeAddress,
                    zipCode,
                },
            });

            if (!updatedShop) {
                return res.status(500).json({ message: "Failed to update profile. Please try again." });
            }

            // Clear session data after update
            req.session.code = null;
            req.session.shopData = null;
            req.session.isValid = null;

            return res.status(200).json({ message: "Profile updated successfully", data: updatedShop });
        }
    } catch (error) {
        return res.status(500).json({ message: "something went wrong to update shop", error: error })
    }
}

export { shopAdmin, resendCodeToNumber, registerShop, getShop, updateShopLogo, editShop, updateShop };