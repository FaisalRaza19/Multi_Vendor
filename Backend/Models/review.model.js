import mongoose, { Schema } from "mongoose";

export const productReview = new mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            required: true,
            index: true,
        },
        likes: {
            userId : [{
                type : Schema.Types.ObjectId,
                ref : "User",
                default : null
            }],
            totalLikes : {
                type : Number,
                default : 0,
            }
        },
        unLikes: {
            userId : [{
                type : Schema.Types.ObjectId,
                ref : "User",
                default : null
            }],
            totalUnLikes : {
                type : Number,
                default : 0,
            }
        },
    },
    {
        timestamps: true,
    }
)