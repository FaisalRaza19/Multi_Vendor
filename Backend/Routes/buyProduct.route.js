import {Router} from "express";
import {createOrder} from "../Controller/User/buyProduct.controller.js";
import { verifyJWT } from "../Middleware/verifyJWT.js"
import { upload } from "../Middleware/Multer.js"

export const buyProduct = Router();

buyProduct.route("/checkOut").post(verifyJWT, upload.none(),createOrder);