import mongoose, { Schema } from "mongoose";
import { BankAccountSchema } from "./bank.model.js";
import { addProduct } from "./addProductModel.js";
import { orderSchema } from "./Orders.model.js"

const adminSchema = new mongoose.Schema(
    {
        personalInfo: {
            email: {
                type: String,
                required: true,
                index: true,
                unique: true,
                lowercase: true,
            },
            address: {
                country: {
                    type: String,
                    required: true,
                },
                state: {
                    type: String,
                    required: true,
                },
                city: {
                    type: String,
                    required: true,
                },
                homeAddress: {
                    type: String,
                    required: true,
                    index: true,
                },
                zipCode: {
                    type: String,
                    required: true,
                },
            },
        },
        shopName: {
            type: String,
            required: true,
            index: true,
            trim: true,
        },
        shopDescription : {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
        },
        shopLogo: {
            url: {
                type: String,
                default: "",
            },
            publicId: {
                type: String,
                default: "",
            }
        },
        bankDetails: {
            type: BankAccountSchema,
        },
        products: [addProduct],
        Orders: [orderSchema],
        completedOrder: [
            {
                type: Schema.Types.ObjectId,
                ref: "Order",
            },
        ],
        refreshToken: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

export const Shops = mongoose.model("Shops", adminSchema);