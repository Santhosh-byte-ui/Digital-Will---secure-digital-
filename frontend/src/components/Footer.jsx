import { Link } from "react-router-dom";
import { FaShieldAlt, FaLock, FaCloud } from "react-icons/fa";

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#172033",
        color: "#94A3B8",
        borderTop: "1px solid #1E293B",
        padding: "60px 24px 30px",
        fontFamily: "var(--dw-font-sans)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "40px",
          marginBottom: "48px",
        }}
      >
        {/* Brand Column */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "5px",
                backgroundColor: "#3157A4",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaShieldAlt size={14} />
            </div>
            <span
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
              }}
            >
              DigitalWill
            </span>
          </div>

          <p
            style={{
              fontSize: "0.85rem",
              lineHeight: "1.6",
              color: "#94A3B8",
              maxWidth: "320px",
            }}
          >
            A high-assurance digital estate management platform designed to
            protect and preserve digital assets, credentials, legal documents,
            and beneficiary designations with private cloud infrastructure.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginTop: "16px",
              fontSize: "0.78rem",
              color: "#CBD5E1",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
              <FaLock size={11} color="#16845B" /> AES-256 Encrypted
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
              <FaCloud size={11} color="#3157A4" /> AWS S3 Vault
            </span>
          </div>
        </div>

        {/* Platform Links */}
        <div>
          <h4
            style={{
              color: "#FFFFFF",
              fontSize: "0.85rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "14px",
            }}
          >
            Platform
          </h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>
              <Link to="/my-wills" style={{ color: "#94A3B8", fontSize: "0.85rem" }}>
                Digital Wills Management
              </Link>
            </li>
            <li>
              <Link to="/assets" style={{ color: "#94A3B8", fontSize: "0.85rem" }}>
                Asset Inventory
              </Link>
            </li>
            <li>
              <Link to="/beneficiary-portal" style={{ color: "#94A3B8", fontSize: "0.85rem" }}>
                Beneficiary Roster
              </Link>
            </li>
            <li>
              <Link to="/vault" style={{ color: "#94A3B8", fontSize: "0.85rem" }}>
                Document Vault
              </Link>
            </li>
          </ul>
        </div>

        {/* Security & Succession */}
        <div>
          <h4
            style={{
              color: "#FFFFFF",
              fontSize: "0.85rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "14px",
            }}
          >
            Security &amp; Legal
          </h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li>
              <Link to="/deadman-settings" style={{ color: "#94A3B8", fontSize: "0.85rem" }}>
                Inactivity Heartbeat Monitor
              </Link>
            </li>
            <li>
              <span style={{ color: "#94A3B8", fontSize: "0.85rem" }}>
                Human Death Verification Protocol
              </span>
            </li>
            <li>
              <span style={{ color: "#94A3B8", fontSize: "0.85rem" }}>
                Immutable Audit Trail
              </span>
            </li>
            <li>
              <span style={{ color: "#94A3B8", fontSize: "0.85rem" }}>
                Statutory Compliance
              </span>
            </li>
          </ul>
        </div>

        {/* Legal Disclaimer */}
        <div>
          <h4
            style={{
              color: "#FFFFFF",
              fontSize: "0.85rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "14px",
            }}
          >
            Legal Notice
          </h4>
          <p style={{ fontSize: "0.8rem", color: "#64748B", lineHeight: "1.5" }}>
            DigitalWill provides technological estate cataloging and succession
            automation services. Inactivity alone never triggers automated asset
            distribution. Independent legal review and certified death proof are
            strictly required before releasing sensitive documents.
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          paddingTop: "24px",
          borderTop: "1px solid #1E293B",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
          fontSize: "0.78rem",
          color: "#64748B",
        }}
      >
        <span>
          &copy; {new Date().getFullYear()} DigitalWill Technologies Inc. All rights reserved.
        </span>
        <div style={{ display: "flex", gap: "18px" }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Security Whitepaper</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
