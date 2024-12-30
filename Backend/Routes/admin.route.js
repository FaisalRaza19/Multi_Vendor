import { Router } from "express";
import { RegisterShop, verifyAndCreate,shopLogin, updateShopLogo,shopLogOut,getShop,editShop,verifyAndEdit } from "../Controller/Admin/admin.controller.js"
// import { addProduct, getProduct, editProduct, deleteProduct } from "../Controller/Admin/addProduct.controller.js";
import { verify_Admin_JWT } from "../Middleware/verifyJWT.js"
import { upload } from "../Middleware/Multer.js"
export const route = Router();

route.route("/shop-register").post(upload.none(), RegisterShop);
route.route("/shop-verify").post(upload.none(), verifyAndCreate);
route.route("/shop-login").post(upload.none(), shopLogin);
route.route("/shop-EditLogo").post(verify_Admin_JWT, upload.fields([{
    name: "shopLogo",
    maxCount: 1,
}]), updateShopLogo);
route.route("/shop-logOut").post(verify_Admin_JWT,upload.none(), shopLogOut);
route.route("/shop-get").get(verify_Admin_JWT,upload.none(), getShop);
route.route("/shop-edit").post(verify_Admin_JWT,upload.none(), editShop);
route.route("/shop-Verify-edit").post(verify_Admin_JWT,upload.none(),verifyAndEdit);

// const a = {
// // add product route
// route.route("/add-product").post(verifyJWT, upload.fields([
//     {
//         name: "productImage",
//         maxCount: 1,
//     }
// ]), addProduct)
// // get product
// route.route("/get-product").post(upload.none(), getProduct);
// // edit product
// route.route("/edit-product").post(verifyJWT, upload.fields([
//     {
//         name: "productImage",
//         maxCount: 1,
//     }
// ]), editProduct)
// // delete product
// route.route("/del-product").delete(verifyJWT, upload.none(), deleteProduct);
// }

