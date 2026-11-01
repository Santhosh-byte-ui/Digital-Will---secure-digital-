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
  FaSun,
  FaMoon,
  FaSearch,
  FaQuestionCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { apiFetch } from "../api";
import "../pages/Dashboard.css";

function DashboardLayout({ title = "Dashboard", activeNav = "dashboard", children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [authMenuOpen, setAuthMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const displayName = user?.name ? `${user.name} (${user.role === "admin" ? "Admin" : "Owner"})` : "Santhosh (Admin)";
  const avatarLetter = (user?.name || "S").charAt(0).toUpperCase();

  return (
    <div className="saas-layout">
      {/* =========================================================
          LEFT SIDEBAR (MATCHING EXACT MODEL MOCKUPS)
          ========================================================= */}
      <aside className="saas-sidebar" aria-label="Portal Navigation">
        {/* Brand */}
        <Link to="/dashboard" className="saas-sidebar-brand">
          <div className="saas-sidebar-brand-icon">
            <FaShieldAlt size={16} />
          </div>
          <span className="saas-sidebar-brand-name">DIGITAL-WILL</span>
          <span className="saas-sidebar-brand-badge">Secure</span>
        </Link>

        {/* Navigation */}
        <nav className="saas-sidebar-nav">
          <Link
            to="/dashboard"
            className={`saas-nav-link ${activeNav === "dashboard" ? "active" : ""}`}
            title="Dashboard Overview"
          >
            <FaThLarge className="saas-nav-icon" />
            <span>Dashboard</span>
          </Link>

          {/* User Authentication collapsible */}
          <div>
            <button
              type="button"
              className={`saas-nav-link saas-nav-btn ${authMenuOpen ? "expanded" : ""}`}
              onClick={() => setAuthMenuOpen(!authMenuOpen)}
              style={{ width: "100%", justifyContent: "space-between", background: "none", border: "none" }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FaUser className="saas-nav-icon" />
                <span>User Authentication</span>
              </span>
              {authMenuOpen ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
            </button>
            {authMenuOpen && (
              <div style={{ paddingLeft: "32px", display: "flex", flexDirection: "column", gap: "2px", margin: "4px 0" }}>
                <Link to="/profile" className="saas-nav-sublink">
                  Profile &amp; Credentials
                </Link>
                <Link to="/login" className="saas-nav-sublink">
                  Switch Account
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/my-wills"
            className={`saas-nav-link ${activeNav === "wills" ? "active" : ""}`}
            title="Digital Will Management"
          >
            <FaFileContract className="saas-nav-icon" />
            <span>Digital Will Management</span>
          </Link>

          <Link
            to="/assets"
            className={`saas-nav-link ${activeNav === "assets" ? "active" : ""}`}
            title="Digital Asset Inventory"
          >
            <FaCoins className="saas-nav-icon" />
            <span>Digital Asset Management</span>
          </Link>

          <Link
            to="/beneficiary-portal"
            className={`saas-nav-link ${activeNav === "beneficiaries" ? "active" : ""}`}
            title="Beneficiary Management"
          >
            <FaUsers className="saas-nav-icon" />
            <span>Beneficiary Management</span>
          </Link>

          <Link
            to="/vault"
            className={`saas-nav-link ${activeNav === "vault" ? "active" : ""}`}
            title="Secure Document Vault"
          >
            <FaFolder className="saas-nav-icon" />
            <span>Secure Document Vault</span>
          </Link>

          <Link
            to="/deadman-settings"
            className={`saas-nav-link ${activeNav === "deadman" ? "active" : ""}`}
            title="Inactivity Heartbeat Monitoring"
          >
            <FaClock className="saas-nav-icon" />
            <span>Inactivity Monitoring</span>
          </Link>

          {user?.role === "admin" ? (
            <Link
              to="/admin"
              className={`saas-nav-link ${activeNav === "verification" || activeNav === "admin" ? "active" : ""}`}
              title="Death Verification (Review)"
            >
              <FaCheckCircle className="saas-nav-icon" />
              <span>Death Verification (Review)</span>
            </Link>
          ) : (
            <Link
              to="/beneficiary-portal"
              className={`saas-nav-link ${location.pathname === "/beneficiary-portal" ? "active" : ""}`}
              title="Death Verification (Review)"
            >
              <FaCheckCircle className="saas-nav-icon" />
              <span>Death Verification (Review)</span>
            </Link>
          )}

          <Link
            to="/audit-logs"
            className={`saas-nav-link ${activeNav === "audit" ? "active" : ""}`}
            title="Activity Logs"
          >
            <FaListUl className="saas-nav-icon" />
            <span>Activity Logs</span>
          </Link>
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="saas-sidebar-footer">
          <div className="saas-user-avatar">{avatarLetter}</div>
          <div className="saas-user-info">
            <div className="saas-user-name">{user?.name || "Santhosh"}</div>
            <div className="saas-user-role">{user?.role === "admin" ? "System Admin" : "Estate Owner"}</div>
          </div>
          <Link
            to="/profile"
            style={{ color: "var(--dw-secondary)", padding: "4px" }}
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
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <h1 className="saas-topbar-title">{title}</h1>
          </div>

          {/* Search Bar matching model */}
          <div className="saas-search-container">
            <FaSearch className="saas-search-icon" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="saas-search-input"
            />
          </div>

          <div className="saas-topbar-actions">
            {/* Theme Toggle (Light / Dark) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="saas-topbar-btn"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <FaSun size={13} color="#FBBF24" /> : <FaMoon size={13} />}
            </button>

            {/* Help (?) Icon */}
            <button
              type="button"
              className="saas-topbar-btn"
              title="Help & System Info"
              onClick={() => navigate("/audit-logs")}
            >
              <FaQuestionCircle size={13} />
            </button>

            {/* Notification Bell with red badge dot */}
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
                className="saas-profile-pill-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <span className="saas-profile-circle-avatar">
                  {avatarLetter}
                </span>
                <span className="saas-profile-pill-text">{displayName}</span>
                <FaChevronDown size={10} color="var(--dw-secondary)" />
              </button>

              {profileDropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "38px",
                    width: "200px",
                    backgroundColor: "var(--dw-bg-content)",
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
                    <FaUser size={12} color="var(--dw-secondary)" />
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
                    <FaListUl size={12} color="var(--dw-secondary)" />
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
                      cursor: "pointer",
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
