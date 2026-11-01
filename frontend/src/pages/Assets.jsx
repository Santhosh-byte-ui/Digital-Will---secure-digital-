import { useEffect, useState } from "react";
import {
  FaHome,
  FaCar,
  FaUniversity,
  FaChartLine,
  FaCoins,
  FaPlus,
  FaEdit,
  FaTrash,
  FaShieldAlt,
  FaWallet,
} from "react-icons/fa";
import { apiFetch } from "../api";
import DashboardLayout from "../components/DashboardLayout";

function Assets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const [formData, setFormData] = useState({
    assetName: "",
    assetType: "Property",
    value: "",
    description: "",
  });

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchAssets() {
      try {
        const token = localStorage.getItem("token");
        const response = await apiFetch("/api/assets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setAssets(data.assets || []);
        }
      } catch (error) {
        console.error("Could not load assets:", error);
      } finally {
        setLoading(false);
      }
    }

    void fetchAssets();
  }, [refreshKey]);

  const openAddModal = () => {
    setEditingAsset(null);
    setFormData({
      assetName: "",
      assetType: "Property",
      value: "",
      description: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (asset) => {
    setEditingAsset(asset);
    setFormData({
      assetName: asset.assetName,
      assetType: asset.assetType,
      value: asset.value,
      description: asset.description || "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingAsset(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editingAsset) {
        // Edit
        const res = await apiFetch(`/api/assets/${editingAsset._id}`, {
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
          alert(err.message || "Failed to update asset");
        }
      } else {
        // Create
        const res = await apiFetch("/api/assets", {
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
          alert(err.message || "Failed to add asset");
        }
      }
    } catch (error) {
      console.error("Asset submission error:", error);
      alert("An error occurred while saving the asset.");
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const token = localStorage.getItem("token");
      const res = await apiFetch(`/api/assets/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setRefreshKey((k) => k + 1);
      } else {
        const err = await res.json();
        alert(err.message || "Failed to delete asset");
      }
    } catch (error) {
      console.error("Asset deletion error:", error);
    }
  };

  const getAssetIcon = (type) => {
    const t = type?.toLowerCase() || "";
    if (t.includes("property") || t.includes("real")) {
      return <FaHome size={18} color="#3B82F6" />;
    }
    if (t.includes("vehicle") || t.includes("car")) {
      return <FaCar size={18} color="#10B981" />;
    }
    if (t.includes("bank")) {
      return <FaUniversity size={18} color="#8B5CF6" />;
    }
    if (t.includes("invest") || t.includes("stock")) {
      return <FaChartLine size={18} color="#F59E0B" />;
    }
    return <FaCoins size={18} color="#EC4899" />;
  };

  const totalPortfolioValue = assets.reduce(
    (acc, cur) => acc + (Number(cur.value) || 0),
    0,
  );

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.assetName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (asset.description &&
        asset.description.toLowerCase().includes(searchFilter.toLowerCase()));
    const matchesType =
      selectedType === "all" ||
      asset.assetType.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <DashboardLayout title="Digital Asset Management" activeNav="assets">
      {/* Page Header */}
      <div className="dw-page-header-row">
        <div className="dw-page-header-info">
          <h2>Secure Asset Portfolio</h2>
          <p>
            Catalog real estate, financial portfolios, digital accounts, and
            valuables for inheritance distribution.
          </p>
        </div>
        <div>
          <button type="button" className="dw-btn dw-btn-primary" onClick={openAddModal}>
            <FaPlus size={12} /> Add New Asset
          </button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="dw-metrics-grid" style={{ marginBottom: "24px" }}>
        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">Total Portfolio Value</span>
            <FaCoins className="dw-metric-icon blue" />
          </div>
          <div className="dw-metric-value">
            ₹{totalPortfolioValue.toLocaleString()}
          </div>
        </div>

        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">Total Registered Assets</span>
            <FaWallet className="dw-metric-icon purple" />
          </div>
          <div className="dw-metric-value">{assets.length}</div>
        </div>

        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">Asset Categories</span>
            <FaChartLine className="dw-metric-icon indigo" />
          </div>
          <div className="dw-metric-value">
            {new Set(assets.map((a) => a.assetType)).size}
          </div>
        </div>

        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">Asset Protection</span>
            <FaShieldAlt className="dw-metric-icon" style={{ color: "#10B981" }} />
          </div>
          <div className="dw-metric-value" style={{ color: "#10B981" }}>
            100% Encrypted
          </div>
        </div>
      </div>

      {/* Filter and Content Card */}
      <div className="dw-content-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "18px",
          }}
        >
          <div style={{ display: "flex", gap: "10px", flex: 1, minWidth: "260px" }}>
            <input
              type="text"
              placeholder="Search assets..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="dw-input-control"
              style={{ maxWidth: "300px" }}
            />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="dw-select-control"
              style={{ maxWidth: "180px" }}
            >
              <option value="all">All Types</option>
              <option value="Property">Property</option>
              <option value="Bank Account">Bank Account</option>
              <option value="Investment">Investment</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Digital / Crypto">Digital / Crypto</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <span style={{ fontSize: "12.5px", color: "var(--dw-card-subtext)" }}>
            Showing {filteredAssets.length} of {assets.length} items
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--dw-card-subtext)" }}>
            Loading asset portfolio...
          </div>
        ) : filteredAssets.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 20px",
              background: "var(--dw-inner-card-bg)",
              borderRadius: "12px",
              border: "1px dashed var(--dw-card-border)",
            }}
          >
            <FaCoins size={36} color="var(--dw-card-subtext)" style={{ opacity: 0.5, marginBottom: "12px" }} />
            <h3 style={{ margin: "0 0 6px 0", color: "var(--dw-card-header)" }}>No Assets Found</h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "var(--dw-card-subtext)" }}>
              {assets.length === 0
                ? "Start adding your properties, accounts, or investments to protect them in your Digital Will."
                : "No assets match your search filters."}
            </p>
            {assets.length === 0 && (
              <button type="button" className="dw-btn dw-btn-primary" onClick={openAddModal}>
                <FaPlus size={12} /> Add Your First Asset
              </button>
            )}
          </div>
        ) : (
          <div className="dw-table-wrap">
            <table className="dw-table">
              <thead>
                <tr>
                  <th>Asset Name</th>
                  <th>Category</th>
                  <th>Valuation</th>
                  <th>Description</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "8px",
                            background: "var(--dw-inner-card-bg)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {getAssetIcon(asset.assetType)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{asset.assetName}</div>
                          <div style={{ fontSize: "11px", color: "var(--dw-card-subtext)" }}>
                            ID: {asset._id.slice(-6).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="dw-badge-pill dw-badge-blue">
                        {asset.assetType}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: "#10B981" }}>
                      ₹{Number(asset.value).toLocaleString()}
                    </td>
                    <td style={{ maxWidth: "260px", color: "var(--dw-card-subtext)", fontSize: "12.5px" }}>
                      {asset.description || "—"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px" }}>
                        <button
                          type="button"
                          className="dw-btn dw-btn-outline dw-btn-sm"
                          title="Edit Asset"
                          onClick={() => openEditModal(asset)}
                        >
                          <FaEdit size={12} /> Edit
                        </button>
                        <button
                          type="button"
                          className="dw-btn dw-btn-danger dw-btn-sm"
                          title="Delete Asset"
                          onClick={() => handleDelete(asset._id, asset.assetName)}
                        >
                          <FaTrash size={12} /> Delete
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

      {/* Add / Edit Asset Modal */}
      {modalOpen && (
        <div className="dw-modal-backdrop" onClick={closeModal}>
          <div className="dw-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="dw-modal-header">
              <h3>{editingAsset ? "Edit Asset" : "Add New Asset"}</h3>
              <button type="button" className="dw-modal-close" onClick={closeModal}>
                &times;
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="dw-modal-body">
                <div className="dw-form-group">
                  <label className="dw-label">Asset Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Downtown Residential Flat"
                    value={formData.assetName}
                    onChange={(e) =>
                      setFormData({ ...formData, assetName: e.target.value })
                    }
                    className="dw-input-control"
                  />
                </div>

                <div className="dw-form-grid-2">
                  <div className="dw-form-group">
                    <label className="dw-label">Asset Category</label>
                    <select
                      value={formData.assetType}
                      onChange={(e) =>
                        setFormData({ ...formData, assetType: e.target.value })
                      }
                      className="dw-select-control"
                    >
                      <option value="Property">Property / Real Estate</option>
                      <option value="Bank Account">Bank Account</option>
                      <option value="Investment">Investment Portfolio</option>
                      <option value="Vehicle">Vehicle</option>
                      <option value="Digital / Crypto">Digital Account / Crypto</option>
                      <option value="Other">Other Valuables</option>
                    </select>
                  </div>

                  <div className="dw-form-group">
                    <label className="dw-label">Estimated Value (₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="e.g. 500000"
                      value={formData.value}
                      onChange={(e) =>
                        setFormData({ ...formData, value: e.target.value })
                      }
                      className="dw-input-control"
                    />
                  </div>
                </div>

                <div className="dw-form-group">
                  <label className="dw-label">Description / Identifier Notes</label>
                  <textarea
                    rows="3"
                    placeholder="Provide details such as account numbers, registration IDs, or storage locations..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="dw-textarea-control"
                  />
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
                  {editingAsset ? "Save Changes" : "Create Asset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Assets;
