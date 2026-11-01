import { useEffect, useState } from "react";
import { apiFetch } from "../api";

function BeneficiaryPortal() {
  const [will, setWill] = useState(null);

  useEffect(() => {
    async function fetchWill() {
      try {
        const token = localStorage.getItem("token");
        const response = await apiFetch("/api/beneficiary-portal/my-will", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) setWill(data.will);
      } catch (error) {
        console.error("Could not load beneficiary will.", error.name);
      }
    }

    void fetchWill();
  }, []);

  const getStatusBadgeStyle = (status) => {
    if (status === "Verified") {
      return { background: "#16a34a", color: "white" };
    }
    if (status === "Rejected") {
      return { background: "#dc2626", color: "white" };
    }
    return { background: "#f59e0b", color: "white" };
  };

  if (!will) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f4f7fc",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "20px",
            textAlign: "center",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          }}
        >
          <h2>📭 No Will Available</h2>
          <p>No verified will found for your registered email.</p>
        </div>
      </div>
    );
  }

  const badgeStyle = getStatusBadgeStyle(will.deathVerificationStatus);

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
        <h1>👨‍👩‍👧 Beneficiary Portal</h1>
        <p>
          View inheritance information securely after successful verification.
        </p>
      </div>

      {/* Will Overview */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "15px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          marginBottom: "25px",
        }}
      >
        <h2 style={{ color: "#001f7f" }}>📜 {will.title}</h2>

        <p style={{ marginTop: "12px" }}>
          <strong>Verification Status:</strong>{" "}
          <span
            style={{
              ...badgeStyle,
              padding: "5px 14px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: 600,
              display: "inline-block",
            }}
          >
            {will.deathVerificationStatus === "Verified"
              ? "Verified ✅"
              : will.deathVerificationStatus === "Rejected"
                ? "Rejected ❌"
                : "Pending ⏳"}
          </span>
        </p>

        <p style={{ marginTop: "10px" }}>
          <strong>Will Status:</strong> {will.status}
        </p>

        <p style={{ marginTop: "10px" }}>
          <strong>Instructions:</strong> {will.instructions || "None specified"}
        </p>
      </div>

      {/* Assets */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "15px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          marginBottom: "25px",
        }}
      >
        <h2 style={{ color: "#001f7f" }}>💰 Assets Information</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {will.assets.map((asset, index) => (
            <div
              key={asset._id || index}
              style={{
                background: "#eef4ff",
                padding: "20px",
                borderRadius: "12px",
              }}
            >
              <h3>🏠 {asset.assetName}</h3>
              <p>
                <strong>Type:</strong> {asset.assetType}
              </p>
              <p>
                <strong>Value:</strong> ₹{Number(asset.value || 0).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Beneficiaries */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "15px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          marginBottom: "25px",
        }}
      >
        <h2 style={{ color: "#001f7f" }}>👥 Beneficiary Details</h2>

        {will.beneficiaries.map((person, index) => (
          <div
            key={person._id || index}
            style={{
              borderBottom: "1px solid #e5e7eb",
              padding: "15px 0",
            }}
          >
            <p>
              <strong>Name:</strong> {person.name}
            </p>
            <p>
              <strong>Email:</strong> {person.email}
            </p>
            <p>
              <strong>Relation:</strong> {person.relation}
            </p>
            <p>
              <strong>Share:</strong> {person.sharePercentage}%
            </p>
          </div>
        ))}
      </div>

      {/* Verification Info */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "15px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ color: "#001f7f" }}>🔐 Verification Details</h2>

        <p style={{ marginTop: "10px" }}>
          <strong>Verification Status:</strong> {will.deathVerificationStatus}
        </p>

        {will.verifiedAt && (
          <p style={{ marginTop: "6px" }}>
            <strong>Verified On:</strong>{" "}
            {new Date(will.verifiedAt).toLocaleString()}
          </p>
        )}

        <p style={{ marginTop: "6px" }}>
          <strong>Created On:</strong>{" "}
          {new Date(will.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default BeneficiaryPortal;
