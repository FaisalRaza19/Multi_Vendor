import { Router } from "express";
import {
    RegisterShop, verifyAndCreate, resendVerificationCode, shopLogin, updateShopLogo, shopLogOut,
    getShop, editShop, verifyAndEdit, verifyJWT
} from "../Controller/Admin/admin.controller.js"
import { addProduct, getProduct, admin_getProduct, editProduct, deleteProduct } from "../Controller/Admin/product.controller.js";
import { addEvent, getEvent, editEvent, get_AdminEvent, deleteEvent } from "../Controller/Admin/events.controller.js"
import { verify_Admin_JWT } from "../Middleware/verifyJWT.js"
import { upload } from "../Middleware/Multer.js"
export const route = Router();

route.route("/shop-register").post(upload.none(), RegisterShop);
route.route("/shop-verify").post(upload.none(), verifyAndCreate);
route.route("/shop-resendCode").post(upload.none(), resendVerificationCode);
route.route("/shop-login").post(upload.none(), shopLogin);
route.route("/shop-EditLogo").post(verify_Admin_JWT, upload.fields([{
    name: "shopLogo",
    maxCount: 1,
}]), updateShopLogo);
route.route("/shop-logOut").post(verify_Admin_JWT, upload.none(), shopLogOut);
route.route("/shop-get").get(verify_Admin_JWT, upload.none(), getShop);
route.route("/shop-edit").post(verify_Admin_JWT, upload.none(), editShop);
route.route("/shop-Verify-edit").post(verify_Admin_JWT, upload.none(), verifyAndEdit);
route.route("/shop-VerifyJWT").post(verify_Admin_JWT, upload.none(), verifyJWT);

//   add products routes
route.route("/shop-addProduct").post(verify_Admin_JWT, upload.fields([{
    name: "productImages",
    maxCount: 4,
}]), addProduct);
route.route("/shop-getProduct").get(upload.none(), getProduct);
route.route("/shop-adminProduct").get(verify_Admin_JWT, upload.none(), admin_getProduct);
route.route("/shop-editProduct").post(verify_Admin_JWT, upload.fields([{
    name: "productImages",
    maxCount: 4,
}]), editProduct);
route.route("/shop-delProduct").delete(verify_Admin_JWT, upload.none(), deleteProduct);


// events routes
route.route("/shop-addEvent").post(verify_Admin_JWT, upload.fields([{
    name: "productImages",
    maxCount: 4,
}]), addEvent)
route.route("/shop-editEvent").post(verify_Admin_JWT, upload.fields([{
    name: "eventImages",
    maxCount: 4,
}]), editEvent)
route.route("/shop-getEvent").get(upload.none(), getEvent);
route.route("/shop-adminEvent").get(verify_Admin_JWT, upload.none(), get_AdminEvent);
route.route("/shop-delEvent").delete(verify_Admin_JWT, upload.none(), deleteEvent);
