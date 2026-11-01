import { useEffect, useState } from "react";
import {
  FaUsers,
  FaPlus,
  FaEdit,
  FaTrash,
  FaFileContract,
  FaShieldAlt,
  FaCheckCircle,
  FaClock,
  FaFilePdf,
} from "react-icons/fa";
import { apiFetch } from "../api";
import DashboardLayout from "../components/DashboardLayout";

function BeneficiaryPortal() {
  const [activeTab, setActiveTab] = useState("roster"); // "roster" | "inherited"
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [inheritedWill, setInheritedWill] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBen, setEditingBen] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "Spouse",
    email: "",
    mobile: "",
    sharePercentage: 50,
  });

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");

        // 1. Fetch beneficiaries roster
        const benRes = await apiFetch("/api/beneficiaries", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (benRes.ok) {
          const benData = await benRes.json();
          setBeneficiaries(benData.beneficiaries || []);
        }

        // 2. Fetch inherited wills if any
        const willRes = await apiFetch("/api/beneficiary-portal/my-will", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (willRes.ok) {
          const willData = await willRes.json();
          setInheritedWill(willData.will || null);
        }
      } catch (error) {
        console.error("Could not load beneficiary data:", error);
      } finally {
        setLoading(false);
      }
    }

    void fetchData();
  }, [refreshKey]);

  const openAddModal = () => {
    setEditingBen(null);
    setFormData({
      name: "",
      relationship: "Spouse",
      email: "",
      mobile: "",
      sharePercentage: 50,
    });
    setModalOpen(true);
  };

  const openEditModal = (ben) => {
    setEditingBen(ben);
    setFormData({
      name: ben.name,
      relationship: ben.relationship || "Nominee",
      email: ben.email,
      mobile: ben.mobile || "",
      sharePercentage: ben.sharePercentage || 50,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingBen(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editingBen) {
        const res = await apiFetch(`/api/beneficiaries/${editingBen._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          closeModal();
          setRefreshKey((k) => k + 1);
        } else {
          const err = await res.json();
          alert(err.message || "Failed to update beneficiary");
        }
      } else {
        const res = await apiFetch("/api/beneficiaries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          closeModal();
          setRefreshKey((k) => k + 1);
        } else {
          const err = await res.json();
          alert(err.message || "Failed to add beneficiary");
        }
      }
    } catch (error) {
      console.error("Error submitting beneficiary:", error);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete beneficiary "${name}"?`)) return;

    try {
      const token = localStorage.getItem("token");
      const res = await apiFetch(`/api/beneficiaries/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setRefreshKey((k) => k + 1);
      } else {
        const err = await res.json();
        alert(err.message || "Failed to delete beneficiary");
      }
    } catch (error) {
      console.error("Error deleting beneficiary:", error);
    }
  };

  const downloadPDF = async (willId, title) => {
    try {
      const token = localStorage.getItem("token");
      const res = await apiFetch(`/api/pdf/download/${willId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Could not download PDF");
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Error downloading will PDF.");
    }
  };

  return (
    <DashboardLayout title="Beneficiary Management" activeNav="beneficiaries">
      {/* Page Header */}
      <div className="dw-page-header-row">
        <div className="dw-page-header-info">
          <h2>Beneficiary Roster &amp; Inheritance Portal</h2>
          <p>
            Assign verified nominees to your estate, specify share allocations,
            or access testaments where you are an appointed beneficiary.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {activeTab === "roster" && (
            <button
              type="button"
              className="dw-btn dw-btn-primary"
              onClick={openAddModal}
            >
              <FaPlus size={12} /> Add Beneficiary
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <button
          type="button"
          className={`dw-btn ${
            activeTab === "roster" ? "dw-btn-primary" : "dw-btn-outline"
          }`}
          onClick={() => setActiveTab("roster")}
        >
          <FaUsers size={13} /> Estate Nominee Roster ({beneficiaries.length})
        </button>
        <button
          type="button"
          className={`dw-btn ${
            activeTab === "inherited" ? "dw-btn-primary" : "dw-btn-outline"
          }`}
          onClick={() => setActiveTab("inherited")}
        >
          <FaFileContract size={13} /> Inherited Testaments (
          {inheritedWill ? "1" : "0"})
        </button>
      </div>

      {/* TAB 1: ROSTER */}
      {activeTab === "roster" && (
        <div className="dw-content-card">
          <div className="dw-content-card-header">
            <h3>
              <FaUsers size={15} color="#8B5CF6" /> Appointed Estate Beneficiaries
            </h3>
            <span style={{ fontSize: "12px", color: "var(--dw-card-subtext)" }}>
              Direct succession percentage allocations
            </span>
          </div>

          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "var(--dw-card-subtext)",
              }}
            >
              Loading beneficiary roster...
            </div>
          ) : beneficiaries.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px 20px",
                background: "var(--dw-inner-card-bg)",
                borderRadius: "12px",
                border: "1px dashed var(--dw-card-border)",
              }}
            >
              <FaUsers
                size={36}
                color="var(--dw-card-subtext)"
                style={{ opacity: 0.5, marginBottom: "12px" }}
              />
              <h3 style={{ margin: "0 0 6px 0", color: "var(--dw-card-header)" }}>
                No Beneficiaries Added
              </h3>
              <p
                style={{
                  margin: "0 0 16px 0",
                  fontSize: "13px",
                  color: "var(--dw-card-subtext)",
                }}
              >
                Add your family members, trusted trustees, or nominees to ensure
                seamless succession.
              </p>
              <button
                type="button"
                className="dw-btn dw-btn-primary"
                onClick={openAddModal}
              >
                <FaPlus size={12} /> Add First Beneficiary
              </button>
            </div>
          ) : (
            <div className="dw-table-wrap">
              <table className="dw-table">
                <thead>
                  <tr>
                    <th>Beneficiary</th>
                    <th>Relationship</th>
                    <th>Contact Email</th>
                    <th>Mobile Phone</th>
                    <th>Share Allocation</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {beneficiaries.map((ben) => (
                    <tr key={ben._id}>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              background:
                                ben.relationship?.toLowerCase() === "spouse"
                                  ? "linear-gradient(135deg, #EC4899, #F43F5E)"
                                  : "linear-gradient(135deg, #3B82F6, #1D4ED8)",
                              color: "#FFFFFF",
                              fontWeight: 700,
                              fontSize: "13px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {(ben.name || "B").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{ben.name}</div>
                            <div
                              style={{
                                fontSize: "11px",
                                color: "var(--dw-card-subtext)",
                              }}
                            >
                              ID: {ben._id.slice(-6).toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="dw-badge-pill dw-badge-blue">
                          {ben.relationship || "Nominee"}
                        </span>
                      </td>
                      <td style={{ fontSize: "12.5px" }}>{ben.email}</td>
                      <td
                        style={{
                          fontSize: "12.5px",
                          color: "var(--dw-card-subtext)",
                        }}
                      >
                        {ben.mobile || "—"}
                      </td>
                      <td>
                        <span className="dw-badge-pill dw-badge-purple">
                          {ben.sharePercentage || 50}%
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          <button
                            type="button"
                            className="dw-btn dw-btn-outline dw-btn-sm"
                            title="Edit Nominee"
                            onClick={() => openEditModal(ben)}
                          >
                            <FaEdit size={12} /> Edit
                          </button>
                          <button
                            type="button"
                            className="dw-btn dw-btn-danger dw-btn-sm"
                            title="Delete Nominee"
                            onClick={() => handleDelete(ben._id, ben.name)}
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
      )}

      {/* TAB 2: INHERITED WILLS */}
      {activeTab === "inherited" && (
        <div className="dw-content-card">
          <div className="dw-content-card-header">
            <h3>
              <FaFileContract size={15} color="#2563EB" /> Testaments Appointed
              to You
            </h3>
            <span style={{ fontSize: "12px", color: "var(--dw-card-subtext)" }}>
              Controlled by administrator death verification
            </span>
          </div>

          {!inheritedWill ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px 20px",
                background: "var(--dw-inner-card-bg)",
                borderRadius: "12px",
                border: "1px dashed var(--dw-card-border)",
              }}
            >
              <FaShieldAlt
                size={36}
                color="var(--dw-card-subtext)"
                style={{ opacity: 0.5, marginBottom: "12px" }}
              />
              <h3 style={{ margin: "0 0 6px 0", color: "var(--dw-card-header)" }}>
                No Inherited Wills Found
              </h3>
              <p
                style={{
                  margin: "0",
                  fontSize: "13px",
                  color: "var(--dw-card-subtext)",
                }}
              >
                No active wills registered with your email address as an appointed
                beneficiary.
              </p>
            </div>
          ) : (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                  marginBottom: "18px",
                  paddingBottom: "12px",
                  borderBottom: "1px solid var(--dw-card-border)",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: "0 0 4px 0",
                      color: "var(--dw-card-header)",
                      fontSize: "16px",
                    }}
                  >
                    {inheritedWill.title}
                  </h3>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--dw-card-subtext)",
                    }}
                  >
                    Status: {inheritedWill.status} &bull; Created:{" "}
                    {new Date(inheritedWill.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    className={`dw-badge-pill ${
                      inheritedWill.deathVerificationStatus === "Verified"
                        ? "dw-badge-green"
                        : inheritedWill.deathVerificationStatus === "Rejected"
                          ? "dw-badge-red"
                          : "dw-badge-yellow"
                    }`}
                  >
                    {inheritedWill.deathVerificationStatus === "Verified" ? (
                      <FaCheckCircle size={11} />
                    ) : (
                      <FaClock size={11} />
                    )}
                    Verification: {inheritedWill.deathVerificationStatus}
                  </span>

                  {inheritedWill.deathVerificationStatus === "Verified" && (
                    <button
                      type="button"
                      className="dw-btn dw-btn-primary dw-btn-sm"
                      onClick={() =>
                        downloadPDF(inheritedWill._id, inheritedWill.title)
                      }
                    >
                      <FaFilePdf size={12} /> Download PDF
                    </button>
                  )}
                </div>
              </div>

              {/* Instructions preview */}
              <div style={{ marginBottom: "20px" }}>
                <h4
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    margin: "0 0 8px 0",
                    color: "var(--dw-card-header)",
                  }}
                >
                  Directives &amp; Message
                </h4>
                <div
                  style={{
                    background: "var(--dw-inner-card-bg)",
                    border: "1px solid var(--dw-card-border)",
                    borderRadius: "8px",
                    padding: "12px 14px",
                    fontSize: "13px",
                    color: "var(--dw-card-subtext)",
                    lineHeight: "1.6",
                  }}
                >
                  {inheritedWill.instructions || "No custom instructions recorded."}
                </div>
              </div>

              {/* Assets allocated */}
              <div>
                <h4
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    margin: "0 0 8px 0",
                    color: "var(--dw-card-header)",
                  }}
                >
                  Allocated Assets ({inheritedWill.assets?.length || 0})
                </h4>
                <div style={{ display: "grid", gap: "8px" }}>
                  {inheritedWill.assets?.map((asset, i) => (
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
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Beneficiary Modal */}
      {modalOpen && (
        <div className="dw-modal-backdrop" onClick={closeModal}>
          <div className="dw-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="dw-modal-header">
              <h3>
                {editingBen ? "Edit Beneficiary" : "Add Estate Beneficiary"}
              </h3>
              <button
                type="button"
                className="dw-modal-close"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="dw-modal-body">
                <div className="dw-form-group">
                  <label className="dw-label">Beneficiary Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Connor"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="dw-input-control"
                  />
                </div>

                <div className="dw-form-grid-2">
                  <div className="dw-form-group">
                    <label className="dw-label">Relationship / Role</label>
                    <select
                      value={formData.relationship}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          relationship: e.target.value,
                        })
                      }
                      className="dw-select-control"
                    >
                      <option value="Spouse">Spouse</option>
                      <option value="Child / Son / Daughter">
                        Child (Son / Daughter)
                      </option>
                      <option value="Sibling">Sibling</option>
                      <option value="Parent">Parent</option>
                      <option value="Trustee">Trustee / Legal Executor</option>
                      <option value="Nominee">Nominee</option>
                    </select>
                  </div>

                  <div className="dw-form-group">
                    <label className="dw-label">Share Allocation (%)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="100"
                      value={formData.sharePercentage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sharePercentage: Number(e.target.value),
                        })
                      }
                      className="dw-input-control"
                    />
                  </div>
                </div>

                <div className="dw-form-grid-2">
                  <div className="dw-form-group">
                    <label className="dw-label">Notification Email</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="dw-input-control"
                    />
                  </div>

                  <div className="dw-form-group">
                    <label className="dw-label">Contact Phone</label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 9876543210"
                      value={formData.mobile}
                      onChange={(e) =>
                        setFormData({ ...formData, mobile: e.target.value })
                      }
                      className="dw-input-control"
                    />
                  </div>
                </div>
              </div>
              <div className="dw-modal-footer">
                <button
                  type="button"
                  className="dw-btn dw-btn-outline"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="dw-btn dw-btn-primary">
                  {editingBen ? "Save Changes" : "Register Beneficiary"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default BeneficiaryPortal;
