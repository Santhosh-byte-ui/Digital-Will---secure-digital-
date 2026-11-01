import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFileContract,
  FaCoins,
  FaUsers,
  FaFolder,
  FaShieldAlt,
  FaClock,
  FaPlus,
  FaArrowRight,
  FaEye,
  FaFilePdf,
} from "react-icons/fa";
import { apiFetch } from "../api";
import DashboardLayout from "../components/DashboardLayout";

function Dashboard() {
  const navigate = useNavigate();

  const [user] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

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

  const userName = user?.name || "Client";
  const isDeadManActive = stats.deadManStatus?.deadManEnabled || false;
  const inactivityDays = stats.deadManStatus?.inactivityDays || 30;

  return (
    <DashboardLayout title="Estate Overview" activeNav="dashboard">
      {/* Page Header / Welcome */}
      <div className="page-header">
        <div>
          <h2 className="page-header-title">Welcome, {userName}</h2>
          <p className="page-header-desc">
            Monitor your registered testamentary wills, digital asset allocations,
            and succession readiness from your legal console.
          </p>
        </div>
        <div className="page-header-actions">
          <Link to="/create-will" className="btn btn-primary">
            <FaPlus size={11} /> Create Digital Will
          </Link>
          <Link to="/assets" className="btn btn-secondary">
            <FaCoins size={11} /> Add Asset
          </Link>
        </div>
      </div>

      {/* Real Top Metrics Row (100% Real Backend Data) */}
      <div className="metrics-row">
        {/* Metric 1: Digital Wills */}
        <div className="metric-card">
          <div className="metric-card-label">
            <span>Digital Wills</span>
            <FaFileContract className="metric-card-icon" />
          </div>
          <div className="metric-card-value">{stats.totalWills}</div>
          <div className="metric-card-subtext">
            {latestWill ? `Latest: ${latestWill.status}` : "No will drafted"}
          </div>
        </div>

        {/* Metric 2: Asset Valuation */}
        <div className="metric-card">
          <div className="metric-card-label">
            <span>Estate Assets</span>
            <FaCoins className="metric-card-icon" />
          </div>
          <div className="metric-card-value">
            {stats.totalEstateValue > 0
              ? `₹${stats.totalEstateValue.toLocaleString()}`
              : `${stats.totalAssets} Registered`}
          </div>
          <div className="metric-card-subtext">
            {stats.totalAssets} active items in inventory
          </div>
        </div>

        {/* Metric 3: Designated Beneficiaries */}
        <div className="metric-card">
          <div className="metric-card-label">
            <span>Nominated Beneficiaries</span>
            <FaUsers className="metric-card-icon" />
          </div>
          <div className="metric-card-value">{stats.totalBeneficiaries}</div>
          <div className="metric-card-subtext">
            {stats.totalBeneficiaries > 0 ? "Allocated in roster" : "No nominees added"}
          </div>
        </div>

        {/* Metric 4: Vault Documents */}
        <div className="metric-card">
          <div className="metric-card-label">
            <span>Vault Documents</span>
            <FaFolder className="metric-card-icon" />
          </div>
          <div className="metric-card-value">{stats.totalDocuments}</div>
          <div className="metric-card-subtext">AWS S3 Encrypted (SSE-256)</div>
        </div>
      </div>

      {/* Grid: 2 Columns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        {/* Left Column: Will Status & Vault Documents */}
        <div>
          {/* Card 1: Active Will Status */}
          <div className="content-card">
            <div className="content-card-header">
              <h3 className="content-card-title">
                <FaFileContract size={14} color="#3157A4" /> Testamentary Status
              </h3>
              {latestWill && (
                <span
                  className={`badge ${
                    latestWill.status === "Active"
                      ? "badge-success"
                      : "badge-warning"
                  }`}
                >
                  {latestWill.status}
                </span>
              )}
            </div>

            <div className="content-card-body">
              {latestWill ? (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "14px",
                    }}
                  >
                    <div>
                      <h4 style={{ margin: "0 0 4px 0", fontSize: "1.05rem" }}>
                        {latestWill.title}
                      </h4>
                      <p style={{ margin: 0, fontSize: "0.82rem" }}>
                        Last modified:{" "}
                        {new Date(latestWill.updatedAt || latestWill.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="badge badge-neutral">
                      Verification: {latestWill.deathVerificationStatus}
                    </span>
                  </div>

                  <div
                    style={{
                      background: "var(--dw-bg-primary)",
                      padding: "12px 16px",
                      borderRadius: "6px",
                      border: "1px solid var(--dw-border)",
                      display: "flex",
                      gap: "24px",
                      marginBottom: "16px",
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--dw-text-muted)", display: "block" }}>
                        Allocated Assets
                      </span>
                      <strong style={{ fontSize: "1rem" }}>
                        {latestWill.assets?.length || 0}
                      </strong>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--dw-text-muted)", display: "block" }}>
                        Beneficiaries
                      </span>
                      <strong style={{ fontSize: "1rem" }}>
                        {latestWill.beneficiaries?.length || 0}
                      </strong>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--dw-text-muted)", display: "block" }}>
                        Execution Directives
                      </span>
                      <strong style={{ fontSize: "1rem" }}>Recorded</strong>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <Link to="/my-wills" className="btn btn-secondary btn-sm">
                      <FaEye size={11} /> Review Will Details
                    </Link>
                    <Link to="/my-wills" className="btn btn-primary btn-sm">
                      <FaFilePdf size={11} /> Download PDF
                    </Link>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <FaFileContract
                    size={32}
                    color="#94A3B8"
                    style={{ marginBottom: "10px" }}
                  />
                  <h4 style={{ margin: "0 0 4px 0" }}>No Digital Will Created</h4>
                  <p style={{ margin: "0 0 14px 0", fontSize: "0.85rem" }}>
                    Draft your first legally structured will to distribute your estate assets.
                  </p>
                  <Link to="/create-will" className="btn btn-primary btn-sm">
                    <FaPlus size={10} /> Draft Digital Will
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Vault Documents Overview */}
          <div className="content-card">
            <div className="content-card-header">
              <h3 className="content-card-title">
                <FaFolder size={14} color="#3157A4" /> Document Vault ({vaultFiles.length})
              </h3>
              <Link to="/vault" className="btn btn-secondary btn-sm">
                View All Documents
              </Link>
            </div>

            {vaultFiles.length === 0 ? (
              <div className="empty-state">
                <FaFolder className="empty-state-icon" />
                <h4 className="empty-state-title">No Documents in Vault</h4>
                <p className="empty-state-desc">
                  Store property deeds, identity proofs, and estate records securely on AWS S3.
                </p>
                <Link to="/vault" className="btn btn-primary btn-sm">
                  Upload Document
                </Link>
              </div>
            ) : (
              <div className="table-responsive" style={{ border: "none", borderRadius: 0 }}>
                <table>
                  <thead>
                    <tr>
                      <th>Document</th>
                      <th>Type</th>
                      <th>Size</th>
                      <th>Uploaded</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vaultFiles.slice(0, 4).map((doc) => (
                      <tr key={doc._id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{doc.fileName}</div>
                        </td>
                        <td>
                          <span className="badge badge-neutral">
                            {doc.fileType?.includes("pdf") ? "PDF" : "Document"}
                          </span>
                        </td>
                        <td style={{ fontSize: "0.82rem", color: "var(--dw-text-muted)" }}>
                          {doc.fileSize ? `${(doc.fileSize / 1024).toFixed(1)} KB` : "—"}
                        </td>
                        <td style={{ fontSize: "0.82rem", color: "var(--dw-text-muted)" }}>
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Inactivity Monitoring & Beneficiary Roster */}
        <div>
          {/* Card 3: Inactivity / Dead Man's Switch Status */}
          <div className="content-card">
            <div className="content-card-header">
              <h3 className="content-card-title">
                <FaClock size={14} color="#3157A4" /> Inactivity Monitoring
              </h3>
              <span
                className={`badge ${
                  isDeadManActive ? "badge-success" : "badge-neutral"
                }`}
              >
                {isDeadManActive ? "Armed" : "Disabled"}
              </span>
            </div>

            <div className="content-card-body">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  borderRadius: "6px",
                  backgroundColor: isDeadManActive ? "var(--dw-success-light)" : "var(--dw-bg-primary)",
                  border: `1px solid ${isDeadManActive ? "rgba(22, 132, 91, 0.25)" : "var(--dw-border)"}`,
                  marginBottom: "14px",
                }}
              >
                <FaShieldAlt
                  size={18}
                  color={isDeadManActive ? "var(--dw-success)" : "var(--dw-secondary)"}
                />
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "0.88rem",
                      color: isDeadManActive ? "var(--dw-success)" : "var(--dw-text-main)",
                    }}
                  >
                    {isDeadManActive
                      ? `Active (${inactivityDays}-Day Timeout)`
                      : "Switch Inactive"}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--dw-text-muted)" }}>
                    {isDeadManActive
                      ? "Monitors login activity before triggering death verification review"
                      : "Enable to protect succession directives if inactive"}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: "0.82rem", margin: "0 0 14px 0" }}>
                Inactivity never automatically distributes your estate. All releases
                require independent administrative review.
              </p>

              <Link to="/deadman-settings" className="btn btn-secondary btn-sm" style={{ width: "100%" }}>
                Configure Inactivity Settings
              </Link>
            </div>
          </div>

          {/* Card 4: Beneficiaries Summary */}
          <div className="content-card">
            <div className="content-card-header">
              <h3 className="content-card-title">
                <FaUsers size={14} color="#3157A4" /> Appointed Beneficiaries ({beneficiariesList.length})
              </h3>
              <Link to="/beneficiary-portal" className="btn btn-secondary btn-sm">
                Manage
              </Link>
            </div>

            <div className="content-card-body" style={{ padding: beneficiariesList.length ? "10px" : "20px" }}>
              {beneficiariesList.length === 0 ? (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <p style={{ fontSize: "0.85rem", margin: "0 0 12px 0" }}>
                    No beneficiaries registered. Add family members or nominees to your estate roster.
                  </p>
                  <Link to="/beneficiary-portal" className="btn btn-primary btn-sm">
                    <FaPlus size={10} /> Add Beneficiary
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {beneficiariesList.slice(0, 3).map((ben) => (
                    <div
                      key={ben._id}
                      style={{
                        padding: "10px 12px",
                        background: "var(--dw-bg-primary)",
                        borderRadius: "6px",
                        border: "1px solid var(--dw-border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{ben.name}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--dw-text-muted)" }}>
                          {ben.relationship || "Nominee"} &bull; {ben.email}
                        </div>
                      </div>
                      <span className="badge badge-primary">
                        {ben.sharePercentage || 50}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="content-card">
            <div className="content-card-header">
              <h3 className="content-card-title">Quick Actions</h3>
            </div>
            <div className="content-card-body" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Link
                to="/create-will"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--dw-border)",
                  color: "var(--dw-text-main)",
                  fontSize: "0.88rem",
                  fontWeight: 500,
                }}
              >
                <span>Draft New Digital Will</span>
                <FaArrowRight size={11} color="var(--dw-secondary)" />
              </Link>
              <Link
                to="/assets"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--dw-border)",
                  color: "var(--dw-text-main)",
                  fontSize: "0.88rem",
                  fontWeight: 500,
                }}
              >
                <span>Add Property or Account</span>
                <FaArrowRight size={11} color="var(--dw-secondary)" />
              </Link>
              <Link
                to="/vault"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--dw-border)",
                  color: "var(--dw-text-main)",
                  fontSize: "0.88rem",
                  fontWeight: 500,
                }}
              >
                <span>Deposit S3 Document</span>
                <FaArrowRight size={11} color="var(--dw-secondary)" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
