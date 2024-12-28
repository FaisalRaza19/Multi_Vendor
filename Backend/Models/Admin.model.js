import mongoose, { Schema } from "mongoose";
import { BankAccountSchema } from "./bank.model.js";
import { addProduct } from "./addProductModel.js";
import {orderSchema} from "./Orders.model.js"

const adminSchema = new mongoose.Schema(
    {
        personalInfo: {
            userId: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
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
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
        },
        shopLogo : {
            url : {
                type : String,
                default : "",
            },
            publicId : {
                type : String,
                default : "",
            }
        },
        bankDetails: {
            type: BankAccountSchema,
            required: true,
        },
        products: [addProduct],
        Orders : [orderSchema],
        completedOrder: [
            {
                type: Schema.Types.ObjectId,
                ref: "Order",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Shops = mongoose.model("Shops", adminSchema);