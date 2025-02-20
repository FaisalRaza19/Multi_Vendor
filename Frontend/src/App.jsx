import React, { useState, useEffect, useContext } from "react";
import "./index.css";
import { jwtDecode } from "jwt-decode";
// components
import Navbar from "./Components/Pages/Fixed Pages/Navbar.jsx";
import Home from "./Components/Pages/Main Pages/Home/Home.jsx";
import Product from "./Components/Pages/Main Pages/Products/products.jsx";
import Events from "./Components/Pages/Main Pages/Events/Events.jsx";
import FAQ from "./Components/Pages/Main Pages/FAQ/FAQ.jsx";
import Footer from "./Components/Pages/Fixed Pages/Footer.jsx";
import Admin_Shop from "./Components/Pages/Other Pages/admin_Shop.jsx";
import CheckOut from "./Components/Pages/Other Pages/checkOut.jsx"
// user auth
import SignUp from "./Components/User/userAuth/userSignUp.jsx";
import EmailVerify from "./Components/User/userAuth/emailVerify.jsx";
import ProfileEmailVerify from "./Components/User/userAuth/profileEmailVerify.jsx";
import User from "./Components/User/User Dashboard/User.jsx";
import Alert from "./Components/Forms/Alert.jsx";
import UserLogin from "./Components/User/userAuth/userLogin.jsx";
// Admin auth
import Admin from "./Components/Admin/Admin Dashboard/Admin.jsx";
import AdminLogin from "./Components/Admin/Admin_Auth/adminLogin.jsx";
import AdminRegister from "./Components/Admin/Admin_Auth/adminRegisterShop.jsx";
import AdminEmailVerify from "./Components/Admin/Admin_Auth/adminShop_EmailVerify.jsx";
import AdminProfileEmailVerify from "./Components/Admin/Admin_Auth/adminProfile_EmailVerify.jsx";

import { ContextApi } from "./Context/Context.jsx";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import ShowProduct from "./Components/Pages/Other Pages/ShowProduct.jsx";
import ShowEvent from "./Components/Pages/Other Pages/ShowEvent.jsx";

function App() {
  const { verifyJWT } = useContext(ContextApi).userAuth;
  const { ShopVerifyJWT } = useContext(ContextApi).adminAuth;
  const [shopId, setShopId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [shopAuth, setShopAuth] = useState(false);
  const authPage = useLocation();
  const isAuthPage = ["/login", "/signUp", "/emailVerify", "/Shop-register", "/Shop-login", "/admin-VerifyProfile", "/verifyProfile",
    "/Shop-emailVerify"].includes(authPage.pathname);

  const isShop = ["/Shop", "/admin_Shop"].some(e => authPage.pathname.startsWith(e));


  const getId = () => {
    const token = localStorage.getItem("admin_token")
    if (token) {
      const decodeToken = jwtDecode(token);
      setShopId(decodeToken.adminId)
    }
  }
  useEffect(() => {
    getId()
  }, [shopId]);


  useEffect(() => {
    const verifyTokens = async () => {
      // Verify User Token
      const token = localStorage.getItem("multi_token");
      if (token) {
        const { isValid } = await verifyJWT();
        setIsAuthenticated(isValid);
        if (!isValid) localStorage.removeItem("multi_token");
      } else {
        setIsAuthenticated(false);
      }

      // Verify Admin Token
      const adminToken = localStorage.getItem("admin_token");
      if (adminToken) {
        const { isValid } = await ShopVerifyJWT();
        setShopAuth(isValid);
        if (!isValid) {
          localStorage.removeItem("admin_token");
        }
      } else {
        setShopAuth(false);
      }
    };

    verifyTokens();
  }, [verifyJWT, ShopVerifyJWT]);

  return (
    <>
      <Alert />
      {!isAuthPage && !isShop && <Navbar isAuth={isAuthenticated} path={isAuthenticated ? "/user-dashboard" : "/login"} shopPath={shopAuth ? `/Shop/${shopId}/dashboard` : "/Shop-login"} />}
      <Routes>
        {/* General Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Product />} />
        <Route path="/product/:category/:id" element={<ShowProduct />} />
        {/* get shop */}
        <Route path="/admin_Shop/:shopId" element={<Admin_Shop />} />
        <Route path="/best-selling" element={<Product />} />
        <Route path="/events" element={<Events />} />
        <Route path="/event/:category/:id" element={<ShowEvent />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/checkOut" element={isAuthenticated ? <CheckOut /> : <Navigate to={"/"} />} />

        {/* Admin Authentication */}
        <Route path="/Shop-login" element={shopAuth ? <Navigate to='/Shop/dashboard' replace /> : <AdminLogin isAuth={setShopAuth} />} />
        <Route path="/Shop-register" element={shopAuth ? <Navigate to='/Shop/dashboard' replace /> : <AdminRegister />} />
        <Route path="/Shop-emailVerify" element={shopAuth ? <Navigate to='/Shop/dashboard' replace /> : <AdminEmailVerify isAuth={setShopAuth} />} />
        <Route path="/admin-VerifyProfile" element={<AdminProfileEmailVerify />} />
        <Route path={`/Shop/${shopId}/*`} element={shopAuth ? <Admin isAuth={setShopAuth} /> : <Navigate to="/Shop-login" />} />

        {/* User Authentication */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/user-dashboard" replace /> : <UserLogin isAuth={setIsAuthenticated} />} />
        <Route path="/signUp" element={isAuthenticated ? <Navigate to="/user-dashboard" replace /> : <SignUp />} />
        <Route path="/emailVerify" element={isAuthenticated ? <Navigate to="/user-dashboard" replace /> : <EmailVerify isAuth={setIsAuthenticated} />} />
        <Route path="/verifyProfile" element={<ProfileEmailVerify />} />
        <Route path="/user-dashboard/*" element={isAuthenticated ? <User isAuth={setIsAuthenticated} /> : <Navigate to="/login" />} />

        {/* Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isAuthPage && !isShop && <Footer />}
    </>
  );
}

export default App;

