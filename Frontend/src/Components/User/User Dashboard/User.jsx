import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./SideBar.jsx";
import Profile from "./Dashboard Pages/Profile.jsx";
import UserOrders from "./Dashboard Pages/UserOrders.jsx";
import Refund from "./Dashboard Pages/Refund.jsx";
import ChatPage from "./Dashboard Pages/ChatPage.jsx";
import PaymentMethods from "./Dashboard Pages/PaymentMethod.jsx";
import TrackOrder from "./Dashboard Pages/trackOrder.jsx"
import Address from "./Dashboard Pages/Address.jsx";
import WishList from "./Dashboard Pages/wishList.jsx"

const User = ({ isAuth }) => {
  const location = useLocation();
  const isInboxPage = location.pathname.includes("/inbox");

  return (
    <div className="flex flex-col md:flex-row bg-slate-100">
      {!isInboxPage && <Sidebar isAuth={isAuth} />}
      <div className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<Navigate to="/user-dashboard/profile" />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<UserOrders />} />
          <Route path="/refunds" element={<Refund />} />
          <Route path={"/inbox/*" || "/inbox/:chatId"} element={<ChatPage />} />
          <Route path="/track-order" element={<TrackOrder/>} />
          <Route path="/payment-method" element={<PaymentMethods />} />
          <Route path="/wishlist" element={<WishList />} />
          <Route path="/address" element={<Address />} />
        </Routes>
      </div>
    </div>
  );
};

export default User;
