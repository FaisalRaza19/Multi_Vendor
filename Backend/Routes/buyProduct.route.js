import {Router} from "express";
import {addToCart, checkOut} from "../Controller/User/buyProduct.controller.js";
import { verifyJWT } from "../Middleware/verifyJWT.js"
import { upload } from "../Middleware/Multer.js"

export const buyProduct = Router();

buyProduct.route("/addToCart").post(verifyJWT,upload.none(),addToCart);
buyProduct.route("/checkOut").post(verifyJWT, upload.none(),checkOut);