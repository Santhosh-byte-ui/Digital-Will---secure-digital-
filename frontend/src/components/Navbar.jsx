import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaShieldAlt, FaBars, FaTimes } from "react-icons/fa";
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
      setScrolled(window.scrollY > 10);
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
            <FaShieldAlt size={16} />
          </div>
          <div className="brand-text">
            <span className="brand-name">DigitalWill</span>
            <span className="brand-tag">Estate Management</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" && !location.hash ? "active" : ""}`}
            onClick={() => handleNavClick("top")}
          >
            Overview
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
            href="#security"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("security");
            }}
          >
            Security &amp; Legal
          </a>
        </nav>

        {/* Actions */}
        <div className="nav-actions">
          {token ? (
            <>
              <Link to="/dashboard" className="btn btn-secondary btn-sm">
                Dashboard
              </Link>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={logout}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Create Account
              </Link>
            </>
          )}

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
