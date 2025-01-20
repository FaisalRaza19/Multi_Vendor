import mongoose from "mongoose";

export const couponSchema = new mongoose.Schema(
    {
        couponName: {
            type: String,
            required: true,
        },
        value: {
            type: Number,
            required: true,
        },
        shopInfo: {
            type: Object,
            required: true,
        },
        expirationDate: {
            type: Date,
            required: true
        },
        product: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)