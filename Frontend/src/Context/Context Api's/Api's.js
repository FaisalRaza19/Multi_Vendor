const port = 5698;
export const api = {
    // user api
    register: `http://localhost:${port}/user/register`,
    codeVerify: `http://localhost:${port}/user/verify-register`,
    ResendCode: `http://localhost:${port}/user//resend-code`,
    getUser: `http://localhost:${port}/user/getUser`,
    verifyJWT: `http://localhost:${port}/user/verifyJWT`,
    login: `http://localhost:${port}/user/login`,
    avatar: `http://localhost:${port}/user/avatar`,
    editProfile: `http://localhost:${port}/user/edit-profile`,
    verifyProfile: `http://localhost:${port}/user/verify-update-profile`,
    LogOut: `http://localhost:${port}/user/logOut`,

    // shop admin api's
    registerShop: `http://localhost:${port}/admin/shop-register`,
    shopVerify: `http://localhost:${port}/admin/shop-verify`,
    resendCode: `http://localhost:${port}/admin/shop-resendCode`,
    ShopLogin: `http://localhost:${port}/admin/shop-login`,
    // get shop through token and id 
    getShop: `http://localhost:${port}/admin/admin-getShop`,
    // get shop through id 
    userGetShop: `http://localhost:${port}/admin/get-shop`,
    editShopLogo: `http://localhost:${port}/admin/shop-EditLogo`,
    editShopProfile: `http://localhost:${port}/admin/shop-edit`,
    verifyShopProfile: `http://localhost:${port}/admin/shop-Verify-edit`,
    ShopLogOut: `http://localhost:${port}/admin/shop-logOut`,
    ShopVerifyJWT: `http://localhost:${port}/admin/shop-VerifyJWT`,

    // add products
    addProducts: `http://localhost:${port}/admin/shop-addProduct`,
    deleteProduct: `http://localhost:${port}/admin/shop-delProduct`,
    editProduct: `http://localhost:${port}/admin/shop-editProduct`,
    getAllProducts: `http://localhost:${port}/admin/shop-getAllProduct`,
    getProductById: `http://localhost:${port}/admin/shop-getProduct`,

    // events
    addEvents: `http://localhost:${port}/admin/shop-addEvent`,
    delEvents: `http://localhost:${port}/admin/shop-delEvent`,
    editEvent: `http://localhost:${port}/admin/shop-editEvent`,
    getAllEvents: `http://localhost:${port}/admin/shop-getAllEvent`,
    getEventById: `http://localhost:${port}/admin/shop-getEvent`,

    // coupons
    createCoupon: `http://localhost:${port}/admin/create-copoun`,
    deleteCoupon: `http://localhost:${port}/admin/delete-copoun`,

    // reviews
    giveReview: `http://localhost:${port}/review/give-review`,
    delReview: `http://localhost:${port}/review/del-review`,
    editReview: `http://localhost:${port}/review/edit-review`,
    giveLike: `http://localhost:${port}/review/give-like`,
    giveUnLike: `http://localhost:${port}/review//give-un-like`,

    // wishlist 
    addToWishList: `http://localhost:${port}/user/addToList`,
    removeToWishList: `http://localhost:${port}/user/removeToList`,

};