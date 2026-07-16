import AuditLogs from "./pages/AuditLogs";
import BeneficiaryPortal from "./pages/BeneficiaryPortal";
import AdminDashboard from "./pages/AdminDashboard";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Notifications from "./pages/Notifications";

import Home from "./pages/Home";
import DeadManSettings from "./pages/DeadManSettings";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateWill from "./pages/CreateWill";
import MyWills from "./pages/MyWills";
import Assets from "./pages/Assets";
import Vault from "./pages/Vault";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";

// NEW
import VerifyEmail from "./pages/VerifyEmail";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        {/* Forgot Password */}
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* Reset Password */}
        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        {/* Email Verification */}
        <Route
          path="/verify-email/:token"
          element={<VerifyEmail />}
        />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/deadman-settings"element={<DeadManSettings />}/>

        <Route
          path="/audit-logs"
         element={<AuditLogs />}/>

        <Route
          path="/beneficiary-portal"
          element={<BeneficiaryPortal />}
        />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/create-will"
          element={<CreateWill />}
        />

        <Route path="/my-wills" element={<MyWills />} />

        <Route path="/assets" element={<Assets />} />

        <Route path="/vault" element={<Vault />} />
      </Routes>
    </>
  );
}

export default App;