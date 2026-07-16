import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav>

      {/* Logo */}

      <div className="logo">
        <h2>🔐 Digital Legacy</h2>

        <small>
          Inheritance Management Platform
        </small>
      </div>

      {/* Hamburger */}

      <div
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✖" : "☰"}
      </div>

      {/* Menu */}

      <div
        className={`menu ${
          menuOpen ? "open" : ""
        }`}
      >

        <Link
          to="/dashboard"
          onClick={closeMenu}
        >
          Dashboard
        </Link>

        <Link
          to="/create-will"
          onClick={closeMenu}
        >
          Create Will
        </Link>

        <Link
          to="/my-wills"
          onClick={closeMenu}
        >
          My Wills
        </Link>

        <Link
          to="/assets"
          onClick={closeMenu}
        >
          Assets
        </Link>

        <Link
          to="/vault"
          onClick={closeMenu}
        >
          Vault
        </Link>

        <Link
          to="/notifications"
          onClick={closeMenu}
        >
          Notifications
        </Link>
        <Link
          to="/audit-logs"
          onClick={closeMenu}
        >
          📋 Audit Logs
        </Link>

        <Link
          to="/deadman-settings"
          onClick={closeMenu}
        >
          ⏳ Dead Man Settings
        </Link>

        <button
          className="logout-btn"
          onClick={() => {
            closeMenu();
            logout();
          }}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;