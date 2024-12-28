import React, { useEffect, useState } from "react";
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
import "./index.css";
import Admin from "./Components/Admin/Admin.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [path, setPath] = useState("/");

  useEffect(() => {
    const token = localStorage.getItem("multi_token");
    if (token) {
      setIsAuthenticated(true);
      setPath("/dashboard");
    } else {
      setIsAuthenticated(false);
      setPath("/login");
    }
  }, [isAuthenticated]);

  const location = useLocation();
  const authPages = ["/login", "/sign-up", "/code-verify", "/email-verify","/Shop/*"];
  const isAuthPage = authPages.includes(location.pathname);
  const isShopDashBoard = location.pathname.startsWith('/Shop')
  const isDashBoardPage = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!isAuthPage && !isShopDashBoard && <Navbar path={path} />}
      <Routes>
        {/* main routes  */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Product />} />
        <Route path="/best-selling" element={<Product />} />
        <Route path="/events" element={<Events />} />
        <Route path="/FAQ" element={<FAQ />} />
        {/* seller routes */}
        <Route path="/Shop/*" element={<Admin/>}/>
        {/* Authentication Routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login isAuth={setIsAuthenticated}/>} />
        <Route path="/sign-up" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignUp />} />
        <Route path="/code-verify" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <CodeVerification setAuth={setIsAuthenticated} />} />
        <Route path="/email-verify" element={<VerifyEmail />} />
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