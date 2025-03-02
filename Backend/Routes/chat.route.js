import { Router } from "express";
import { verifyJWT, verify_Admin_JWT } from "../Middleware/verifyJWT.js";
import { userCreateChat, sellerCreateChat, sendMessage, editMessage, user_getChats, seller_getChats, deleteMessage } from "../Controller/Chat/chat.js";
import { upload } from "../Middleware/Multer.js";
export const chat = Router();


chat.route("/user-createChat").post(verifyJWT, upload.none(), userCreateChat);
chat.route("/seller-createChat").post(verify_Admin_JWT, upload.none(), sellerCreateChat);
chat.route("/send-message").post(upload.fields([
    {
        name: "images",
        maxCount: 1
    }
]), sendMessage);
chat.route("/edit-message").post(upload.none(), editMessage);
chat.route("/user-getChat").get(verifyJWT, user_getChats);
chat.route("/seller-getChat").get(verify_Admin_JWT, seller_getChats);
chat.route("/del-message").delete(upload.none(), deleteMessage);

