import { Link } from "react-router-dom";
import { FaShieldAlt, FaLock, FaCloud, FaFileAlt } from "react-icons/fa";

function Footer() {
  return (
    <footer
      style={{
        background: "#020B16",
        color: "#F3F7FF",
        borderTop: "1px solid #123C5C",
        marginTop: "100px",
        padding: "70px 24px 35px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "45px",
        }}
      >
        {/* Brand & Mission */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(0, 168, 255, 0.1)",
                border: "1px solid rgba(0, 168, 255, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaShieldAlt size={18} color="#00A8FF" />
            </div>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#F3F7FF",
                letterSpacing: "-0.3px",
              }}
            >
              DigitalWill
            </span>
          </div>

          <p
            style={{
              color: "#A8BDD2",
              fontSize: "14px",
              lineHeight: "1.75",
              maxWidth: "340px",
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
              gap: "16px",
              marginTop: "20px",
              color: "#20D4FF",
              fontSize: "13px",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <FaLock size={12} /> Encrypted at Rest
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <FaCloud size={12} /> AWS Cloud Vault
            </span>
          </div>
        </div>

        {/* Platform Links */}
        <div>
          <h4
            style={{
              color: "#F3F7FF",
              fontSize: "15px",
              fontWeight: 600,
              marginBottom: "18px",
              letterSpacing: "0.4px",
            }}
          >
            Platform Capabilities
          </h4>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              fontSize: "14px",
              color: "#A8BDD2",
            }}
          >
            <li>
              <Link to="/vault" style={{ color: "#A8BDD2", transition: "color 0.2s" }}>
                AWS S3 Document Vault
              </Link>
            </li>
            <li>
              <Link to="/create-will" style={{ color: "#A8BDD2", transition: "color 0.2s" }}>
                Digital Will Generator
              </Link>
            </li>
            <li>
              <Link to="/assets" style={{ color: "#A8BDD2", transition: "color 0.2s" }}>
                Encrypted Asset Registry
              </Link>
            </li>
            <li>
              <Link to="/beneficiary-portal" style={{ color: "#A8BDD2", transition: "color 0.2s" }}>
                Nominee Verification Portal
              </Link>
            </li>
            <li>
              <Link to="/deadman-settings" style={{ color: "#A8BDD2", transition: "color 0.2s" }}>
                Dead Man Continuity Protocol
              </Link>
            </li>
          </ul>
        </div>

        {/* Security Architecture */}
        <div>
          <h4
            style={{
              color: "#F3F7FF",
              fontSize: "15px",
              fontWeight: 600,
              marginBottom: "18px",
              letterSpacing: "0.4px",
            }}
          >
            Security Architecture
          </h4>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              fontSize: "14px",
              color: "#A8BDD2",
            }}
          >
            <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FaFileAlt size={12} color="#00A8FF" /> Owner Direct Object Scoping
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FaLock size={12} color="#00A8FF" /> 7-Day Revocable JWT Tokens
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FaCloud size={12} color="#00A8FF" /> Private Presigned S3 Access
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FaShieldAlt size={12} color="#00A8FF" /> Magic-Byte Signature Validation
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#20D4FF" }}>•</span> Immutable Audit Log Trails
            </li>
          </ul>
        </div>

        {/* Compliance / Transparency Notice */}
        <div>
          <h4
            style={{
              color: "#F3F7FF",
              fontSize: "15px",
              fontWeight: 600,
              marginBottom: "18px",
              letterSpacing: "0.4px",
            }}
          >
            Legal Notice
          </h4>

          <p
            style={{
              color: "#A8BDD2",
              fontSize: "13px",
              lineHeight: "1.7",
              background: "#071727",
              border: "1px solid #123C5C",
              padding: "14px 16px",
              borderRadius: "10px",
            }}
          >
            DigitalWill organizes assets, instructions, and credentials for
            designated heirs. Formal estate validity, witness verification,
            and court probate requirements vary by jurisdiction.
          </p>
        </div>
      </div>

      {/* Divider */}
      <hr
        style={{
          margin: "45px 0 24px",
          borderColor: "#123C5C",
          opacity: 0.6,
        }}
      />

      {/* Bottom Bar */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          color: "#A8BDD2",
          fontSize: "13px",
        }}
      >
        <span>
          © {new Date().getFullYear()} DigitalWill Platform. All rights reserved.
        </span>

        <div style={{ display: "flex", gap: "20px" }}>
          <a href="#about" style={{ color: "#A8BDD2" }}>
            About
          </a>
          <a href="#features" style={{ color: "#A8BDD2" }}>
            Capabilities
          </a>
          <a href="#contact" style={{ color: "#A8BDD2" }}>
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
