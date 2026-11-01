import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFileContract,
  FaCoins,
  FaUsers,
  FaShieldAlt,
  FaCheck,
  FaArrowLeft,
} from "react-icons/fa";
import { apiFetch } from "../api";
import DashboardLayout from "../components/DashboardLayout";

function CreateWill() {
  const navigate = useNavigate();
  const [existingAssets, setExistingAssets] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    assetName: "",
    assetType: "Property",
    value: "",
    beneficiaryName: "",
    beneficiaryEmail: "",
    beneficiaryMobile: "",
    relation: "Nominee",
    sharePercentage: 100,
    instructions: "",
  });

  useEffect(() => {
    async function loadAssets() {
      try {
        const token = localStorage.getItem("token");
        const res = await apiFetch("/api/assets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setExistingAssets(data.assets || []);
        }
      } catch (err) {
        console.error("Could not prefill assets:", err);
      }
    }
    void loadAssets();
  }, []);

  const handleAssetSelect = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;
    const found = existingAssets.find((a) => a._id === selectedId);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        assetName: found.assetName,
        assetType: found.assetType,
        value: found.value,
      }));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const response = await apiFetch("/api/will/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          assets: [
            {
              assetName: formData.assetName,
              assetType: formData.assetType,
              value: Number(formData.value),
            },
          ],
          beneficiaries: [
            {
              name: formData.beneficiaryName,
              email: formData.beneficiaryEmail,
              mobile: formData.beneficiaryMobile,
              relation: formData.relation || "Nominee",
              sharePercentage: Number(formData.sharePercentage) || 100,
            },
          ],
          instructions: formData.instructions,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/my-wills");
      } else {
        alert(data.message || "Failed to create digital will");
      }
    } catch (error) {
      console.error("Create will error:", error);
      alert("Error creating digital will.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Digital Will Management" activeNav="wills">
      {/* Page Header */}
      <div className="dw-page-header-row">
        <div className="dw-page-header-info">
          <h2>Create Digital Testament</h2>
          <p>
            Structure an enforceable succession testament allocating estate
            assets and appointing certified beneficiaries.
          </p>
        </div>
        <div>
          <button
            type="button"
            className="dw-btn dw-btn-outline"
            onClick={() => navigate("/my-wills")}
          >
            <FaArrowLeft size={11} /> Back to Wills
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <form onSubmit={handleSubmit}>
          {/* Section 1: Will Meta */}
          <div className="dw-content-card">
            <div className="dw-content-card-header">
              <h3>
                <FaFileContract size={15} color="#8B5CF6" /> 1. Testament Title &amp; Details
              </h3>
            </div>
            <div className="dw-form-group">
              <label className="dw-label">Title of Will</label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Primary Last Will & Testament (Estate of Santhosh)"
                value={formData.title}
                onChange={handleChange}
                className="dw-input-control"
              />
            </div>
          </div>

          {/* Section 2: Asset Allocation */}
          <div className="dw-content-card">
            <div className="dw-content-card-header">
              <h3>
                <FaCoins size={15} color="#2563EB" /> 2. Estate Asset Allocation
              </h3>
              {existingAssets.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "12px", color: "var(--dw-card-subtext)" }}>
                    Quick Select:
                  </span>
                  <select
                    onChange={handleAssetSelect}
                    className="dw-select-control"
                    style={{ padding: "4px 8px", fontSize: "12px", width: "auto" }}
                  >
                    <option value="">-- Choose Existing Asset --</option>
                    {existingAssets.map((asset) => (
                      <option key={asset._id} value={asset._id}>
                        {asset.assetName} (₹{Number(asset.value).toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="dw-form-group">
              <label className="dw-label">Asset Name</label>
              <input
                type="text"
                name="assetName"
                required
                placeholder="e.g. Residential Villa No. 4"
                value={formData.assetName}
                onChange={handleChange}
                className="dw-input-control"
              />
            </div>

            <div className="dw-form-grid-2">
              <div className="dw-form-group">
                <label className="dw-label">Asset Type</label>
                <select
                  name="assetType"
                  value={formData.assetType}
                  onChange={handleChange}
                  className="dw-select-control"
                >
                  <option value="Property">Property / Real Estate</option>
                  <option value="Bank Account">Bank Account</option>
                  <option value="Investment">Investment Portfolio</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Digital Account">Digital Account / Crypto</option>
                  <option value="Other">Other Valuables</option>
                </select>
              </div>

              <div className="dw-form-group">
                <label className="dw-label">Asset Valuation (₹)</label>
                <input
                  type="number"
                  name="value"
                  required
                  min="0"
                  placeholder="e.g. 1500000"
                  value={formData.value}
                  onChange={handleChange}
                  className="dw-input-control"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Beneficiary Roster */}
          <div className="dw-content-card">
            <div className="dw-content-card-header">
              <h3>
                <FaUsers size={15} color="#10B981" /> 3. Primary Beneficiary Designation
              </h3>
            </div>

            <div className="dw-form-grid-2">
              <div className="dw-form-group">
                <label className="dw-label">Beneficiary Full Name</label>
                <input
                  type="text"
                  name="beneficiaryName"
                  required
                  placeholder="e.g. Sarah Connor"
                  value={formData.beneficiaryName}
                  onChange={handleChange}
                  className="dw-input-control"
                />
              </div>

              <div className="dw-form-group">
                <label className="dw-label">Beneficiary Email</label>
                <input
                  type="email"
                  name="beneficiaryEmail"
                  required
                  placeholder="e.g. sarah.connor@example.com"
                  value={formData.beneficiaryEmail}
                  onChange={handleChange}
                  className="dw-input-control"
                />
              </div>
            </div>

            <div className="dw-form-grid-2">
              <div className="dw-form-group">
                <label className="dw-label">Beneficiary Contact Mobile</label>
                <input
                  type="tel"
                  name="beneficiaryMobile"
                  required
                  placeholder="e.g. +91 9876543210"
                  value={formData.beneficiaryMobile}
                  onChange={handleChange}
                  className="dw-input-control"
                />
              </div>

              <div className="dw-form-group">
                <label className="dw-label">Relationship / Role</label>
                <select
                  name="relation"
                  value={formData.relation}
                  onChange={handleChange}
                  className="dw-select-control"
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Child / Son / Daughter">Child (Son / Daughter)</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Parent">Parent</option>
                  <option value="Trustee">Trustee / Executor</option>
                  <option value="Nominee">Nominee</option>
                </select>
              </div>
            </div>

            <div className="dw-form-group">
              <label className="dw-label">Share Allocation Percentage (%)</label>
              <input
                type="number"
                name="sharePercentage"
                min="1"
                max="100"
                required
                value={formData.sharePercentage}
                onChange={handleChange}
                className="dw-input-control"
                style={{ maxWidth: "200px" }}
              />
            </div>
          </div>

          {/* Section 4: Succession Instructions & Clauses */}
          <div className="dw-content-card">
            <div className="dw-content-card-header">
              <h3>
                <FaShieldAlt size={15} color="#F59E0B" /> 4. Instructions &amp; Succession Directives
              </h3>
            </div>

            <div className="dw-form-group">
              <label className="dw-label">Testament Clauses &amp; Execution Terms</label>
              <textarea
                name="instructions"
                rows="4"
                required
                placeholder="Specify execution conditions, funeral requests, special trust provisions, or messages for beneficiaries..."
                value={formData.instructions}
                onChange={handleChange}
                className="dw-textarea-control"
              />
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "var(--dw-card-subtext)",
                lineHeight: "1.6",
                background: "var(--dw-inner-card-bg)",
                padding: "12px",
                borderRadius: "8px",
                marginTop: "12px",
              }}
            >
              <FaShieldAlt size={12} color="#10B981" style={{ marginRight: "6px" }} />
              <strong>Legal Security Guarantee:</strong> Inactivity triggers will never
              release inheritance details automatically. Official administrator review and
              death certificate verification are strictly required before beneficiary release.
            </div>
          </div>

          {/* Submit Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginBottom: "30px" }}>
            <button
              type="button"
              className="dw-btn dw-btn-outline"
              onClick={() => navigate("/my-wills")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="dw-btn dw-btn-primary"
              disabled={loading}
              style={{ padding: "10px 24px" }}
            >
              <FaCheck size={12} />
              {loading ? "Generating Digital Will..." : "Finalize & Register Will"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default CreateWill;
