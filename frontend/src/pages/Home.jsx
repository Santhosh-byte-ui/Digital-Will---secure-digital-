import { Link } from "react-router-dom";
import {
  FaShieldAlt,
  FaLock,
  FaCloud,
  FaFileContract,
  FaUsers,
  FaCheckCircle,
  FaArrowRight,
  FaClock,
} from "react-icons/fa";
import Footer from "../components/Footer";
import "./Home.css";

function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className="home-container" id="top">
      {/* =====================================================================
          1. HERO SECTION
          ===================================================================== */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-pill">
            <FaShieldAlt size={11} />
            <span>Digital Estate &amp; Testamentary Succession Platform</span>
          </div>

          <h1 className="hero-heading">
            Secure Your Digital Estate and Protect{" "}
            <span className="hero-heading-highlight">Your Heirs</span>
          </h1>

          <p className="hero-subheading">
            Catalog financial accounts, properties, and sensitive documents into an
            encrypted testamentary registry. Configure fail-safe inactivity monitoring
            with human-reviewed death verification.
          </p>

          <div className="hero-cta-group">
            {token ? (
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: "10px 20px" }}>
                Access Estate Dashboard <FaArrowRight size={11} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary" style={{ padding: "10px 20px" }}>
                  Get Started Free <FaArrowRight size={11} />
                </Link>
                <Link to="/login" className="btn btn-secondary" style={{ padding: "10px 20px" }}>
                  Sign In to Console
                </Link>
              </>
            )}
          </div>

          <div className="hero-trust-badges">
            <div className="hero-trust-item">
              <FaLock size={12} color="#16845B" />
              <span>AES-256 S3 Encryption</span>
            </div>
            <div className="hero-trust-item">
              <FaCheckCircle size={12} color="#3157A4" />
              <span>Human-Verified Succession</span>
            </div>
            <div className="hero-trust-item">
              <FaShieldAlt size={12} color="#64748B" />
              <span>Immutable Audit Trail</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Preview Card */}
        <div className="hero-preview-card">
          <div className="preview-card-header">
            <div className="preview-card-dots">
              <span className="preview-dot" />
              <span className="preview-dot" />
              <span className="preview-dot" />
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--dw-text-muted)", fontWeight: 600 }}>
              ESTATE CONSOLE PREVIEW
            </span>
            <span className="badge badge-success">Live Ready</span>
          </div>
          <div className="preview-card-body">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: "12px",
                borderBottom: "1px solid var(--dw-border)",
                marginBottom: "14px",
              }}
            >
              <div>
                <strong style={{ fontSize: "0.95rem" }}>Primary Last Will &amp; Testament</strong>
                <div style={{ fontSize: "0.78rem", color: "var(--dw-text-muted)" }}>
                  Status: Active &bull; 100% Nominee Allocated
                </div>
              </div>
              <span className="badge badge-primary">Active</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
              <div
                style={{
                  padding: "10px",
                  backgroundColor: "var(--dw-bg-primary)",
                  borderRadius: "6px",
                  border: "1px solid var(--dw-border)",
                }}
              >
                <span style={{ fontSize: "0.72rem", color: "var(--dw-text-muted)", display: "block" }}>
                  Cataloged Valuation
                </span>
                <strong style={{ fontSize: "1.05rem", color: "#16845B" }}>
                  ₹4,800,000
                </strong>
              </div>
              <div
                style={{
                  padding: "10px",
                  backgroundColor: "var(--dw-bg-primary)",
                  borderRadius: "6px",
                  border: "1px solid var(--dw-border)",
                }}
              >
                <span style={{ fontSize: "0.72rem", color: "var(--dw-text-muted)", display: "block" }}>
                  Inactivity Threshold
                </span>
                <strong style={{ fontSize: "1.05rem", color: "#3157A4" }}>
                  30 Days
                </strong>
              </div>
            </div>

            <div
              style={{
                padding: "10px 12px",
                backgroundColor: "var(--dw-success-light)",
                borderRadius: "6px",
                fontSize: "0.78rem",
                color: "var(--dw-success)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaShieldAlt size={12} />
              <span>Death verification strictly required before beneficiary release</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. WORKFLOW: HOW IT WORKS
          ===================================================================== */}
      <section className="workflow-section" id="how-it-works">
        <div className="workflow-container">
          <div className="section-header">
            <span className="section-label">Succession Protocol</span>
            <h2 className="section-title">How Digital-Will Protects Your Estate</h2>
            <p className="section-desc">
              A structured 4-step framework bridging digital assets with legal testamentary
              enforceability and verified inheritance.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3 className="step-title">Catalog Estate Assets</h3>
              <p className="step-desc">
                Register bank accounts, investment portfolios, real estate, and digital credentials
                with estimated valuations and storage directives.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h3 className="step-title">Draft Digital Will</h3>
              <p className="step-desc">
                Structure your legal directives, appoint executors, designate nominees, and define
                exact share percentages totaling 100%.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h3 className="step-title">Inactivity Heartbeat</h3>
              <p className="step-desc">
                Configure automated check-in intervals (30-90 days). If activity ceases, formal
                warning pings alert emergency contacts.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">04</div>
              <h3 className="step-title">Human-Verified Release</h3>
              <p className="step-desc">
                Claimants submit certified death certificates. Human administrators inspect
                evidence before releasing files to beneficiaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. CORE FEATURES & CAPABILITIES
          ===================================================================== */}
      <section className="features-section" id="features">
        <div className="section-header">
          <span className="section-label">Enterprise Architecture</span>
          <h2 className="section-title">Institutional Grade Estate Security</h2>
          <p className="section-desc">
            Designed for high net-worth individuals, crypto asset holders, and modern families
            requiring absolute succession integrity.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-box">
            <div className="feature-icon-wrap">
              <FaFileContract size={18} />
            </div>
            <h3 className="feature-title">Digital Will Builder</h3>
            <p className="feature-desc">
              Generate structured legal testaments with detailed asset distribution, nominee
              percentages, and court-ready PDF export.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrap">
              <FaCloud size={18} />
            </div>
            <h3 className="feature-title">AWS S3 Cloud Vault</h3>
            <p className="feature-desc">
              Store property titles, identity scans, and encrypted key backups in AWS S3 with
              server-side encryption and time-limited pre-signed URLs.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrap">
              <FaUsers size={18} />
            </div>
            <h3 className="feature-title">Beneficiary Roster</h3>
            <p className="feature-desc">
              Assign nominees, spouses, children, or trustees. Controlled portals restrict access
              until formal verification is approved.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrap">
              <FaClock size={18} />
            </div>
            <h3 className="feature-title">Inactivity Algorithm</h3>
            <p className="feature-desc">
              Automated dead man&apos;s switch monitoring user activity. Inactivity triggers alerts
              and invites evidence without automatic release.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrap">
              <FaShieldAlt size={18} />
            </div>
            <h3 className="feature-title">Death Verification Review</h3>
            <p className="feature-desc">
              Certified document proof review by administrators. Estate records remain sealed until
              formal legal confirmation.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrap">
              <FaLock size={18} />
            </div>
            <h3 className="feature-title">Immutable Audit Trail</h3>
            <p className="feature-desc">
              Every creation, modification, document access, and administrator decision is
              indexed in tamper-evident activity logs.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. SECURITY & LEGAL GUARANTEE
          ===================================================================== */}
      <section style={{ backgroundColor: "var(--dw-bg-content)", padding: "60px 24px", borderTop: "1px solid var(--dw-border)" }} id="security">
        <div className="security-banner">
          <div>
            <span className="section-label">Legal Safety Standard</span>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "12px" }}>
              Inactivity Never Automatically Establishes Death
            </h2>
            <p style={{ fontSize: "0.9rem", color: "var(--dw-text-muted)", lineHeight: "1.6" }}>
              Unlike insecure systems that release assets merely because an email goes unanswered,
              DigitalWill requires human administrator review, official certified death certificate
              evidence, and audit tracking before any beneficiary access is unlocked.
            </p>
          </div>
          <div
            style={{
              padding: "24px",
              backgroundColor: "var(--dw-bg-primary)",
              borderRadius: "8px",
              border: "1px solid var(--dw-border)",
            }}
          >
            <h4 style={{ marginBottom: "10px", fontSize: "0.95rem" }}>Platform Guarantees:</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.85rem", color: "var(--dw-text-muted)" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FaCheckCircle color="#16845B" size={13} /> Strict separation between inactivity and proof of death
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FaCheckCircle color="#16845B" size={13} /> Time-limited pre-signed URLs for document access
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FaCheckCircle color="#16845B" size={13} /> Encrypted password hashing with bcrypt and JWT rotation
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FaCheckCircle color="#16845B" size={13} /> Zero arbitrary release without authorized claim verification
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
