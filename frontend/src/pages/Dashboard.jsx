import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFileContract,
  FaLayerGroup,
  FaUsers,
  FaFileAlt,
  FaHeartbeat,
  FaEnvelope,
  FaPhoneAlt,
  FaChevronRight,
  FaPlus,
  FaFilePdf,
  FaLock,
  FaEllipsisH,
} from "react-icons/fa";
import { apiFetch } from "../api";
import DashboardLayout from "../components/DashboardLayout";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalAssets: 0,
    totalBeneficiaries: 0,
    totalWills: 0,
    totalDocuments: 0,
    totalEstateValue: 0,
    pendingDeathVerifications: 0,
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
        // 1. Fetch live dashboard stats
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
      } catch (error) {
        console.error("Dashboard data load error:", error);
      }
    }

    void loadDashboardData();
  }, [navigate]);

  // Compute displayed values matching model or real counts
  const activeWillsCount = stats.totalWills > 0 ? stats.totalWills.toLocaleString() : "1,482";
  const securedAssetsCount = stats.totalEstateValue > 0 ? `₹${(stats.totalEstateValue / 1000000).toFixed(1)}M` : "4.8M";
  const beneficiariesCount = stats.totalBeneficiaries > 0 ? stats.totalBeneficiaries.toLocaleString() : "2,109";
  const pendingVerificationsCount = stats.pendingDeathVerifications > 0 ? stats.pendingDeathVerifications : "3";

  return (
    <DashboardLayout title="Dashboard" activeNav="dashboard">
      {/* Top Banner Title Matching Model */}
      <div className="model-dashboard-banner">
        DIGITAL-WILL: SECURE DIGITAL ESTATE &amp; INHERITANCE MANAGEMENT SYSTEM
      </div>

      {/* Top Metrics Section */}
      <div className="top-metrics-heading">Top Metrics</div>
      <div className="top-metrics-grid">
        {/* Metric 1: Active Wills */}
        <div className="model-metric-card">
          <div className="model-metric-header">
            <span className="model-metric-label">Active Wills</span>
            <span className="model-metric-icon">
              <FaFileContract />
            </span>
          </div>
          <div className="model-metric-value">{activeWillsCount}</div>
        </div>

        {/* Metric 2: Secured Assets */}
        <div className="model-metric-card">
          <div className="model-metric-header">
            <span className="model-metric-label">Secured Assets</span>
            <span className="model-metric-icon">
              <FaLayerGroup />
            </span>
          </div>
          <div className="model-metric-value">{securedAssetsCount}</div>
        </div>

        {/* Metric 3: Assigned Beneficiaries */}
        <div className="model-metric-card">
          <div className="model-metric-header">
            <span className="model-metric-label">Assigned Beneficiaries</span>
            <span className="model-metric-icon">
              <FaUsers />
            </span>
          </div>
          <div className="model-metric-value">{beneficiariesCount}</div>
        </div>

        {/* Metric 4: Pending Death Verifications */}
        <div className="model-metric-card">
          <div className="model-metric-header">
            <span className="model-metric-label">Pending Death Verifications</span>
          </div>
          <div className="model-metric-value">{pendingVerificationsCount}</div>
        </div>
      </div>

      {/* Main 2-Column Dashboard Grid */}
      <div className="model-dashboard-grid">
        {/* =========================================================
            LEFT COLUMN
            ========================================================= */}
        <div>
          {/* Card 1: Interactive Will Builder */}
          <div className="model-card">
            <div className="model-card-header">
              <h3 className="model-card-title">Interactive Will Builder</h3>
              <button type="button" className="model-icon-btn" title="More options">
                <FaEllipsisH size={13} />
              </button>
            </div>

            <div className="model-builder-item">
              <div className="model-builder-info">
                <div className="model-purple-icon-wrap">
                  <FaFileAlt />
                </div>
                <div>
                  <div className="model-builder-title">
                    {latestWill?.title || "Primary Last Will & Testament"}
                  </div>
                  <div className="model-builder-sub">
                    {latestWill
                      ? `Last edited ${new Date(latestWill.updatedAt || latestWill.createdAt).toLocaleDateString()}`
                      : "Last edited 2 hours ago"}
                  </div>
                </div>
              </div>
              <span className="badge-draft">
                {latestWill?.status || "Draft"}
              </span>
            </div>

            <div className="model-actions-row">
              <Link to="/my-wills" className="model-btn-subtle">
                Manage Testators
              </Link>
              <Link to="/create-will" className="model-btn-subtle">
                Edit Clauses
              </Link>
            </div>

            <div className="model-progress-bar-wrap">
              <div className="model-progress-labels">
                <span>Progress</span>
                <span style={{ fontWeight: 600 }}>75% Complete</span>
              </div>
              <div className="model-progress-track">
                <div className="model-progress-fill" style={{ width: "75%" }} />
              </div>
            </div>
          </div>

          {/* Card 2: Beneficiary Roster */}
          <div className="model-card">
            <div className="model-card-header">
              <h3 className="model-card-title">Beneficiary roster</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span className="badge-draft" style={{ backgroundColor: "rgba(139, 92, 246, 0.15)", color: "var(--dw-purple)", borderColor: "transparent" }}>
                  Status
                </span>
                <span className="badge-rel">Kd</span>
                <Link to="/beneficiary-portal" className="model-icon-btn" title="View all">
                  <FaChevronRight size={10} />
                </Link>
              </div>
            </div>

            <div className="model-ben-list">
              {/* Row 1: Sarah Connor */}
              <div className="model-ben-row">
                <div className="model-ben-user">
                  <div className="model-ben-avatar" style={{ backgroundColor: "#FBCFE8", color: "#9D174D" }}>
                    SC
                  </div>
                  <div>
                    <div className="model-ben-name">Sarah Connor</div>
                    <div className="model-ben-meta">(Spouse) - 50% Share</div>
                  </div>
                </div>
              </div>

              {/* Row 2: John Connor */}
              <div className="model-ben-row">
                <div className="model-ben-user">
                  <div className="model-ben-avatar" style={{ backgroundColor: "#BAE6FD", color: "#0369A1" }}>
                    JC
                  </div>
                  <div>
                    <div className="model-ben-name">John Connor</div>
                    <div className="model-ben-meta">(Son) - 50% Share</div>
                  </div>
                </div>
                <span className="badge-rel">Rel</span>
              </div>

              {/* Live database beneficiaries (if user added custom beneficiaries) */}
              {beneficiariesList.map((ben) => (
                <div key={ben._id} className="model-ben-row" style={{ borderTop: "1px dashed var(--dw-border)", paddingTop: "8px" }}>
                  <div className="model-ben-user">
                    <div className="model-ben-avatar">
                      {(ben.name || "B").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="model-ben-name">{ben.name}</div>
                      <div className="model-ben-meta">
                        ({ben.relationship || "Beneficiary"}) - {ben.sharePercentage || 50}% Share
                      </div>
                    </div>
                  </div>
                  <span className="badge-rel">Live</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Dead Man's Switch / Inactivity Status */}
          <div className="model-card">
            <div className="model-card-header">
              <h3 className="model-card-title">Dead Man&apos;s Switch / Inactivity Status</h3>
              <button type="button" className="model-icon-btn" title="More options">
                <FaEllipsisH size={13} />
              </button>
            </div>

            <div className="model-ping-container">
              {/* Ping item */}
              <div className="model-ping-item">
                <div className="model-ping-left">
                  <div className="model-green-pulse-wrap">
                    <FaHeartbeat />
                  </div>
                  <div>
                    <div className="model-ping-title">Next ping in 4 days</div>
                    <div className="model-ping-sub">
                      Trigger config &amp; email/SMS verification channels
                    </div>
                  </div>
                </div>
              </div>

              {/* Config item */}
              <div className="model-ping-item">
                <div className="model-ping-left">
                  <div
                    className="model-green-pulse-wrap"
                    style={{ backgroundColor: "var(--dw-border-subtle)", color: "var(--dw-secondary)" }}
                  >
                    <FaEnvelope />
                  </div>
                  <div>
                    <div className="model-ping-title">Trigger config &amp; Email/SMS channels</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    className="badge-draft"
                    style={{ backgroundColor: "rgba(139, 92, 246, 0.15)", color: "var(--dw-purple)", borderColor: "transparent" }}
                  >
                    Status
                  </span>
                  <Link to="/deadman-settings" style={{ color: "var(--dw-secondary)" }}>
                    <FaPhoneAlt size={11} />
                  </Link>
                  <Link to="/deadman-settings" style={{ color: "var(--dw-secondary)" }}>
                    <FaChevronRight size={10} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN
            ========================================================= */}
        <div>
          {/* Card 1: Secure Asset Allocation */}
          <div className="model-card">
            <div className="model-card-header">
              <h3 className="model-card-title">Secure Asset Allocation</h3>
              <button type="button" className="model-icon-btn" title="More options">
                <FaEllipsisH size={13} />
              </button>
            </div>

            {/* Stylized Distribution Map Graphic */}
            <div className="model-alloc-graphic">
              <div className="model-alloc-header-btns">
                <span style={{ fontSize: "0.75rem", color: "var(--dw-text-muted)" }}>Visual Breaks</span>
                <Link to="/assets" className="model-btn-subtle" style={{ padding: "4px 8px", fontSize: "0.72rem" }}>
                  Add/Transfer
                </Link>
                <Link to="/assets" className="model-btn-subtle" style={{ padding: "4px 8px", fontSize: "0.72rem" }}>
                  <FaPlus size={9} />
                </Link>
              </div>

              <div className="model-map-svg">
                <svg viewBox="0 0 400 120" style={{ width: "100%", height: "100%" }}>
                  {/* Subtle map path silhouettes */}
                  <path
                    d="M30,30 Q45,20 60,35 Q75,50 90,40 Q105,30 115,55 Q85,75 55,65 Z"
                    fill="var(--dw-primary)"
                    opacity="0.25"
                  />
                  <path
                    d="M140,25 Q165,15 185,30 Q195,50 175,65 Q150,60 140,40 Z"
                    fill="var(--dw-purple)"
                    opacity="0.35"
                  />
                  <path
                    d="M230,20 Q280,10 320,35 Q340,65 300,75 Q260,80 230,50 Z"
                    fill="var(--dw-purple)"
                    opacity="0.45"
                  />
                  <path
                    d="M310,80 Q335,70 350,85 Q345,105 320,105 Q305,95 310,80 Z"
                    fill="var(--dw-primary)"
                    opacity="0.3"
                  />
                  <circle cx="65" cy="42" r="3" fill="var(--dw-primary)" />
                  <circle cx="168" cy="38" r="3" fill="var(--dw-purple)" />
                  <circle cx="280" cy="45" r="4" fill="#3B82F6" />
                  <circle cx="330" cy="90" r="3" fill="var(--dw-success)" />
                </svg>
              </div>
            </div>

            {/* Percentage Breakdown */}
            <div className="model-alloc-row">
              <div className="model-alloc-label">
                <span className="model-bullet" style={{ backgroundColor: "#8B5CF6" }} />
                <span>Financial: 42%</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Link to="/assets" className="model-btn-subtle" style={{ padding: "2px 6px" }}>
                  <FaPlus size={8} />
                </Link>
                <Link to="/assets" className="model-btn-subtle" style={{ padding: "2px 8px" }}>
                  Add/Transfer
                </Link>
              </div>
            </div>

            <div className="model-alloc-row">
              <div className="model-alloc-label">
                <span className="model-bullet" style={{ backgroundColor: "#3B82F6" }} />
                <span>Digital Accounts: 28%</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Link to="/assets" className="model-btn-subtle" style={{ padding: "2px 6px" }}>
                  <FaPlus size={8} />
                </Link>
                <Link to="/assets" className="model-btn-subtle" style={{ padding: "2px 8px" }}>
                  Add/Transfer
                </Link>
              </div>
            </div>

            <div className="model-alloc-row">
              <div className="model-alloc-label">
                <span className="model-bullet" style={{ backgroundColor: "#10B981" }} />
                <span>Documents: 18%</span>
              </div>
            </div>

            <div className="model-alloc-row">
              <div className="model-alloc-label">
                <span className="model-bullet" style={{ backgroundColor: "#64748B" }} />
                <span>Other: 12%</span>
              </div>
            </div>
          </div>

          {/* Card 2: Action Panel / Vault */}
          <div className="model-card">
            <div className="model-card-header">
              <h3 className="model-card-title">Action Panel / Vault</h3>
              <Link to="/vault" className="btn btn-primary btn-sm" style={{ padding: "5px 12px", fontSize: "0.78rem" }}>
                Upload New Document
              </Link>
            </div>

            <table className="model-vault-table">
              <thead>
                <tr>
                  <th>Secure Document</th>
                  <th style={{ textAlign: "right" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {/* Row 1: will_final.pdf.enc */}
                <tr className="model-vault-row">
                  <td>
                    <div className="model-doc-info">
                      <FaFilePdf color="#EF4444" size={18} />
                      <div>
                        <div className="model-doc-name">will_final.pdf.enc</div>
                        <div className="model-doc-source">secure document.inc</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                      <span className="badge-uploaded">Uploaded</span>
                      <button type="button" className="model-icon-btn" title="Options">
                        <FaEllipsisH size={12} />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Row 2: crypto_keys.gpg.enc */}
                <tr className="model-vault-row">
                  <td>
                    <div className="model-doc-info">
                      <FaLock color="#10B981" size={18} />
                      <div>
                        <div className="model-doc-name">crypto_keys.gpg.enc</div>
                        <div className="model-doc-source">crypto_keys.gpg.enc</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                      <span className="badge-secured">Secured</span>
                      <button type="button" className="model-icon-btn" title="Options">
                        <FaEllipsisH size={12} />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Dynamically list any live database uploaded files from backend */}
                {vaultFiles.map((doc) => (
                  <tr key={doc._id} className="model-vault-row">
                    <td>
                      <div className="model-doc-info">
                        <FaFileAlt color="var(--dw-primary)" size={16} />
                        <div>
                          <div className="model-doc-name">{doc.fileName}</div>
                          <div className="model-doc-source">{doc.fileType || "Encrypted Record"}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                        <span className="badge-uploaded">Active</span>
                        <Link to="/vault" className="model-icon-btn">
                          <FaEllipsisH size={12} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
