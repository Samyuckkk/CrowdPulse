// import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import AdminDashboard from "../pages/admin/AdminDashboard"
import EventDashboard from "../pages/admin/EventDashboard"

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Pages */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminDashboard />}>
        <Route path="/event" element={<EventDashboard/>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;