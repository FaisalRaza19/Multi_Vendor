import mongoose, { Schema } from "mongoose";
import { orderSchema } from "./Orders.model.js";
import { BankAccountSchema } from "./bank.model.js";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            index: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            index: true,
            unique: true,
            lowercase: true,
        },
        userName: {
            type: String,
            required: true,
            index: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            index: true,
        },
        orders: [orderSchema],
        bankDetails: {
            type: BankAccountSchema,
        },
        favouriteList: [{
            type: Schema.Types.ObjectId,
            ref: "AddProduct",
            default: [],
            index: true,
        }],
        avatar: {
            url: {
                type: String,
                default: "",
            },
            publicId: {
                type: String,
                default: "",
            }
        },
        refreshToken: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
)

export const User = mongoose.model("User", userSchema);