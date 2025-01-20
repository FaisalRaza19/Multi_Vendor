import mongoose from "mongoose";

export const orderSchema = new mongoose.Schema(
    {
        items: {
            type: Array,
            required: true,
        },
        shippingAddress: {
            type: Object,
            required: true,
        },
        user: {
            type: Object,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            default: "Processing",
        },
        paymentInfo: {
            id: {
                type: String,
            },
            status: {
                type: String,
            },
            type: {
                type: String,
            },
        },
        paidAt: {
            type: Date,
            default: Date.now(),
        },
        deliveredAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);