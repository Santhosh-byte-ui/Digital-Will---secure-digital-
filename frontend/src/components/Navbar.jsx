import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShieldAlt, FaBars, FaTimes, FaUser, FaSignOutAlt } from "react-icons/fa";
import { apiFetch } from "../api";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleNavClick = (anchorId) => {
    closeMenu();
    if (location.pathname === "/") {
      const element = document.getElementById(anchorId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(`/#${anchorId}`);
    }
  };

  const logout = () => {
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

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        {/* Brand / Logo */}
        <Link to="/" className="brand-logo" onClick={closeMenu}>
          <div className="logo-shield-icon">
            <FaShieldAlt size={20} color="#00A8FF" />
          </div>
          <div className="brand-text">
            <span className="brand-name">DigitalWill</span>
            <span className="brand-tag">SECURITY CLOUD</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" && !location.hash ? "active" : ""}`}
            onClick={() => handleNavClick("top")}
          >
            Home
          </Link>
          <a
            href="#features"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("features");
            }}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("how-it-works");
            }}
          >
            How It Works
          </a>
          <a
            href="#about"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("about");
            }}
          >
            About
          </a>
          <a
            href="#contact"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("contact");
            }}
          >
            Contact
          </a>

          {token && (
            <Link
              to="/dashboard"
              className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="nav-actions">
          {token ? (
            <div className="auth-action-group">
              <Link to="/profile" className="profile-pill-link">
                <FaUser size={13} />
                <span>Account</span>
              </Link>
              <button
                type="button"
                className="nav-logout-btn"
                onClick={logout}
                title="Sign out"
              >
                <FaSignOutAlt size={13} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="guest-action-group">
              <Link to="/login" className="nav-login-btn">
                Login
              </Link>
              <Link to="/register" className="nav-register-btn">
                Register
              </Link>
            </div>
          )}

          {/* Hamburger Menu Toggle (Mobile) */}
          <button
            type="button"
            className="mobile-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
        <div className="mobile-drawer-links">
          <Link
            to="/"
            className="mobile-nav-link"
            onClick={() => handleNavClick("top")}
          >
            Home
          </Link>
          <a
            href="#features"
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("features");
            }}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("how-it-works");
            }}
          >
            How It Works
          </a>
          <a
            href="#about"
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("about");
            }}
          >
            About
          </a>
          <a
            href="#contact"
            className="mobile-nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("contact");
            }}
          >
            Contact
          </a>

          {token ? (
            <>
              <Link to="/dashboard" className="mobile-nav-link" onClick={closeMenu}>
                Dashboard
              </Link>
              <Link to="/create-will" className="mobile-nav-link" onClick={closeMenu}>
                Create Will
              </Link>
              <Link to="/my-wills" className="mobile-nav-link" onClick={closeMenu}>
                My Wills
              </Link>
              <Link to="/assets" className="mobile-nav-link" onClick={closeMenu}>
                Assets
              </Link>
              <Link to="/vault" className="mobile-nav-link" onClick={closeMenu}>
                Vault
              </Link>
              <Link to="/profile" className="mobile-nav-link" onClick={closeMenu}>
                Profile
              </Link>
              <button
                type="button"
                className="mobile-drawer-logout"
                onClick={() => {
                  closeMenu();
                  logout();
                }}
              >
                <FaSignOutAlt /> Sign Out
              </button>
            </>
          ) : (
            <div className="mobile-drawer-actions">
              <Link to="/login" className="mobile-login-btn" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" className="mobile-register-btn" onClick={closeMenu}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
