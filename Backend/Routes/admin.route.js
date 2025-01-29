import { Router } from "express";
import {
    RegisterShop, verifyAndCreate, resendVerificationCode, shopLogin, updateShopLogo, shopLogOut,
    getShop,admin_getShop, editShop, verifyAndEdit, verifyJWT
} from "../Controller/Admin/admin.controller.js"
import { addProduct, get_allProduct, getProduct, editProduct, deleteProduct } from "../Controller/Admin/product.controller.js";
import { addEvent, getAllEvent, editEvent, getEvent, deleteEvent } from "../Controller/Admin/events.controller.js";
import {createCoupon,deleteCoupon} from "../Controller/Admin/cuppons.controller.js"
import { verify_Admin_JWT } from "../Middleware/verifyJWT.js"
import { upload } from "../Middleware/Multer.js"
export const route = Router();

// register shop 
route.route("/shop-register").post(upload.none(), RegisterShop);
// verify otp and create shop 
route.route("/shop-verify").post(upload.none(), verifyAndCreate);
// resend code to the email
route.route("/shop-resendCode").post(upload.none(), resendVerificationCode);
// login the shop
route.route("/shop-login").post(upload.none(), shopLogin);
// edit shop logo
route.route("/shop-EditLogo").post(verify_Admin_JWT, upload.fields([{
    name: "shopLogo",
    maxCount: 1,
}]), updateShopLogo);
// logOut the shop
route.route("/shop-logOut").post(verify_Admin_JWT, upload.none(), shopLogOut);
// get shop witout token but shop id is required
route.route("/get-shop/:id").get(getShop);
// get shop witout token but shop id is required
route.route("/admin-getShop/:shopId").get(verify_Admin_JWT,admin_getShop);
// edit the shop
route.route("/shop-edit").post(verify_Admin_JWT, upload.none(), editShop);
// verify new edited email
route.route("/shop-Verify-edit").post(verify_Admin_JWT, upload.none(), verifyAndEdit);
// verify token
route.route("/shop-VerifyJWT").post(verify_Admin_JWT, upload.none(), verifyJWT);

// products routes

// add product
route.route("/shop-addProduct").post(verify_Admin_JWT, upload.fields([{
    name: "productImages",
    maxCount: 4,
}]), addProduct);
// get all products present in shop collection in mongo db
route.route("/shop-getAllProduct").get(upload.none(), get_allProduct);
// get only one product through product :id
route.route("/shop-getProduct/:productId").get(getProduct);
// edit product
route.route("/shop-editProduct").post(verify_Admin_JWT, upload.fields([{
    name: "productImages",
    maxCount: 4,
}]), editProduct);
// delete product
route.route("/shop-delProduct").delete(verify_Admin_JWT, upload.none(), deleteProduct);


// events routes

// add event
route.route("/shop-addEvent").post(verify_Admin_JWT, upload.fields([{
    name: "productImages",
    maxCount: 4,
}]), addEvent)
// edit event
route.route("/shop-editEvent").post(verify_Admin_JWT, upload.fields([{
    name: "eventImages",
    maxCount: 4,
}]), editEvent)
// get all events of every shop present in shop collection in mongo db
route.route("/shop-getAllEvent").get(upload.none(), getAllEvent);
// get only one event through :id
route.route("/shop-getEvent/:eventId").get(getEvent);
// delete event
route.route("/shop-delEvent").delete(verify_Admin_JWT, upload.none(), deleteEvent);


// copouns route
route.route("/create-copoun").post(verify_Admin_JWT, upload.none(), createCoupon);
route.route("/delete-copoun").delete(verify_Admin_JWT, upload.none(), deleteCoupon);
