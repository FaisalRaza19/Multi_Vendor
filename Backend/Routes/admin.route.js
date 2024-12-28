import { Router } from "express";
import { shopAdmin,resendCodeToNumber, registerShop, getShop, updateShopLogo, editShop,updateShop} from "../Controller/Admin/admin.controller.js";
import { addProduct, getProduct, editProduct, deleteProduct } from "../Controller/Admin/addProduct.controller.js";
import { verifyJWT } from "../Middleware/verifyJWT.js"
import { upload } from "../Middleware/Multer.js"
export const route = Router();

// get information and send code on number route
route.route("/shop-info").post(verifyJWT, upload.none(), shopAdmin)
// resend code route
route.route("/resend-code").post(verifyJWT, resendCodeToNumber)
// register shop 
route.route("/register-shop").post(verifyJWT, upload.none(), registerShop)
// edit shop 
route.route("/edit-shop").post(verifyJWT, upload.none(), editShop)
// update shop 
route.route("/verify-update-shop").post(verifyJWT,upload.none(),updateShop)
// update shop logo 
route.route("/shop-logo").post(verifyJWT, upload.fields([
    {
        name: "shopLogo",
        maxCount: 1,
    }
]), updateShopLogo)
// get shop route
route.route("/get-shop").get(verifyJWT, getShop)
// add product route
route.route("/add-product").post(verifyJWT, upload.fields([
    {
        name: "productImage",
        maxCount: 1,
    }
]), addProduct)
// get product
route.route("/get-product").post(upload.none(), getProduct);
// edit product 
route.route("/edit-product").post(verifyJWT, upload.fields([
    {
        name: "productImage",
        maxCount: 1,
    }
]), editProduct)
// delete product 
route.route("/del-product").delete(verifyJWT, upload.none(), deleteProduct);