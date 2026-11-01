import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFileContract,
  FaFilePdf,
  FaPlus,
  FaTrash,
  FaEye,
  FaShieldAlt,
  FaUsers,
  FaCoins,
} from "react-icons/fa";
import { apiFetch } from "../api";
import DashboardLayout from "../components/DashboardLayout";

function MyWills() {
  const navigate = useNavigate();
  const [wills, setWills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWill, setSelectedWill] = useState(null);
  const [downloadingId, setDownloadingId] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchWills() {
      try {
        const token = localStorage.getItem("token");
        const response = await apiFetch("/api/will/my-wills", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setWills(data.wills || []);
        }
      } catch (error) {
        console.error("Could not load wills:", error);
      } finally {
        setLoading(false);
      }
    }

    void fetchWills();
  }, [refreshKey]);

  const downloadPDF = async (willId, title) => {
    try {
      setDownloadingId(willId);
      const token = localStorage.getItem("token");
      const response = await apiFetch(`/api/pdf/download/${willId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "Failed to download PDF");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download error:", error);
      alert("Error generating or downloading PDF.");
    } finally {
      setDownloadingId("");
    }
  };

  const deleteWill = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the will "${title}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await apiFetch(`/api/will/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        if (selectedWill?._id === id) setSelectedWill(null);
        setRefreshKey((k) => k + 1);
      } else {
        alert(data.message || "Could not delete will");
      }
    } catch (error) {
      console.error("Delete will error:", error);
    }
  };

  const activeCount = wills.filter((w) => w.status === "Active").length;
  const verifiedCount = wills.filter(
    (w) => w.deathVerificationStatus === "Verified",
  ).length;

  return (
    <DashboardLayout title="Digital Will Management" activeNav="wills">
      {/* Page Header */}
      <div className="dw-page-header-row">
        <div className="dw-page-header-info">
          <h2>Testaments &amp; Succession Directives</h2>
          <p>
            Create, review, export, and manage your legally formatted digital
            wills and beneficiary allocations.
          </p>
        </div>
        <div>
          <button
            type="button"
            className="dw-btn dw-btn-primary"
            onClick={() => navigate("/create-will")}
          >
            <FaPlus size={12} /> Create Digital Will
          </button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="dw-metrics-grid" style={{ marginBottom: "24px" }}>
        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">Total Registered Wills</span>
            <FaFileContract className="dw-metric-icon purple" />
          </div>
          <div className="dw-metric-value">{wills.length}</div>
        </div>

        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">Active Testaments</span>
            <FaShieldAlt className="dw-metric-icon blue" />
          </div>
          <div className="dw-metric-value">{activeCount}</div>
        </div>

        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">PDF Export Ready</span>
            <FaFilePdf className="dw-metric-icon" style={{ color: "#EF4444" }} />
          </div>
          <div className="dw-metric-value">{wills.length}</div>
        </div>

        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">Verified Testaments</span>
            <FaShieldAlt className="dw-metric-icon" style={{ color: "#10B981" }} />
          </div>
          <div className="dw-metric-value" style={{ color: "#10B981" }}>
            {verifiedCount}
          </div>
        </div>
      </div>

      {/* Content Card */}
      <div className="dw-content-card">
        <div className="dw-content-card-header">
          <h3>
            <FaFileContract size={15} color="#8B5CF6" /> Wills Registry ({wills.length})
          </h3>
          <span style={{ fontSize: "12px", color: "var(--dw-card-subtext)" }}>
            Digital wills require verified death certification before asset release
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--dw-card-subtext)" }}>
            Loading wills registry...
          </div>
        ) : wills.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 20px",
              background: "var(--dw-inner-card-bg)",
              borderRadius: "12px",
              border: "1px dashed var(--dw-card-border)",
            }}
          >
            <FaFileContract
              size={36}
              color="var(--dw-card-subtext)"
              style={{ opacity: 0.5, marginBottom: "12px" }}
            />
            <h3 style={{ margin: "0 0 6px 0", color: "var(--dw-card-header)" }}>
              No Wills Created Yet
            </h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "var(--dw-card-subtext)" }}>
              Establish your first digital will to catalog your estate and specify
              exact beneficiary allocations.
            </p>
            <Link to="/create-will" className="dw-btn dw-btn-primary">
              <FaPlus size={12} /> Draft Your Will
            </Link>
          </div>
        ) : (
          <div className="dw-table-wrap">
            <table className="dw-table">
              <thead>
                <tr>
                  <th>Will Title</th>
                  <th>Status</th>
                  <th>Verification</th>
                  <th>Allocated Assets</th>
                  <th>Beneficiaries</th>
                  <th>Created Date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {wills.map((will) => (
                  <tr key={will._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "8px",
                            background: "rgba(139, 92, 246, 0.12)",
                            color: "#8B5CF6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FaFileContract size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{will.title}</div>
                          <div style={{ fontSize: "11px", color: "var(--dw-card-subtext)" }}>
                            ID: {will._id.slice(-6).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`dw-badge-pill ${
                          will.status === "Active"
                            ? "dw-badge-green"
                            : "dw-badge-yellow"
                        }`}
                      >
                        {will.status}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`dw-badge-pill ${
                          will.deathVerificationStatus === "Verified"
                            ? "dw-badge-green"
                            : will.deathVerificationStatus === "Rejected"
                              ? "dw-badge-red"
                              : "dw-badge-yellow"
                        }`}
                      >
                        {will.deathVerificationStatus}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                        <FaCoins size={12} color="var(--dw-card-subtext)" />
                        {will.assets?.length || 0} Assets
                      </span>
                    </td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                        <FaUsers size={12} color="var(--dw-card-subtext)" />
                        {will.beneficiaries?.length || 0} People
                      </span>
                    </td>
                    <td style={{ fontSize: "12.5px", color: "var(--dw-card-subtext)" }}>
                      {new Date(will.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px" }}>
                        <button
                          type="button"
                          className="dw-btn dw-btn-outline dw-btn-sm"
                          title="View Will Details"
                          onClick={() => setSelectedWill(will)}
                        >
                          <FaEye size={12} /> Details
                        </button>
                        <button
                          type="button"
                          className="dw-btn dw-btn-primary dw-btn-sm"
                          title="Download Legal PDF"
                          disabled={downloadingId === will._id}
                          onClick={() => downloadPDF(will._id, will.title)}
                        >
                          <FaFilePdf size={12} />
                          {downloadingId === will._id ? "Exporting..." : "PDF"}
                        </button>
                        <button
                          type="button"
                          className="dw-btn dw-btn-danger dw-btn-sm"
                          title="Delete Will"
                          onClick={() => deleteWill(will._id, will.title)}
                        >
                          <FaTrash size={12} />
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

      {/* Will Details Modal */}
      {selectedWill && (
        <div className="dw-modal-backdrop" onClick={() => setSelectedWill(null)}>
          <div
            className="dw-modal-box"
            style={{ maxWidth: "680px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dw-modal-header">
              <h3>{selectedWill.title}</h3>
              <button
                type="button"
                className="dw-modal-close"
                onClick={() => setSelectedWill(null)}
              >
                &times;
              </button>
            </div>
            <div className="dw-modal-body">
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                }}
              >
                <span className="dw-badge-pill dw-badge-blue">
                  Status: {selectedWill.status}
                </span>
                <span className="dw-badge-pill dw-badge-yellow">
                  Verification: {selectedWill.deathVerificationStatus}
                </span>
                <span className="dw-badge-pill dw-badge-neutral">
                  Created: {new Date(selectedWill.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Assets Section */}
              <div style={{ marginBottom: "20px" }}>
                <h4
                  style={{
                    fontSize: "13.5px",
                    fontWeight: 700,
                    margin: "0 0 10px 0",
                    color: "var(--dw-card-header)",
                  }}
                >
                  Allocated Estate Assets
                </h4>
                <div style={{ display: "grid", gap: "8px" }}>
                  {selectedWill.assets?.map((asset, i) => (
                    <div
                      key={asset._id || i}
                      style={{
                        padding: "10px 14px",
                        background: "var(--dw-inner-card-bg)",
                        border: "1px solid var(--dw-card-border)",
                        borderRadius: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <strong>{asset.assetName}</strong>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--dw-card-subtext)",
                            marginLeft: "8px",
                          }}
                        >
                          ({asset.assetType})
                        </span>
                      </div>
                      <div style={{ fontWeight: 700, color: "#10B981" }}>
                        ₹{Number(asset.value || 0).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Beneficiaries Section */}
              <div style={{ marginBottom: "20px" }}>
                <h4
                  style={{
                    fontSize: "13.5px",
                    fontWeight: 700,
                    margin: "0 0 10px 0",
                    color: "var(--dw-card-header)",
                  }}
                >
                  Beneficiaries &amp; Share Allocation
                </h4>
                <div style={{ display: "grid", gap: "8px" }}>
                  {selectedWill.beneficiaries?.map((ben, i) => (
                    <div
                      key={ben._id || i}
                      style={{
                        padding: "10px 14px",
                        background: "var(--dw-inner-card-bg)",
                        border: "1px solid var(--dw-card-border)",
                        borderRadius: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <strong>{ben.name}</strong>
                        <div
                          style={{
                            fontSize: "11.5px",
                            color: "var(--dw-card-subtext)",
                          }}
                        >
                          {ben.email} &bull; {ben.relation || "Nominee"}
                        </div>
                      </div>
                      <span className="dw-badge-pill dw-badge-purple">
                        {ben.sharePercentage}% Share
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h4
                  style={{
                    fontSize: "13.5px",
                    fontWeight: 700,
                    margin: "0 0 10px 0",
                    color: "var(--dw-card-header)",
                  }}
                >
                  Succession Clauses &amp; Instructions
                </h4>
                <div
                  style={{
                    padding: "12px 14px",
                    background: "var(--dw-inner-card-bg)",
                    border: "1px solid var(--dw-card-border)",
                    borderRadius: "8px",
                    fontSize: "13px",
                    color: "var(--dw-card-subtext)",
                    lineHeight: "1.6",
                  }}
                >
                  {selectedWill.instructions || "No special clauses recorded."}
                </div>
              </div>
            </div>
            <div className="dw-modal-footer">
              <button
                type="button"
                className="dw-btn dw-btn-outline"
                onClick={() => setSelectedWill(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="dw-btn dw-btn-primary"
                onClick={() => downloadPDF(selectedWill._id, selectedWill.title)}
              >
                <FaFilePdf size={12} /> Download Official PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default MyWills;
