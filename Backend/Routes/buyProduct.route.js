import {Router} from "express";
import {createOrder} from "../Controller/User/buyProduct.controller.js";
import {updateStatus} from "../Controller/Admin/order.controller.js"
import { verifyJWT,verify_Admin_JWT} from "../Middleware/verifyJWT.js"
import { upload } from "../Middleware/Multer.js"

export const buyProduct = Router();

buyProduct.route("/checkOut").post(verifyJWT, upload.none(),createOrder);
buyProduct.route("/change-status/:shopId").post(verify_Admin_JWT,upload.none(),updateStatus)