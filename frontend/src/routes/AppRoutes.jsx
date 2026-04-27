import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import VolunteerDashboard from "../pages/volunteer/VolunteerDashboard";
import EventDashboard from "../pages/admin/EventDashboard";
import EventPage from "../pages/admin/EventPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/event" element={<EventDashboard />} />
      <Route path="/admin/event/:eventId" element={<EventPage />} />

      {/* Volunteer */}
      <Route path="/volunteer" element={<VolunteerDashboard />} />
    </Routes>
  );
};

export default AppRoutes;