import { Router } from "express";
import {createAccount,middleAccount,givePayment,takePayment,deleteAccount} from "../Controller/Payment/payment.js"
import {verify_Admin_JWT,verifyJWT} from "../Middleware/verifyJWT.js"
import { upload } from "../Middleware/Multer.js"
export const payment = Router();


payment.route("/create-account").post(upload.none(),verifyJWT,createAccount);
payment.route("/create-middleAccount").post(upload.none(),middleAccount);
payment.route("/give-payment").post(upload.none(),verifyJWT,givePayment);
payment.route("/take-payment").post(upload.none(),verify_Admin_JWT,takePayment);
payment.route("/del-account").delete(upload.none(),verifyJWT,deleteAccount);