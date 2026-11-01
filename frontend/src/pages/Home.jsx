import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaShieldAlt,
  FaLock,
  FaCloud,
  FaFileContract,
  FaUsers,
  FaBell,
  FaSlidersH,
  FaCheckCircle,
  FaArrowRight,
  FaEnvelope,
  FaCoins,
  FaUserShield,
} from "react-icons/fa";
import Footer from "../components/Footer";
import "./Home.css";

function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className="home-container" id="top">
      {/* Background Cyber Grid */}
      <div className="home-bg-grid" aria-hidden="true" />

      {/* =====================================================================
          1. HERO SECTION
          ===================================================================== */}
      <section className="hero-section">
        {/* Left Column: Headline & Value Proposition */}
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Small Badge */}
          <div className="hero-badge">
            <span className="badge-pulse-dot" />
            <span>Secure • Private • Always Yours</span>
          </div>

          {/* Heading */}
          <h1 className="hero-heading">
            Your Digital Legacy{" "}
            <span className="hero-heading-highlight">Matters</span>
          </h1>

          {/* Description */}
          <p className="hero-description">
            A high-assurance, encrypted digital estate management platform.
            Securely catalog your digital assets, store sensitive documents in a
            private AWS S3 cloud vault, designate beneficiaries, and establish
            verifiable succession protocols with total peace of mind.
          </p>

          {/* Action Buttons */}
          <div className="hero-cta-group">
            <Link
              to={token ? "/dashboard" : "/register"}
              className="btn-primary-hero"
            >
              <span>{token ? "Go to Dashboard" : "Get Started"}</span>
              <FaArrowRight size={13} />
            </Link>

            <a href="#features" className="btn-secondary-hero">
              <span>Learn More</span>
            </a>
          </div>

          {/* Three Small Trust Indicators */}
          <div className="hero-trust-indicators">
            <div className="trust-item">
              <span className="trust-item-icon">
                <FaLock size={12} />
              </span>
              <span>256-Bit Encryption</span>
            </div>

            <div className="trust-item">
              <span className="trust-item-icon">
                <FaUserShield size={13} />
              </span>
              <span>Zero-Knowledge Privacy</span>
            </div>

            <div className="trust-item">
              <span className="trust-item-icon">
                <FaCheckCircle size={12} />
              </span>
              <span>Automated Continuity</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Cybersecurity Laptop & Holographic Shield Illustration */}
        <motion.div
          className="cyber-illustration-wrap"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <div className="cyber-radial-glow" aria-hidden="true" />

          {/* Floating Holographic Badge: Top-Right Shield & Lock */}
          <motion.div
            className="floating-badge badge-shield"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="badge-icon-wrap cyan">
              <FaShieldAlt size={16} />
            </div>
            <div>
              <div className="badge-text-title">Encrypted Shield</div>
              <div className="badge-text-sub">SHA-256 Validated</div>
            </div>
          </motion.div>

          {/* Floating Holographic Badge: Left Cloud Vault */}
          <motion.div
            className="floating-badge badge-cloud"
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          >
            <div className="badge-icon-wrap blue">
              <FaCloud size={16} />
            </div>
            <div>
              <div className="badge-text-title">AWS S3 Vault</div>
              <div className="badge-text-sub">Private Storage Active</div>
            </div>
          </motion.div>

          {/* Floating Holographic Badge: Bottom-Right Will Doc */}
          <motion.div
            className="floating-badge badge-doc"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <div className="badge-icon-wrap cyan">
              <FaFileContract size={15} />
            </div>
            <div>
              <div className="badge-text-title">Digital Will #01</div>
              <div className="badge-text-sub">PDF Export Ready</div>
            </div>
          </motion.div>

          {/* Central Laptop Chassis */}
          <div className="laptop-chassis">
            {/* Laptop Window Top Bar */}
            <div className="laptop-top-bar">
              <div className="window-dots">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>

              <div className="screen-status-pill">
                <span className="badge-pulse-dot" />
                <span>VAULT: ENCRYPTED // ACTIVE</span>
              </div>
            </div>

            {/* Laptop Screen Content (Simulated DigitalWill Platform) */}
            <div className="laptop-screen-content">
              {/* Row 1: Key Metrics */}
              <div className="screen-metrics-row">
                <div className="screen-metric-box">
                  <div className="metric-label">Estate Status</div>
                  <div className="metric-value green">PROTECTED</div>
                </div>

                <div className="screen-metric-box">
                  <div className="metric-label">Assets Verified</div>
                  <div className="metric-value cyan">8 LEDGER</div>
                </div>

                <div className="screen-metric-box">
                  <div className="metric-label">Nominees</div>
                  <div className="metric-value blue">100% SPLIT</div>
                </div>
              </div>

              {/* Row 2: Live Activity Waveform / Security Monitor */}
              <div className="screen-activity-card">
                <div className="activity-header">
                  <span>Dead Man Protocol Monitor</span>
                  <span className="activity-badge">Daily Check: OK</span>
                </div>

                {/* SVG Circuit Waveform */}
                <svg
                  className="activity-waveform"
                  viewBox="0 0 320 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 24H60L72 10L86 38L98 18L108 30L118 24H210L222 8L234 40L246 16L256 32L266 24H320"
                    stroke="#123C5C"
                    strokeWidth="2"
                  />
                  <path
                    d="M0 24H60L72 10L86 38L98 18L108 30L118 24H210L222 8L234 40L246 16L256 32L266 24H320"
                    stroke="url(#gradient-waveform)"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                  />
                  <defs>
                    <linearGradient id="gradient-waveform" x1="0" y1="0" x2="320" y2="0" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#00A8FF" />
                      <stop offset="0.6" stopColor="#20D4FF" />
                      <stop offset="1" stopColor="#00A8FF" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          {/* Laptop Base Stand */}
          <div className="laptop-base-stand">
            <div className="laptop-notch" />
          </div>
        </motion.div>
      </section>

      {/* =====================================================================
          2. TRUST STRIP
          ===================================================================== */}
      <section className="trust-strip-container" aria-label="Platform Trust & Security">
        <div className="trust-strip-inner">
          <div className="trust-card">
            <div className="trust-card-icon">
              <FaLock size={18} />
            </div>
            <div>
              <div className="trust-card-title">Strict Data Isolation</div>
              <div className="trust-card-desc">
                Owner-scoped authorization ensures no cross-tenant direct object access.
              </div>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-card-icon">
              <FaCloud size={18} />
            </div>
            <div>
              <div className="trust-card-title">Private AWS S3 Vault</div>
              <div className="trust-card-desc">
                Sensitive documents stored in private buckets with short-lived presigned access.
              </div>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-card-icon">
              <FaShieldAlt size={18} />
            </div>
            <div>
              <div className="trust-card-title">Verifiable Succession</div>
              <div className="trust-card-desc">
                Automated Dead Man checks require confirmed verification before nominee release.
              </div>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-card-icon">
              <FaFileContract size={18} />
            </div>
            <div>
              <div className="trust-card-title">Immutable Audit Logs</div>
              <div className="trust-card-desc">
                Comprehensive security logging for document access, asset edits, and status changes.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. FEATURES SECTION (Five Aligned Cards)
          ===================================================================== */}
      <section className="features-section" id="features">
        <div className="section-header-center">
          <span className="section-badge">Capabilities</span>
          <h2 className="section-title">Institutional-Grade Digital Estate Tools</h2>
          <p className="section-subtitle">
            Purpose-built architecture to catalog, encrypt, and administer your
            digital assets and succession directives in one unified interface.
          </p>
        </div>

        <div className="features-grid-5">
          {/* Card 1: Secure Storage */}
          <motion.div
            className="feature-card-item"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <div className="feature-card-icon-box">
              <FaLock size={22} />
            </div>
            <h3 className="feature-card-title">Secure Storage</h3>
            <p className="feature-card-desc">
              Store legal deeds, confidential certificates, and credentials in an
              isolated AWS S3 cloud vault guarded by signature verification.
            </p>
          </motion.div>

          {/* Card 2: Organize Your Assets */}
          <motion.div
            className="feature-card-item"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <div className="feature-card-icon-box">
              <FaCoins size={22} />
            </div>
            <h3 className="feature-card-title">Organize Your Assets</h3>
            <p className="feature-card-desc">
              Consolidate financial accounts, crypto holdings, physical real estate,
              and investments in a verifiable, structured inventory.
            </p>
          </motion.div>

          {/* Card 3: Set Beneficiaries */}
          <motion.div
            className="feature-card-item"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <div className="feature-card-icon-box">
              <FaUsers size={22} />
            </div>
            <h3 className="feature-card-title">Set Beneficiaries</h3>
            <p className="feature-card-desc">
              Designate heirs, nominees, and executors with precise percentage
              distributions and customized disbursement instructions.
            </p>
          </motion.div>

          {/* Card 4: Stay Informed */}
          <motion.div
            className="feature-card-item"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <div className="feature-card-icon-box">
              <FaBell size={22} />
            </div>
            <h3 className="feature-card-title">Stay Informed</h3>
            <p className="feature-card-desc">
              Receive immediate security notifications, verification alerts, and
              detailed audit logs for every session and file interaction.
            </p>
          </motion.div>

          {/* Card 5: Total Control */}
          <motion.div
            className="feature-card-item"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <div className="feature-card-icon-box">
              <FaSlidersH size={22} />
            </div>
            <h3 className="feature-card-title">Total Control</h3>
            <p className="feature-card-desc">
              Retain revocable authority to modify allocations, update assets,
              adjust inactivity intervals, and export timestamped PDF summaries.
            </p>
          </motion.div>
        </div>
      </section>

      {/* =====================================================================
          4. HOW IT WORKS SECTION
          ===================================================================== */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="how-it-works-inner">
          <div className="section-header-center">
            <span className="section-badge">Workflow</span>
            <h2 className="section-title">How DigitalWill Works</h2>
            <p className="section-subtitle">
              A straightforward four-stage workflow designed for maximum security
              and smooth succession execution.
            </p>
          </div>

          <div className="steps-grid-4">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3 className="step-title">Create Account</h3>
              <p className="step-desc">
                Register with email verification and establish your encrypted digital estate environment.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h3 className="step-title">Catalog Assets</h3>
              <p className="step-desc">
                Input properties, accounts, and policies while uploading essential proof documents to your vault.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h3 className="step-title">Assign Nominees</h3>
              <p className="step-desc">
                Designate beneficiaries and allocate explicit inheritance percentages and clear execution notes.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">04</div>
              <h3 className="step-title">Verified Release</h3>
              <p className="step-desc">
                The Dead Man monitor and death verification workflow ensure documents are released only when verified.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. ABOUT & SECURITY PHILOSOPHY SECTION
          ===================================================================== */}
      <section className="about-section" id="about">
        <div className="about-grid">
          <div className="about-card">
            <h3>Why Digital Will Management Matters</h3>
            <p>
              In the modern era, a significant portion of personal wealth and critical
              records exists entirely online—cryptocurrency wallets, cloud storage,
              brokerage portals, and domain registries. Without an organized directive,
              these digital assets become permanently inaccessible upon sudden incapacitation.
            </p>
            <p>
              DigitalWill bridges the gap between digital asset catalogs and intended
              heirs, eliminating lost accounts and chaotic inheritance disputes.
            </p>
            <div className="highlight-box">
              <strong>Guaranteed Isolation:</strong> Only you have direct editing authority over
              your drafts, assets, and private document archives.
            </div>
          </div>

          <div className="about-card">
            <h3>Architecture & Legal Transparency</h3>
            <p>
              DigitalWill utilizes defense-in-depth security: seven-day revocable JWT
              tokens, magic-byte file signature validation to eliminate executable malware,
              and presigned short-lived S3 URLs to ensure your files never touch public links.
            </p>
            <p>
              <strong>Jurisdictional Disclaimer:</strong> DigitalWill provides structured
              record-keeping, encrypted storage, and nominee communication. Formal
              legal validity, holographic or attested will execution, and probate
              statutes vary by jurisdiction.
            </p>
            <div className="highlight-box">
              <strong>Audit Trail:</strong> Every action is immutably timestamped in the system audit
              log for complete transparency.
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. CONTACT & SUPPORT SECTION
          ===================================================================== */}
      <section className="contact-section" id="contact">
        <div className="contact-box">
          <div>
            <span className="section-badge">Support & Assistance</span>
            <h2 style={{ fontSize: "28px", fontWeight: 700, margin: "10px 0 14px", color: "#F3F7FF" }}>
              Have Questions About Estate Security?
            </h2>
            <p style={{ color: "#A8BDD2", fontSize: "15px", lineHeight: "1.7", maxWidth: "520px", margin: 0 }}>
              Our security architecture team is available to guide you through digital asset
              protection, vault setup, and nominee management.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "flex-start" }}>
            <Link to={token ? "/dashboard" : "/register"} className="contact-cta-btn">
              <span>{token ? "Access Dashboard" : "Protect Your Estate Today"}</span>
              <FaArrowRight size={13} />
            </Link>

            <a
              href="mailto:support@digitalwill.local"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "#20D4FF",
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              <FaEnvelope size={14} />
              <span>support@digitalwill.local</span>
            </a>
          </div>
        </div>
      </section>

      {/* Modernized Dark Cybersecurity Footer */}
      <Footer />
    </div>
  );
}

export default Home;
