import JWT from "jsonwebtoken";
import { User } from "../Models/User Models/user.model.js";
import {Shops} from "../Models/Admin.model.js"

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "Token is required" });
        }

        const decodedToken = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken) {
            return res.status(403).json({ message: "Token is invalid" });
        }
        const user = await User.findById(decodedToken.userId).select("-password -refreshToken");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized request, user not found" });
        }

        req.user = user;
        next();

    } catch (error) {
        if (error instanceof JWT.JsonWebTokenError) {
            return res.status(403).json({ message: "Invalid token" });
        }
        if (error instanceof JWT.TokenExpiredError) {
            return res.status(403).json({ message: "Token expired" });
        }
        console.error("Error verifying token:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const verify_Admin_JWT = async (req, res, next) => {
    try {
        const token = req.header("token")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "Token is required" });
        }

        const decodedToken = JWT.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET);
        if (!decodedToken) {
            return res.status(403).json({ message: "Token is invalid" });
        }
        const user = await Shops.findById(decodedToken.adminId).select("-password -refreshToken");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized request, user not found" });
        }

        req.admin = user;
        next();

    } catch (error) {
        if (error instanceof JWT.JsonWebTokenError) {
            return res.status(403).json({ message: "Invalid token" });
        }
        if (error instanceof JWT.TokenExpiredError) {
            return res.status(403).json({ message: "Token expired" });
        }
        console.error("Error verifying token:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};