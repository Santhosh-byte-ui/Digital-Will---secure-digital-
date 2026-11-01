import { useEffect, useState } from "react";
import { apiFetch } from "../api";

function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [busyRequest, setBusyRequest] = useState("");
  const [requestError, setRequestError] = useState("");
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
    async function fetchAdminStats() {
      try {
        const token = localStorage.getItem("token");
        const response = await apiFetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) setStats(data);

        const requestsResponse = await apiFetch("/api/death-verification", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const requestsData = await requestsResponse.json();
        if (requestsResponse.ok) setRequests(requestsData.requests);
      } catch (error) {
        console.error("Could not load administrator statistics.", error.name);
      }
    }

    void fetchAdminStats();
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

  const cardStyle = {
    background: "#fff",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    textAlign: "center",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fc",
        padding: "30px",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg,#001f7f,#2563eb)",
          color: "white",
          padding: "30px",
          borderRadius: "20px",
          marginBottom: "30px",
        }}
      >
        <h1>👨‍💼 Admin Control Center</h1>

        <p>
          Monitor users, assets, wills, verification requests and platform
          health.
        </p>
      </div>

      {/* Platform Statistics */}
      <h2
        style={{
          color: "#001f7f",
          marginBottom: "20px",
        }}
      >
        Platform Statistics
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
        }}
      >
        <div style={cardStyle}>
          <h1>👥</h1>
          <h2>{stats.totalUsers}</h2>
          <p>Total Users</p>
        </div>

        <div style={cardStyle}>
          <h1>✅</h1>
          <h2>{stats.verifiedUsers}</h2>
          <p>Verified Users</p>
        </div>

        <div style={cardStyle}>
          <h1>🛡</h1>
          <h2>{stats.deadManEnabledUsers}</h2>
          <p>Dead Man Enabled</p>
        </div>

        <div style={cardStyle}>
          <h1>🏠</h1>
          <h2>{stats.totalAssets}</h2>
          <p>Total Assets</p>
        </div>

        <div style={cardStyle}>
          <h1>📜</h1>
          <h2>{stats.totalWills}</h2>
          <p>Total Wills</p>
        </div>

        <div style={cardStyle}>
          <h1>📄</h1>
          <h2>{stats.totalDocuments}</h2>
          <p>Vault Documents</p>
        </div>
      </div>

      {/* Verification Statistics */}
      <h2
        style={{
          color: "#001f7f",
          marginTop: "40px",
          marginBottom: "20px",
        }}
      >
        Verification Statistics
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
        }}
      >
        <div style={cardStyle}>
          <h1>📂</h1>
          <h2>{stats.totalRequests}</h2>
          <p>Total Requests</p>
        </div>

        <div style={cardStyle}>
          <h1>🟡</h1>
          <h2>{stats.pendingRequests}</h2>
          <p>Pending</p>
        </div>

        <div style={cardStyle}>
          <h1>🟢</h1>
          <h2>{stats.approvedRequests}</h2>
          <p>Approved</p>
        </div>

        <div style={cardStyle}>
          <h1>🔴</h1>
          <h2>{stats.rejectedRequests}</h2>
          <p>Rejected</p>
        </div>
      </div>

      <section
        aria-labelledby="verification-requests-heading"
        style={{ marginTop: "40px" }}
      >
        <h2 id="verification-requests-heading" style={{ color: "#001f7f" }}>
          Pending Death Verification Requests
        </h2>
        {requestError && <p role="alert">{requestError}</p>}
        {requests.length === 0 ? (
          <p>No pending verification requests.</p>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {requests
              .filter((request) => request.status === "Pending")
              .map((request) => (
                <div key={request._id} className="card">
                  <h3>{request.will?.title || "Will"}</h3>
                  <p>
                    Submitted by {request.user?.name || "Unknown user"} (
                    {request.user?.email || ""})
                  </p>
                  <p>
                    Submitted {new Date(request.createdAt).toLocaleString()}
                  </p>
                  <p>Proof document submitted for review.</p>
                  <div
                    style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                  >
                    <button
                      type="button"
                      disabled={busyRequest === request._id}
                      onClick={() => resolveRequest(request._id, "approve")}
                    >
                      {busyRequest === request._id ? "Saving..." : "Approve"}
                    </button>
                    <button
                      type="button"
                      disabled={busyRequest === request._id}
                      onClick={() => resolveRequest(request._id, "reject")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>

      {/* System Health */}
      <div
        style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "16px",
          marginTop: "40px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            color: "#001f7f",
          }}
        >
          ⚙️ System Health
        </h2>

        <p>🟢 MongoDB Database Connected</p>

        <p>🟢 AWS S3 Storage Active</p>

        <p>🟢 API Server Running</p>

        <p>🟢 Security Monitoring Active</p>
      </div>

      {/* User Management */}
      <div
        style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "16px",
          marginTop: "40px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            color: "#001f7f",
            marginBottom: "20px",
          }}
        >
          👥 User Management
        </h2>

        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#001f7f",
                  color: "white",
                }}
              >
                <th
                  style={{
                    padding: "12px",
                  }}
                >
                  Name
                </th>

                <th
                  style={{
                    padding: "12px",
                  }}
                >
                  Email
                </th>

                <th
                  style={{
                    padding: "12px",
                  }}
                >
                  Verified
                </th>

                <th
                  style={{
                    padding: "12px",
                  }}
                >
                  Role
                </th>
              </tr>
            </thead>

            <tbody>
              {stats.users.map((user) => (
                <tr key={user._id}>
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {user.name}
                  </td>

                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {user.email}
                  </td>

                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {user.isVerified ? "✅" : "❌"}
                  </td>

                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {user.role}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
