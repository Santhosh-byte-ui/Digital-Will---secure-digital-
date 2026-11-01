import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaShieldAlt,
  FaThLarge,
  FaUserShield,
  FaFileContract,
  FaCoins,
  FaUsers,
  FaFolder,
  FaClock,
  FaCheckCircle,
  FaListUl,
  FaSearch,
  FaQuestionCircle,
  FaBell,
  FaSun,
  FaMoon,
  FaChevronDown,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { apiFetch } from "../api";
import "../pages/Dashboard.css";

function DashboardLayout({ title = "Dashboard", activeNav = "dashboard", children }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Persistent theme: dark (default matching Image 2) or light (matching Image 1)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("digitalWill_dashboard_theme") || "dark";
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [userAuthMenuOpen, setUserAuthMenuOpen] = useState(
    activeNav === "profile" || activeNav === "admin",
  );

  const [user] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("digitalWill_dashboard_theme", nextTheme);
  };

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

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest(".dw-user-pill")) {
        setProfileDropdownOpen(false);
      }
    };
    window.addEventListener("click", closeDropdown);
    return () => window.removeEventListener("click", closeDropdown);
  }, []);

  const displayName = user?.name
    ? `${user.name} (${user.role === "admin" ? "Admin" : "Owner"})`
    : "Santhosh (Admin)";
  const avatarLetter = (user?.name || "Santhosh").charAt(0).toUpperCase();

  return (
    <div className={`dw-dashboard-wrapper theme-${theme}`}>
      {/* ----------------- TOP BANNER TITLE ----------------- */}
      <div className="dw-banner-title">
        DIGITAL-WILL: SECURE DIGITAL ESTATE &amp; INHERITANCE MANAGEMENT SYSTEM
      </div>

      {/* ----------------- MAIN APP WINDOW FRAME ----------------- */}
      <div className="dw-app-shell">
        {/* =========================================================
            LEFT SIDEBAR
            ========================================================= */}
        <aside className="dw-sidebar">
          {/* Brand Row */}
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <div className="dw-brand-row">
              <div className="dw-brand-shield">
                <FaShieldAlt size={16} />
              </div>
              <div className="dw-brand-title">DIGITAL-WILL</div>
              <span className="dw-badge-secure">Secure</span>
            </div>
          </Link>

          {/* Navigation Menu */}
          <nav className="dw-nav-menu" aria-label="Dashboard Sidebar">
            {/* 1. Dashboard */}
            <Link
              to="/dashboard"
              className={`dw-nav-item ${activeNav === "dashboard" ? "active" : ""}`}
            >
              <span className="dw-nav-item-icon">
                <FaThLarge />
              </span>
              <span>Dashboard</span>
            </Link>

            {/* 2. User Authentication */}
            <button
              type="button"
              className={`dw-nav-item ${activeNav === "profile" || activeNav === "admin" ? "active" : ""}`}
              onClick={() => setUserAuthMenuOpen(!userAuthMenuOpen)}
            >
              <span className="dw-nav-item-icon">
                <FaUserShield />
              </span>
              <span>User Authentication</span>
              <FaChevronDown
                className="dw-nav-chevron"
                style={{
                  transform: userAuthMenuOpen ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s ease",
                }}
              />
            </button>
            {userAuthMenuOpen && (
              <div
                style={{
                  paddingLeft: "36px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <Link
                  to="/profile"
                  className={`dw-nav-item ${location.pathname === "/profile" ? "active" : ""}`}
                  style={{ fontSize: "12.5px", padding: "6px 10px" }}
                >
                  My Profile &amp; Contact
                </Link>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className={`dw-nav-item ${location.pathname === "/admin" ? "active" : ""}`}
                    style={{ fontSize: "12.5px", padding: "6px 10px" }}
                  >
                    User Management
                  </Link>
                )}
              </div>
            )}

            {/* 3. Digital Will Management */}
            <Link
              to="/my-wills"
              className={`dw-nav-item ${activeNav === "wills" ? "active" : ""}`}
            >
              <span className="dw-nav-item-icon">
                <FaFileContract />
              </span>
              <span>Digital Will Management</span>
            </Link>

            {/* 4. Digital Asset Management */}
            <Link
              to="/assets"
              className={`dw-nav-item ${activeNav === "assets" ? "active" : ""}`}
            >
              <span className="dw-nav-item-icon">
                <FaCoins />
              </span>
              <span>Digital Asset Management</span>
            </Link>

            {/* 5. Beneficiary Management */}
            <Link
              to="/beneficiary-portal"
              className={`dw-nav-item ${activeNav === "beneficiaries" ? "active" : ""}`}
            >
              <span className="dw-nav-item-icon">
                <FaUsers />
              </span>
              <span>Beneficiary Management</span>
            </Link>

            {/* 6. Secure Document Vault */}
            <Link
              to="/vault"
              className={`dw-nav-item ${activeNav === "vault" ? "active" : ""}`}
            >
              <span className="dw-nav-item-icon">
                <FaFolder />
              </span>
              <span>Secure Document Vault</span>
            </Link>

            {/* 7. Inactivity Monitoring */}
            <Link
              to="/deadman-settings"
              className={`dw-nav-item ${activeNav === "deadman" ? "active" : ""}`}
            >
              <span className="dw-nav-item-icon">
                <FaClock />
              </span>
              <span>Inactivity Monitoring</span>
            </Link>

            {/* 8. Death Verification (Review) */}
            <Link
              to={user?.role === "admin" ? "/admin" : "/beneficiary-portal"}
              className={`dw-nav-item ${activeNav === "verification" ? "active" : ""}`}
            >
              <span className="dw-nav-item-icon">
                <FaCheckCircle />
              </span>
              <span>Death Verification (Review)</span>
            </Link>

            {/* 9. Activity Logs */}
            <Link
              to="/audit-logs"
              className={`dw-nav-item ${activeNav === "audit" ? "active" : ""}`}
            >
              <span className="dw-nav-item-icon">
                <FaListUl />
              </span>
              <span>Activity Logs</span>
            </Link>
          </nav>
        </aside>

        {/* =========================================================
            MAIN VIEW AREA
            ========================================================= */}
        <main className="dw-main-content">
          {/* ----------------- TOPBAR ----------------- */}
          <header className="dw-topbar">
            <h1 className="dw-topbar-title">{title}</h1>

            <div className="dw-topbar-actions">
              {/* Search Pill */}
              <div className="dw-search-box">
                <FaSearch size={12} color="var(--dw-search-placeholder)" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search"
                />
              </div>

              {/* Help Button */}
              <button
                type="button"
                className="dw-icon-btn"
                title="Documentation & Guidance"
                onClick={() =>
                  alert(
                    "Digital-Will Platform: Securely store assets, assign beneficiaries, manage legal documents, and configure verified inheritance succession protocols.",
                  )
                }
              >
                <FaQuestionCircle size={14} />
              </button>

              {/* Notification Bell */}
              <Link
                to="/notifications"
                className="dw-icon-btn"
                title="Notifications"
              >
                <FaBell size={14} />
                <span className="dw-notification-dot" />
              </Link>

              {/* Theme Toggle (Light <-> Dark) */}
              <button
                type="button"
                className="dw-icon-btn"
                title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
                onClick={toggleTheme}
                aria-label="Toggle Dashboard Theme"
              >
                {theme === "dark" ? (
                  <FaSun size={14} color="#FBBF24" />
                ) : (
                  <FaMoon size={14} color="#2563EB" />
                )}
              </button>

              {/* User Profile Pill */}
              <div
                className="dw-user-pill"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="dw-user-avatar">{avatarLetter}</div>
                <span className="dw-user-name">{displayName}</span>
                <FaChevronDown size={11} color="var(--dw-sidebar-text)" />

                {profileDropdownOpen && (
                  <div className="dw-profile-dropdown">
                    <Link to="/profile" className="dw-dropdown-link">
                      <FaUser size={13} />
                      <span>My Profile</span>
                    </Link>
                    <Link to="/audit-logs" className="dw-dropdown-link">
                      <FaListUl size={13} />
                      <span>Audit Logs</span>
                    </Link>
                    <button
                      type="button"
                      className="dw-dropdown-link logout"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt size={13} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* ----------------- PAGE BODY ----------------- */}
          <div className="dw-body-container">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
