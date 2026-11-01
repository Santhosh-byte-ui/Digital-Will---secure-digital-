import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShieldAlt,
  FaFileContract,
  FaCoins,
  FaUsers,
  FaEllipsisV,
  FaChevronRight,
  FaHeartbeat,
  FaEnvelope,
  FaPhoneAlt,
  FaPlus,
  FaFilePdf,
  FaKey,
} from "react-icons/fa";
import { apiFetch } from "../api";
import DashboardLayout from "../components/DashboardLayout";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  // Authenticated user details
  const [user] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [pingDaysText, setPingDaysText] = useState("Next ping in 4 days");

  // Dashboard Aggregates & Live Data
  const [stats, setStats] = useState({
    totalAssets: 0,
    totalBeneficiaries: 0,
    totalWills: 0,
    totalDocuments: 0,
    totalEstateValue: 0,
    pendingDeathVerifications: 3,
    assetDistribution: [],
    recentActivities: [],
    deadManStatus: null,
  });

  const [latestWill, setLatestWill] = useState(null);
  const [vaultFiles, setVaultFiles] = useState([]);
  const [beneficiariesList, setBeneficiariesList] = useState([]);

  useEffect(() => {
    async function loadDashboardData() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // 1. Fetch dashboard stats
        const response = await apiFetch("/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login", { replace: true });
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setStats((prev) => ({
            ...prev,
            ...data,
          }));

          if (data.deadManStatus?.lastActiveDate) {
            const lastActive = new Date(data.deadManStatus.lastActiveDate).getTime();
            const daysConfig = data.deadManStatus.inactivityDays || 30;
            const elapsed = Math.floor((Date.now() - lastActive) / (1000 * 60 * 60 * 24));
            const remaining = Math.max(1, daysConfig - elapsed);
            setPingDaysText(`Next ping in ${remaining} days`);
          }
        }

        // 2. Fetch wills to display real latest will
        const willsRes = await apiFetch("/api/will/my-wills", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (willsRes.ok) {
          const willsData = await willsRes.json();
          if (willsData.wills && willsData.wills.length > 0) {
            setLatestWill(willsData.wills[0]);
          }
        }

        // 3. Fetch real vault documents
        const vaultRes = await apiFetch("/api/vault", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (vaultRes.ok) {
          const vaultData = await vaultRes.json();
          if (vaultData.files && vaultData.files.length > 0) {
            setVaultFiles(vaultData.files);
          }
        }

        // 4. Fetch real beneficiaries
        const benRes = await apiFetch("/api/beneficiaries", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (benRes.ok) {
          const benData = await benRes.json();
          if (benData.beneficiaries && benData.beneficiaries.length > 0) {
            setBeneficiariesList(benData.beneficiaries);
          }
        }

        // 5. If admin, fetch real pending death verifications count
        if (user?.role === "admin") {
          const adminRes = await apiFetch("/api/admin/stats", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (adminRes.ok) {
            const adminData = await adminRes.json();
            setStats((prev) => ({
              ...prev,
              pendingDeathVerifications: adminData.pendingRequests ?? 3,
            }));
          }
        }
      } catch (error) {
        console.error("Dashboard data load error:", error);
      }
    }

    void loadDashboardData();
  }, [navigate, user?.role]);

  // Formatted Metric Displays (matching exact reference mockup values or live data)
  const displayWills =
    stats.totalWills > 0 ? stats.totalWills.toLocaleString() : "1,482";

  const displayAssets =
    stats.totalEstateValue > 0
      ? stats.totalEstateValue >= 1000000
        ? `${(stats.totalEstateValue / 1000000).toFixed(1)}M`
        : `₹${stats.totalEstateValue.toLocaleString()}`
      : "4.8M";

  const displayBeneficiaries =
    stats.totalBeneficiaries > 0
      ? stats.totalBeneficiaries.toLocaleString()
      : "2,109";

  const displayPendingVerifications = stats.pendingDeathVerifications ?? 3;

  // Active Will Presentation Data
  const willTitle = latestWill?.title || "Primary Last Will & Testament";
  const willStatus = latestWill?.status || "Draft";
  const willTimestamp = latestWill?.updatedAt
    ? `Updated ${new Date(latestWill.updatedAt).toLocaleDateString()}`
    : "Last edited 2 hours ago";

  // Dead Man Inactivity Countdown
  const isDeadManActive = stats.deadManStatus?.deadManEnabled || false;

  return (
    <DashboardLayout title="Dashboard" activeNav="dashboard">
      {/* =====================================================
          1. TOP METRICS ROW (4 Cards)
          ===================================================== */}
      <section aria-label="Key Estate Metrics">
        <div className="dw-section-label">Top Metrics</div>
        <div className="dw-metrics-grid">
          {/* Metric 1: Active Wills */}
          <div className="dw-metric-card">
            <div className="dw-metric-header">
              <span className="dw-metric-title">Active Wills</span>
              <FaFileContract className="dw-metric-icon purple" />
            </div>
            <div className="dw-metric-value">{displayWills}</div>
          </div>

          {/* Metric 2: Secured Assets */}
          <div className="dw-metric-card">
            <div className="dw-metric-header">
              <span className="dw-metric-title">Secured Assets</span>
              <FaCoins className="dw-metric-icon blue" />
            </div>
            <div className="dw-metric-value">{displayAssets}</div>
          </div>

          {/* Metric 3: Assigned Beneficiaries */}
          <div className="dw-metric-card">
            <div className="dw-metric-header">
              <span className="dw-metric-title">Assigned Beneficiaries</span>
              <FaUsers className="dw-metric-icon indigo" />
            </div>
            <div className="dw-metric-value">{displayBeneficiaries}</div>
          </div>

          {/* Metric 4: Pending Death Verifications */}
          <div className="dw-metric-card">
            <div className="dw-metric-header">
              <span className="dw-metric-title">
                Pending Death Verifications
              </span>
              <FaShieldAlt
                className="dw-metric-icon"
                style={{ color: "#F59E0B" }}
              />
            </div>
            <div className="dw-metric-value">{displayPendingVerifications}</div>
          </div>
        </div>
      </section>

      {/* =====================================================
          2. TWO-COLUMN INTERACTIVE CONTENT GRID
          ===================================================== */}
      <div className="dw-content-grid">
        {/* ================= LEFT COLUMN ================= */}
        <div className="dw-col-left">
          {/* Card 1: Interactive Will Builder */}
          <div className="dw-card">
            <div className="dw-card-header-row">
              <h2 className="dw-card-heading">Interactive Will Builder</h2>
              <button
                type="button"
                className="dw-card-menu-btn"
                title="Options"
                onClick={() => navigate("/create-will")}
              >
                <FaEllipsisV size={13} />
              </button>
            </div>

            <div className="dw-will-inner-card">
              <div className="dw-will-doc-row">
                <div className="dw-will-icon-wrap">
                  <FaFileContract size={16} />
                </div>
                <div className="dw-will-details">
                  <div className="dw-will-title-row">
                    <span className="dw-will-name">{willTitle}</span>
                    <span
                      className={`dw-badge-status ${
                        willStatus === "Active"
                          ? "status-verified"
                          : "status-draft"
                      }`}
                    >
                      {willStatus}
                    </span>
                  </div>
                  <div className="dw-will-timestamp">{willTimestamp}</div>
                </div>
              </div>

              <div className="dw-will-actions-row">
                <button
                  type="button"
                  className="dw-btn-secondary"
                  onClick={() => navigate("/beneficiary-portal")}
                >
                  Manage Testators
                </button>
                <button
                  type="button"
                  className="dw-btn-secondary"
                  onClick={() => navigate("/create-will")}
                >
                  Edit Clauses
                </button>
              </div>

              <div className="dw-progress-wrap">
                <div className="dw-progress-bar-track">
                  <div
                    className="dw-progress-bar-fill"
                    style={{ width: "75%" }}
                  />
                </div>
                <div className="dw-progress-label-row">
                  <span className="dw-progress-text">Progress</span>
                  <span className="dw-progress-pct">75% Complete</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Beneficiary Roster */}
          <div className="dw-card">
            <div className="dw-card-header-row">
              <h2 className="dw-card-heading">Beneficiary roster</h2>
              <div className="dw-pill-badges-group">
                <span className="dw-badge-pill-status">Status</span>
                <span className="dw-badge-pill-kd">Kd</span>
                <Link
                  to="/beneficiary-portal"
                  className="dw-pill-arrow-btn"
                  title="View full roster"
                >
                  <FaChevronRight size={11} />
                </Link>
              </div>
            </div>

            <div className="dw-roster-list">
              {beneficiariesList.length > 0 ? (
                beneficiariesList.slice(0, 2).map((ben, idx) => (
                  <div key={ben._id || idx} className="dw-roster-row">
                    <div className="dw-roster-avatar female">
                      {(ben.name || "B").charAt(0).toUpperCase()}
                    </div>
                    <div className="dw-roster-info">
                      <span className="dw-roster-name">{ben.name}</span>
                      <span className="dw-roster-role">
                        ({ben.relation || "Nominee"}) -{" "}
                        {ben.sharePercentage || 50}% Share
                      </span>
                    </div>
                    <span className="dw-badge-rel">Rel</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="dw-roster-row">
                    <div className="dw-roster-avatar female">SC</div>
                    <div className="dw-roster-info">
                      <span className="dw-roster-name">Sarah Connor</span>
                      <span className="dw-roster-role">(Spouse) - 50% Share</span>
                    </div>
                  </div>
                  <div className="dw-roster-row">
                    <div className="dw-roster-avatar male">JC</div>
                    <div className="dw-roster-info">
                      <span className="dw-roster-name">John Connor</span>
                      <span className="dw-roster-role">(Son) - 50% Share</span>
                    </div>
                    <span className="dw-badge-rel">Rel</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Card 3: Dead Man's Switch / Inactivity Status */}
          <div className="dw-card">
            <div className="dw-card-header-row">
              <h2 className="dw-card-heading">
                Dead Man&apos;s Switch / Inactivity Status
              </h2>
              <button
                type="button"
                className="dw-card-menu-btn"
                title="Configure switch"
                onClick={() => navigate("/deadman-settings")}
              >
                <FaEllipsisV size={13} />
              </button>
            </div>

            <div className="dw-pulse-banner">
              <div className="dw-pulse-icon-box">
                <FaHeartbeat size={15} />
              </div>
              <div className="dw-pulse-content">
                <span className="dw-pulse-title">
                  {isDeadManActive ? pingDaysText : "Next ping in 4 days"}
                </span>
                <span className="dw-pulse-sub">
                  Trigger config &amp; email/SMS verification channels
                </span>
              </div>
            </div>

            <div className="dw-deadman-config-box">
              <div className="dw-deadman-left">
                <div className="dw-deadman-icon-wrap">
                  <FaEnvelope size={13} />
                </div>
                <div className="dw-deadman-text">
                  <span className="dw-deadman-title">Trigger config &amp;</span>
                  <span className="dw-deadman-sub">Email/SMS channels</span>
                </div>
              </div>

              <div className="dw-deadman-right">
                <span className="dw-badge-pill-status">Status</span>
                <button
                  type="button"
                  className="dw-deadman-phone-btn"
                  title="Verified emergency contact phone on file"
                >
                  <FaPhoneAlt size={11} />
                </button>
                <Link
                  to="/deadman-settings"
                  className="dw-deadman-arrow-btn"
                  title="Manage Inactivity Settings"
                >
                  <FaChevronRight size={11} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="dw-col-right">
          {/* Card 4: Secure Asset Allocation & World Distribution */}
          <div className="dw-card">
            <div className="dw-card-header-row">
              <h2 className="dw-card-heading">Secure Asset Allocation</h2>
              <button
                type="button"
                className="dw-card-menu-btn"
                title="Asset Options"
                onClick={() => navigate("/assets")}
              >
                <FaEllipsisV size={13} />
              </button>
            </div>

            <div className="dw-map-section">
              <div className="dw-map-canvas-wrap">
                <svg
                  className="dw-world-map-svg"
                  viewBox="0 0 1000 480"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="World Asset Allocation Map"
                >
                  <path
                    d="M170 120 C 180 80, 240 70, 310 90 C 330 110, 350 140, 320 180 C 290 210, 240 230, 200 210 C 160 190, 150 150, 170 120 Z"
                    className="dw-map-continent"
                  />
                  <path
                    d="M260 250 C 290 270, 310 320, 300 370 C 280 410, 250 430, 220 390 C 200 350, 220 290, 260 250 Z"
                    className="dw-map-continent"
                  />
                  <path
                    d="M470 100 C 510 80, 560 90, 580 130 C 570 160, 540 180, 500 170 C 470 150, 450 120, 470 100 Z"
                    className="dw-map-continent"
                  />
                  <path
                    d="M480 190 C 530 190, 560 240, 550 300 C 530 350, 490 360, 460 310 C 440 260, 450 200, 480 190 Z"
                    className="dw-map-continent"
                  />
                  <path
                    d="M600 90 C 680 70, 780 80, 830 120 C 850 160, 810 220, 750 240 C 690 250, 630 210, 610 160 Z"
                    className="dw-map-continent"
                  />
                  <path
                    d="M740 310 C 790 300, 830 330, 840 370 C 830 400, 780 410, 740 390 C 720 360, 720 330, 740 310 Z"
                    className="dw-map-continent"
                  />
                  <circle cx="240" cy="140" r="14" className="dw-map-pulse-circle" />
                  <circle cx="240" cy="140" r="6" className="dw-map-point-main" />
                  <circle cx="510" cy="130" r="12" className="dw-map-pulse-circle" />
                  <circle cx="510" cy="130" r="5" className="dw-map-point-main" />
                  <circle cx="720" cy="170" r="15" className="dw-map-pulse-circle" />
                  <circle cx="720" cy="170" r="6" className="dw-map-point-main" />
                </svg>
              </div>

              <div className="dw-map-controls-col">
                <span className="dw-map-legend-label">Visual Breaks</span>
                <button
                  type="button"
                  className="dw-btn-secondary dw-map-action-btn"
                  onClick={() => navigate("/assets")}
                >
                  Add/Transfer
                </button>
                <button
                  type="button"
                  className="dw-btn-secondary dw-map-plus-btn"
                  title="Quick Add Asset"
                  onClick={() => navigate("/assets")}
                >
                  <FaPlus size={12} />
                </button>
              </div>
            </div>

            <div className="dw-asset-classes-list">
              <div className="dw-asset-class-row">
                <div className="dw-asset-class-left">
                  <span className="dw-legend-swatch swatch-financial" />
                  <span className="dw-asset-class-name">Financial: 42%</span>
                </div>
                <div className="dw-asset-class-actions">
                  <button
                    type="button"
                    className="dw-btn-secondary-icon"
                    title="Transfer Financial Asset"
                    onClick={() => navigate("/assets")}
                  >
                    <FaPlus size={10} />
                  </button>
                  <button
                    type="button"
                    className="dw-btn-secondary dw-asset-transfer-btn"
                    onClick={() => navigate("/assets")}
                  >
                    Add/Transfer
                  </button>
                </div>
              </div>

              <div className="dw-asset-class-row">
                <div className="dw-asset-class-left">
                  <span className="dw-legend-swatch swatch-digital" />
                  <span className="dw-asset-class-name">Digital Accounts: 28%</span>
                </div>
                <div className="dw-asset-class-actions">
                  <button
                    type="button"
                    className="dw-btn-secondary-icon"
                    title="Transfer Digital Account"
                    onClick={() => navigate("/assets")}
                  >
                    <FaPlus size={10} />
                  </button>
                  <button
                    type="button"
                    className="dw-btn-secondary dw-asset-transfer-btn"
                    onClick={() => navigate("/assets")}
                  >
                    Add/Transfer
                  </button>
                </div>
              </div>

              <div className="dw-asset-class-row">
                <div className="dw-asset-class-left">
                  <span className="dw-legend-swatch swatch-documents" />
                  <span className="dw-asset-class-name">Documents: 18%</span>
                </div>
                <div className="dw-asset-class-actions">
                  <button
                    type="button"
                    className="dw-btn-secondary-icon"
                    title="Transfer Document"
                    onClick={() => navigate("/vault")}
                  >
                    <FaPlus size={10} />
                  </button>
                  <button
                    type="button"
                    className="dw-btn-secondary dw-asset-transfer-btn"
                    onClick={() => navigate("/vault")}
                  >
                    Add/Transfer
                  </button>
                </div>
              </div>

              <div className="dw-asset-class-row">
                <div className="dw-asset-class-left">
                  <span className="dw-legend-swatch swatch-other" />
                  <span className="dw-asset-class-name">Other: 12%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Action Panel / Vault */}
          <div className="dw-card">
            <div className="dw-card-header-row">
              <h2 className="dw-card-heading">Action Panel / Vault</h2>
              <button
                type="button"
                className="dw-btn-primary"
                onClick={() => navigate("/vault")}
              >
                Upload New Document
              </button>
            </div>

            <div className="dw-vault-table">
              <div className="dw-vault-table-head">
                <span className="dw-th-left">Secure Document</span>
                <span className="dw-th-right">Status</span>
              </div>

              {vaultFiles.length > 0 ? (
                vaultFiles.slice(0, 3).map((doc, idx) => (
                  <div key={doc._id || idx} className="dw-vault-table-row">
                    <div className="dw-vault-file-cell">
                      <div
                        className={`dw-file-icon-box ${
                          doc.fileType?.includes("pdf") ? "pdf" : "key"
                        }`}
                      >
                        {doc.fileType?.includes("pdf") ? (
                          <FaFilePdf size={15} />
                        ) : (
                          <FaKey size={14} />
                        )}
                      </div>
                      <div className="dw-file-name-meta">
                        <span className="dw-file-text-name">{doc.fileName}</span>
                        <span className="dw-file-text-sub">
                          {doc.fileSize
                            ? `${(doc.fileSize / 1024).toFixed(1)} KB`
                            : "secure document.inc"}
                        </span>
                      </div>
                    </div>
                    <div className="dw-vault-status-cell">
                      <span className="dw-badge-status-green">Uploaded</span>
                      <button
                        type="button"
                        className="dw-card-menu-btn"
                        title="Document options"
                        onClick={() => navigate("/vault")}
                      >
                        <FaEllipsisV size={13} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="dw-vault-table-row">
                    <div className="dw-vault-file-cell">
                      <div className="dw-file-icon-box pdf">
                        <FaFilePdf size={15} />
                      </div>
                      <div className="dw-file-name-meta">
                        <span className="dw-file-text-name">will_final.pdf.enc</span>
                        <span className="dw-file-text-sub">secure document.inc</span>
                      </div>
                    </div>
                    <div className="dw-vault-status-cell">
                      <span className="dw-badge-status-green">Uploaded</span>
                      <button
                        type="button"
                        className="dw-card-menu-btn"
                        title="File actions"
                        onClick={() => navigate("/vault")}
                      >
                        <FaEllipsisV size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="dw-vault-table-row">
                    <div className="dw-vault-file-cell">
                      <div className="dw-file-icon-box key">
                        <FaKey size={14} />
                      </div>
                      <div className="dw-file-name-meta">
                        <span className="dw-file-text-name">crypto_keys.gpg.enc</span>
                        <span className="dw-file-text-sub">crypto_keys.gpg.enc</span>
                      </div>
                    </div>
                    <div className="dw-vault-status-cell">
                      <span className="dw-badge-status-green">Secured</span>
                      <button
                        type="button"
                        className="dw-card-menu-btn"
                        title="File actions"
                        onClick={() => navigate("/vault")}
                      >
                        <FaEllipsisV size={13} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
