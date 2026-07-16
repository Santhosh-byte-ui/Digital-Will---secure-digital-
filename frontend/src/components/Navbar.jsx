import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkStyle = {
    color: "rgba(255,255,255,0.9)",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "15px",
  };

  return (
    <nav
      style={{
        background: "#0f172a",
        color: "white",
        padding: "16px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Logo */}

      <div>
        <h2
          style={{
            margin: 0,
            fontWeight: "700",
            fontSize: "24px",
          }}
        >
          🔐 Digital Legacy
        </h2>

        <small
          style={{
            opacity: 0.7,
            letterSpacing: "0.5px",
          }}
        >
          Inheritance Management Platform
        </small>
      </div>

      {/* Menu */}

      <div
        style={{
          display: "flex",
          gap: "24px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Link to="/dashboard" style={linkStyle}>
          Dashboard
        </Link>

        <Link to="/create-will" style={linkStyle}>
          Create Will
        </Link>

        <Link to="/my-wills" style={linkStyle}>
          My Wills
        </Link>

        <Link to="/assets" style={linkStyle}>
          Assets
        </Link>

        <Link to="/vault" style={linkStyle}>
          Vault
        </Link>

        <Link to="/notifications" style={linkStyle}>
          Notifications
        </Link>
         
         <Link to="/audit-logs" style={linkStyle}>
        📋 Audit Logs
        </Link>
      
        <Link to="/deadman-settings" style={linkStyle} >
         ⏳ Dead Man Settings
         </Link>
        <button
          onClick={logout}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "10px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;