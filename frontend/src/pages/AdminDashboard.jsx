import { useEffect, useState } from "react";
import {
  FaShieldAlt,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaServer,
  FaDatabase,
  FaCloud,
  FaFileContract,
} from "react-icons/fa";
import { apiFetch } from "../api";
import DashboardLayout from "../components/DashboardLayout";

function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [busyRequest, setBusyRequest] = useState("");
  const [requestError, setRequestError] = useState("");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    deadManEnabledUsers: 0,
    totalAssets: 0,
    totalWills: 0,
    totalDocuments: 0,
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    users: [],
  });

  useEffect(() => {
    async function fetchAdminData() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // 1. Fetch admin stats
        const response = await apiFetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) setStats(data);

        // 2. Fetch death verification requests
        const reqResponse = await apiFetch("/api/death-verification", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const reqData = await reqResponse.json();
        if (reqResponse.ok) setRequests(reqData.requests || []);
      } catch (error) {
        console.error("Could not load administrator statistics:", error);
      } finally {
        setLoading(false);
      }
    }

    void fetchAdminData();
  }, []);

  const resolveRequest = async (requestId, decision) => {
    setBusyRequest(requestId);
    setRequestError("");
    try {
      const token = localStorage.getItem("token");
      const response = await apiFetch(
        `/api/death-verification/${decision}/${requestId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      if (!response.ok) {
        setRequestError(data.message || "Could not update this request.");
        return;
      }

      setRequests((current) =>
        current.filter((request) => request._id !== requestId),
      );
      setStats((current) => ({
        ...current,
        pendingRequests: Math.max(0, current.pendingRequests - 1),
        ...(decision === "approve"
          ? { approvedRequests: current.approvedRequests + 1 }
          : { rejectedRequests: current.rejectedRequests + 1 }),
      }));
    } catch {
      setRequestError("Could not reach the verification service.");
    } finally {
      setBusyRequest("");
    }
  };

  const pendingList = requests.filter((r) => r.status === "Pending");

  return (
    <DashboardLayout title="Death Verification (Review)" activeNav="verification">
      {/* Header */}
      <div className="dw-page-header-row">
        <div className="dw-page-header-info">
          <h2>Administrator Control &amp; Death Verification Review</h2>
          <p>
            Review death certification evidence, authorize or reject estate
            releases, and audit platform infrastructure health.
          </p>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="dw-metrics-grid" style={{ marginBottom: "24px" }}>
        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">Pending Verifications</span>
            <FaClock className="dw-metric-icon" style={{ color: "#F59E0B" }} />
          </div>
          <div className="dw-metric-value" style={{ color: "#F59E0B" }}>
            {stats.pendingRequests}
          </div>
        </div>

        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">Approved Verifications</span>
            <FaCheckCircle className="dw-metric-icon" style={{ color: "#10B981" }} />
          </div>
          <div className="dw-metric-value" style={{ color: "#10B981" }}>
            {stats.approvedRequests}
          </div>
        </div>

        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">Platform Users</span>
            <FaUsers className="dw-metric-icon blue" />
          </div>
          <div className="dw-metric-value">{stats.totalUsers}</div>
        </div>

        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">Managed Wills</span>
            <FaFileContract className="dw-metric-icon purple" />
          </div>
          <div className="dw-metric-value">{stats.totalWills}</div>
        </div>
      </div>

      {/* 1. Pending Verification Requests */}
      <div className="dw-content-card">
        <div className="dw-content-card-header">
          <h3>
            <FaShieldAlt size={15} color="#F59E0B" /> Pending Death Verification Requests ({pendingList.length})
          </h3>
          <span style={{ fontSize: "12px", color: "var(--dw-card-subtext)" }}>
            Manual review strictly required before releasing will contents to nominees
          </span>
        </div>

        {requestError && (
          <div
            style={{
              padding: "12px 16px",
              background: "rgba(239, 68, 68, 0.12)",
              color: "#EF4444",
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "16px",
            }}
          >
            {requestError}
          </div>
        )}

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--dw-card-subtext)" }}>
            Loading verification requests...
          </div>
        ) : pendingList.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 20px",
              background: "var(--dw-inner-card-bg)",
              borderRadius: "12px",
              border: "1px dashed var(--dw-card-border)",
            }}
          >
            <FaCheckCircle
              size={36}
              color="#10B981"
              style={{ opacity: 0.8, marginBottom: "12px" }}
            />
            <h3 style={{ margin: "0 0 6px 0", color: "var(--dw-card-header)" }}>
              No Pending Verification Requests
            </h3>
            <p style={{ margin: "0", fontSize: "13px", color: "var(--dw-card-subtext)" }}>
              All death verification claims have been processed or none are currently under review.
            </p>
          </div>
        ) : (
          <div className="dw-table-wrap">
            <table className="dw-table">
              <thead>
                <tr>
                  <th>Testament Title</th>
                  <th>Submitted By</th>
                  <th>Submitted On</th>
                  <th>Supporting Proof</th>
                  <th style={{ textAlign: "right" }}>Review Decision</th>
                </tr>
              </thead>
              <tbody>
                {pendingList.map((req) => (
                  <tr key={req._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{req.will?.title || "Digital Will"}</div>
                      <div style={{ fontSize: "11px", color: "var(--dw-card-subtext)" }}>
                        ID: {req._id.slice(-6).toUpperCase()}
                      </div>
                    </td>
                    <td>
                      <div>{req.user?.name || "Unknown Claimant"}</div>
                      <div style={{ fontSize: "11px", color: "var(--dw-card-subtext)" }}>
                        {req.user?.email || "—"}
                      </div>
                    </td>
                    <td style={{ fontSize: "12.5px" }}>
                      {new Date(req.createdAt).toLocaleString()}
                    </td>
                    <td>
                      <span className="dw-badge-pill dw-badge-blue">
                        <FaShieldAlt size={10} /> Certified Document Attached
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "8px" }}>
                        <button
                          type="button"
                          className="dw-btn dw-btn-success dw-btn-sm"
                          disabled={busyRequest === req._id}
                          onClick={() => resolveRequest(req._id, "approve")}
                        >
                          <FaCheckCircle size={11} />
                          {busyRequest === req._id ? "Processing..." : "Approve & Release"}
                        </button>
                        <button
                          type="button"
                          className="dw-btn dw-btn-danger dw-btn-sm"
                          disabled={busyRequest === req._id}
                          onClick={() => resolveRequest(req._id, "reject")}
                        >
                          <FaTimesCircle size={11} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2. Platform Infrastructure Health */}
      <div className="dw-content-card">
        <div className="dw-content-card-header">
          <h3>
            <FaServer size={15} color="#10B981" /> System &amp; Cloud Infrastructure Status
          </h3>
          <span className="dw-badge-pill dw-badge-green">Operational</span>
        </div>

        <div className="dw-metrics-grid">
          <div
            style={{
              padding: "16px",
              background: "var(--dw-inner-card-bg)",
              border: "1px solid var(--dw-card-border)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <FaDatabase size={22} color="#10B981" />
            <div>
              <div style={{ fontWeight: 600, color: "var(--dw-card-header)" }}>
                MongoDB Database
              </div>
              <div style={{ fontSize: "12px", color: "#10B981", fontWeight: 600 }}>
                Connected &amp; Resilient
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              background: "var(--dw-inner-card-bg)",
              border: "1px solid var(--dw-card-border)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <FaCloud size={22} color="#2563EB" />
            <div>
              <div style={{ fontWeight: 600, color: "var(--dw-card-header)" }}>
                AWS S3 Cloud Storage
              </div>
              <div style={{ fontSize: "12px", color: "#2563EB", fontWeight: 600 }}>
                Active (SSE-256)
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              background: "var(--dw-inner-card-bg)",
              border: "1px solid var(--dw-card-border)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <FaServer size={22} color="#8B5CF6" />
            <div>
              <div style={{ fontWeight: 600, color: "var(--dw-card-header)" }}>
                Express API Gateway
              </div>
              <div style={{ fontSize: "12px", color: "#8B5CF6", fontWeight: 600 }}>
                Running on Port 5000
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              background: "var(--dw-inner-card-bg)",
              border: "1px solid var(--dw-card-border)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <FaShieldAlt size={22} color="#10B981" />
            <div>
              <div style={{ fontWeight: 600, color: "var(--dw-card-header)" }}>
                Security &amp; Rate Limits
              </div>
              <div style={{ fontSize: "12px", color: "#10B981", fontWeight: 600 }}>
                Active &amp; Monitored
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. User Accounts Directory */}
      <div className="dw-content-card">
        <div className="dw-content-card-header">
          <h3>
            <FaUsers size={15} color="#2563EB" /> Platform User Directory ({stats.users?.length || 0})
          </h3>
          <span style={{ fontSize: "12px", color: "var(--dw-card-subtext)" }}>
            Registered testators, administrators, and beneficiaries
          </span>
        </div>

        <div className="dw-table-wrap">
          <table className="dw-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Account Status</th>
                <th style={{ textAlign: "right" }}>Identifier</th>
              </tr>
            </thead>
            <tbody>
              {stats.users?.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{u.name}</div>
                  </td>
                  <td style={{ fontSize: "12.5px" }}>{u.email}</td>
                  <td>
                    <span
                      className={`dw-badge-pill ${
                        u.role === "admin" ? "dw-badge-purple" : "dw-badge-blue"
                      }`}
                    >
                      {u.role === "admin" ? "Admin" : "Owner"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`dw-badge-pill ${
                        u.isVerified ? "dw-badge-green" : "dw-badge-yellow"
                      }`}
                    >
                      {u.isVerified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right", fontSize: "11px", color: "var(--dw-card-subtext)" }}>
                    {u._id.slice(-8).toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
