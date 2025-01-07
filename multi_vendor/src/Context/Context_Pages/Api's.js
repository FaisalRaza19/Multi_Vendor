const port = 7777;
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
    registerShop : `http://localhost:${port}/admin/shop-register`,
    shopVerify : `http://localhost:${port}/admin/shop-verify`,
    resendCode : `http://localhost:${port}/admin/shop-resendCode`,
    ShopLogin : `http://localhost:${port}/admin/shop-login`,
    getShop : `http://localhost:${port}/admin/shop-get`,
    editShopLogo : `http://localhost:${port}/admin/shop-EditLogo`,
    editShopProfile : `http://localhost:${port}/admin/shop-edit`,
    verifyShopProfile : `http://localhost:${port}/admin/shop-Verify-edit`,
    ShopLogOut : `http://localhost:${port}/admin/shop-logOut`,
    ShopVerifyJWT : `http://localhost:${port}/admin/shop-VerifyJWT`,
};