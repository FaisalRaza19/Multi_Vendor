import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema(
    {
        user: {
            type: Object,
            required: true,
        },
        seller: {
            type: Object,
            required: true,
        },
        messages: [{
            sender: {
                type: String,
                required: true,
            },
            message: String,
            image: {
                public_Id: {
                    type: String
                },
                url: {
                    type: String,
                }
            },
            timestamp: {
                type: Date,
                default: Date.now

            },
            edited: {
                type: Boolean,
                default: false
            }
        }]
    },
    {
        timestamps: true
    }
);


export const Chat = mongoose.model('Chat', ChatSchema);