import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./Components/Pages/Fixed Pages/Navbar.jsx";
import Footer from "./Components/Pages/Fixed Pages/Footer.jsx";
import Home from "./Components/Pages/Main Pages/Home/Home.jsx";
import Product from "./Components/Pages/Main Pages/Product/product.jsx";
import Events from "./Components/Pages/Main Pages/Events/events.jsx";
import FAQ from "./Components/Pages/Main Pages/FAQ/FAQ.jsx";
import Login from "./Components/User Panel/Forms/Login.jsx";
import Index from "./Components/User Panel/DashBoard/index.jsx";
import SignUp from "./Components/User Panel/Forms/SignUp.jsx";
import CodeVerification from "./Components/User Panel/Forms/CodeVerification.jsx";
import VerifyEmail from "./Components/User Panel/Forms/emailVerify.jsx";
import AdminVerifyEmail from "./Components/Admin/Forms/admin_EmailVerify.jsx";
import AdminVerifyProfile from "./Components/Admin/Forms/admin_verifyProfile.jsx";
import "./index.css";
import Admin from "./Components/Admin/Admin.jsx";
import Admin_Register from "./Components/Admin/Forms/Admin_Register.jsx";
import AdminLogin from "./Components/Admin/Forms/admin_Login.jsx";
import AdminShop from "./Components/Pages/Other Pages/admin_Shop.jsx";
import { ContextApi } from "./Context/Context.jsx";

function App() {
  const { ShopVerifyJWT, verifyJWT } = useContext(ContextApi);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [shopAuth, setShopAuth] = useState(false);
  const [shopPath, setShopPath] = useState("/Shop");
  const [path, setPath] = useState("/");

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("multi_token");
      if (token) {
        const verifyToken = await verifyJWT();
        if (verifyToken) {
          setIsAuthenticated(true);
          setPath("/dashboard");
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("multi_token")
          setPath("/login");
        }
      } else {
        setIsAuthenticated(false);
        setPath("/login");
      }
    };
    verifyToken();
  }, [isAuthenticated]);


  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("admin_token");
      if (token) {
        const isValid = await ShopVerifyJWT();
        if (isValid) {
          setShopAuth(true);
          setShopPath("/Shop/dashboard");
        } else {
          setShopAuth(false);
          localStorage.removeItem("admin_token");
          setShopPath("/Shop-login");
        }
      } else {
        setShopAuth(false);
        setShopPath("/Shop-login");
      }
    };
    verifyToken();
  }, [shopAuth]);

  const location = useLocation();
  const authPages = ["/login", "/sign-up", "/code-verify", "/email-verify", "/Shop/*"];
  const isAuthPage = authPages.includes(location.pathname);
  const isShopDashBoard = location.pathname.startsWith('/Shop')
  const isDashBoardPage = location.pathname.startsWith("/dashboard");

  return (
    <>
        {!isAuthPage && !isShopDashBoard && <Navbar path={path} shopPath={shopPath} />}
        <Routes>
          {/* main routes  */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Product />} />
          <Route path="/best-selling" element={<Product />} />
          <Route path="/events" element={<Events />} />
          <Route path="/FAQ" element={<FAQ />} />
          <Route path="/Shop/:id" element={<AdminShop/>}/>
          {/* seller routes */}
          <Route path="/Shop-login" element={!shopAuth ? <AdminLogin isAuth={setShopAuth} /> : <Navigate to="/Shop/dashboard" replace />} />
          <Route path="/Shop-register" element={!shopAuth ? <Admin_Register /> : <Navigate to="/Shop/dashboard" replace />} />
          <Route path="/Shop/email-verify" element={!shopAuth ? <AdminVerifyEmail isAuth={setShopAuth} /> : <Navigate to="/Shop/dashboard" replace />} />
          <Route path="/Shop/profile-verify" element={<AdminVerifyProfile />} />
          <Route path="/Shop/*" element={shopAuth ? <Admin isAuth={setShopAuth} /> : <Navigate to="/Shop-register" replace />} />
          {/* Authentication Routes */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login isAuth={setIsAuthenticated} />} />
          <Route path="/sign-up" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignUp />} />
          <Route path="/code-verify" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <CodeVerification setAuth={setIsAuthenticated} />} />
          <Route path="/email-verify" element={<VerifyEmail isAuth={setIsAuthenticated} />} />
          <Route
            path="/dashboard/*"
            element={
              isAuthenticated ? (
                <Index isAuth={setIsAuthenticated} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {!isAuthPage && !isDashBoardPage && !isShopDashBoard && <Footer path={path} />}
    </>
  );
}

export default App;