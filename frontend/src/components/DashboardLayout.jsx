import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaShieldAlt,
  FaThLarge,
  FaFileContract,
  FaCoins,
  FaUsers,
  FaFolder,
  FaClock,
  FaCheckCircle,
  FaListUl,
  FaBell,
  FaSignOutAlt,
  FaUser,
  FaCog,
} from "react-icons/fa";
import { apiFetch } from "../api";
import "../pages/Dashboard.css";

function DashboardLayout({ title = "Dashboard", activeNav = "dashboard", children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const [user] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleLogout = () => {
    const token = localStorage.getItem("token");
    if (token) {
      void apiFetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest(".saas-profile-container")) {
        setProfileDropdownOpen(false);
      }
    };
    window.addEventListener("click", closeDropdown);
    return () => window.removeEventListener("click", closeDropdown);
  }, []);

  const displayName = user?.name || "Account";
  const userRole = user?.role === "admin" ? "Administrator" : "Estate Owner";
  const avatarLetter = (user?.name || "A").charAt(0).toUpperCase();

  return (
    <div className="saas-layout">
      {/* =========================================================
          LEFT SIDEBAR (Dark Navy #172033)
          ========================================================= */}
      <aside className="saas-sidebar" aria-label="Portal Navigation">
        {/* Brand */}
        <Link to="/dashboard" className="saas-sidebar-brand">
          <div className="saas-sidebar-brand-icon">
            <FaShieldAlt size={15} />
          </div>
          <span className="saas-sidebar-brand-name">DigitalWill</span>
          <span className="saas-sidebar-brand-badge">SaaS</span>
        </Link>

        {/* Navigation */}
        <nav className="saas-sidebar-nav">
          <span className="saas-sidebar-heading">Estate Overview</span>

          <Link
            to="/dashboard"
            className={`saas-nav-link ${activeNav === "dashboard" ? "active" : ""}`}
            title="Dashboard Overview"
          >
            <FaThLarge className="saas-nav-icon" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/my-wills"
            className={`saas-nav-link ${activeNav === "wills" ? "active" : ""}`}
            title="Digital Wills Management"
          >
            <FaFileContract className="saas-nav-icon" />
            <span>Digital Wills</span>
          </Link>

          <Link
            to="/assets"
            className={`saas-nav-link ${activeNav === "assets" ? "active" : ""}`}
            title="Digital Asset Inventory"
          >
            <FaCoins className="saas-nav-icon" />
            <span>Asset Management</span>
          </Link>

          <Link
            to="/beneficiary-portal"
            className={`saas-nav-link ${activeNav === "beneficiaries" ? "active" : ""}`}
            title="Beneficiaries & Nominees"
          >
            <FaUsers className="saas-nav-icon" />
            <span>Beneficiaries</span>
          </Link>

          <Link
            to="/vault"
            className={`saas-nav-link ${activeNav === "vault" ? "active" : ""}`}
            title="Encrypted Document Vault"
          >
            <FaFolder className="saas-nav-icon" />
            <span>Document Vault</span>
          </Link>

          <span className="saas-sidebar-heading">Succession Controls</span>

          <Link
            to="/deadman-settings"
            className={`saas-nav-link ${activeNav === "deadman" ? "active" : ""}`}
            title="Inactivity Heartbeat Monitoring"
          >
            <FaClock className="saas-nav-icon" />
            <span>Inactivity Switch</span>
          </Link>

          {user?.role === "admin" ? (
            <Link
              to="/admin"
              className={`saas-nav-link ${activeNav === "verification" || activeNav === "admin" ? "active" : ""}`}
              title="Death Verification Review"
            >
              <FaCheckCircle className="saas-nav-icon" />
              <span>Death Verification</span>
            </Link>
          ) : (
            <Link
              to="/beneficiary-portal"
              className={`saas-nav-link ${location.pathname === "/beneficiary-portal" ? "active" : ""}`}
              title="Claim & Succession Status"
            >
              <FaCheckCircle className="saas-nav-icon" />
              <span>Succession Status</span>
            </Link>
          )}

          <Link
            to="/audit-logs"
            className={`saas-nav-link ${activeNav === "audit" ? "active" : ""}`}
            title="System Activity & Audit Logs"
          >
            <FaListUl className="saas-nav-icon" />
            <span>Audit Trail</span>
          </Link>
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="saas-sidebar-footer">
          <div className="saas-user-avatar">{avatarLetter}</div>
          <div className="saas-user-info">
            <div className="saas-user-name">{displayName}</div>
            <div className="saas-user-role">{userRole}</div>
          </div>
          <Link
            to="/profile"
            style={{ color: "#94A3B8", padding: "4px" }}
            title="Account Settings"
          >
            <FaCog size={13} />
          </Link>
        </div>
      </aside>

      {/* =========================================================
          MAIN APPLICATION VIEW
          ========================================================= */}
      <div className="saas-main">
        {/* Topbar */}
        <header className="saas-topbar">
          <h1 className="saas-topbar-title">{title}</h1>

          <div className="saas-topbar-actions">
            {/* Notification Bell */}
            <Link
              to="/notifications"
              className="saas-topbar-btn"
              title="Notifications"
            >
              <FaBell size={13} />
              <span className="saas-badge-dot" />
            </Link>

            {/* User Profile Menu */}
            <div
              className="saas-profile-container"
              style={{ position: "relative" }}
            >
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    backgroundColor: "#3157A4",
                    color: "#FFFFFF",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  {avatarLetter}
                </span>
                <span style={{ fontSize: "12.5px" }}>{displayName}</span>
              </button>

              {profileDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "38px",
                    width: "180px",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid var(--dw-border)",
                    borderRadius: "6px",
                    boxShadow: "var(--dw-modal-shadow)",
                    zIndex: 200,
                    padding: "4px 0",
                  }}
                >
                  <Link
                    to="/profile"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 14px",
                      fontSize: "12.5px",
                      color: "var(--dw-text-main)",
                    }}
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <FaUser size={12} color="#64748B" />
                    <span>My Account</span>
                  </Link>

                  <Link
                    to="/audit-logs"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 14px",
                      fontSize: "12.5px",
                      color: "var(--dw-text-main)",
                    }}
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <FaListUl size={12} color="#64748B" />
                    <span>Audit Trail</span>
                  </Link>

                  <div
                    style={{
                      height: "1px",
                      backgroundColor: "var(--dw-border)",
                      margin: "4px 0",
                    }}
                  />

                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 14px",
                      fontSize: "12.5px",
                      color: "var(--dw-danger)",
                      background: "none",
                      border: "none",
                      textAlign: "left",
                    }}
                  >
                    <FaSignOutAlt size={12} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="saas-content">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
