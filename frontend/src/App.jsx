import Profile from "./pages/Profile";
import AuditLogs from "./pages/AuditLogs";
import BeneficiaryPortal from "./pages/BeneficiaryPortal";
import AdminDashboard from "./pages/AdminDashboard";
import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";
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
  const navigate = useNavigate();
  const location = useLocation();
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    const redirectOnUnauthorized = () => navigate("/login", { replace: true });
    const showApiError = (event) => setApiError(event.detail.message);
    window.addEventListener(
      "digital-will:unauthorized",
      redirectOnUnauthorized,
    );
    window.addEventListener("digital-will:api-error", showApiError);
    return () => {
      window.removeEventListener(
        "digital-will:unauthorized",
        redirectOnUnauthorized,
      );
      window.removeEventListener("digital-will:api-error", showApiError);
    };
  }, [navigate]);

  const authenticatedPaths = [
    "/dashboard",
    "/profile",
    "/deadman-settings",
    "/audit-logs",
    "/beneficiary-portal",
    "/admin",
    "/notifications",
    "/create-will",
    "/my-wills",
    "/assets",
    "/vault",
  ];
  const hidePublicNavbar = authenticatedPaths.includes(location.pathname);

  return (
    <>
      {!hidePublicNavbar && <Navbar />}
      {apiError && (
        <div
          role="alert"
          style={{
            position: "fixed",
            top: "80px",
            right: "16px",
            zIndex: 1000,
            maxWidth: "min(420px, calc(100vw - 32px))",
            padding: "12px 16px",
            background: "#fff1f0",
            color: "#8a1c13",
            border: "1px solid #f0b8b3",
            borderRadius: "6px",
          }}
        >
          {apiError}{" "}
          <button type="button" onClick={() => setApiError("")}>
            Dismiss
          </button>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        {/* Forgot Password */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Reset Password */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Email Verification */}
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />

        <Route
          path="/deadman-settings"
          element={
            <RequireAuth>
              <DeadManSettings />
            </RequireAuth>
          }
        />

        <Route
          path="/audit-logs"
          element={
            <RequireAuth>
              <AuditLogs />
            </RequireAuth>
          }
        />

        <Route
          path="/beneficiary-portal"
          element={
            <RequireAuth>
              <BeneficiaryPortal />
            </RequireAuth>
          }
        />

        <Route
          path="/admin"
          element={
            <RequireAuth adminOnly>
              <AdminDashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/notifications"
          element={
            <RequireAuth>
              <Notifications />
            </RequireAuth>
          }
        />

        <Route
          path="/create-will"
          element={
            <RequireAuth>
              <CreateWill />
            </RequireAuth>
          }
        />

        <Route
          path="/my-wills"
          element={
            <RequireAuth>
              <MyWills />
            </RequireAuth>
          }
        />

        <Route
          path="/assets"
          element={
            <RequireAuth>
              <Assets />
            </RequireAuth>
          }
        />

        <Route
          path="/vault"
          element={
            <RequireAuth>
              <Vault />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
}

export default App;
