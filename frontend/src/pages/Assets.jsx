import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import {
  FaHome,
  FaCar,
  FaUniversity,
  FaChartLine,
  FaMoneyBillWave,
} from "react-icons/fa";

function Assets() {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    async function fetchAssets() {
      try {
        const token = localStorage.getItem("token");
        const response = await apiFetch("/api/assets", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) setAssets(data.assets);
      } catch (error) {
        console.error("Could not load assets.", error.name);
      }
    }

    void fetchAssets();
  }, []);

  const getIcon = (type) => {
    const assetType = type?.toLowerCase();

    if (assetType?.includes("property"))
      return <FaHome size={35} color="#2563eb" />;

    if (assetType?.includes("vehicle"))
      return <FaCar size={35} color="#16a34a" />;

    if (assetType?.includes("bank"))
      return <FaUniversity size={35} color="#9333ea" />;

    if (assetType?.includes("investment"))
      return <FaChartLine size={35} color="#ea580c" />;

    return <FaMoneyBillWave size={35} color="#dc2626" />;
  };

  const totalValue = assets.reduce(
    (sum, asset) => sum + Number(asset.value || 0),
    0,
  );

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
        <h1>🏠 Asset Management</h1>

        <p>
          Manage properties, bank accounts, investments and valuable assets
          securely.
        </p>
      </div>

      {/* Stats */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div className="card">
          <h3>🏠 Total Assets</h3>
          <h1>{assets.length}</h1>
        </div>

        <div className="card">
          <h3>💰 Total Value</h3>
          <h2
            style={{
              color: "#16a34a",
            }}
          >
            ₹{totalValue.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <h3>🔒 Protected</h3>
          <h1>100%</h1>
        </div>
      </div>

      {/* Asset Cards */}

      {assets.length === 0 ? (
        <div className="card">
          <h2>No Assets Found</h2>

          <p>Add assets to start managing your inheritance portfolio.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
            gap: "25px",
          }}
        >
          {assets.map((asset) => (
            <div key={asset._id} className="card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  marginBottom: "15px",
                }}
              >
                {getIcon(asset.assetType)}

                <div>
                  <h3
                    style={{
                      margin: 0,
                      color: "#001f7f",
                    }}
                  >
                    {asset.assetName}
                  </h3>

                  <small>{asset.assetType}</small>
                </div>
              </div>

              <div
                style={{
                  background: "#eef4ff",
                  padding: "15px",
                  borderRadius: "10px",
                  marginBottom: "15px",
                }}
              >
                <strong>Asset Value</strong>

                <h2
                  style={{
                    color: "#16a34a",
                    marginTop: "8px",
                  }}
                >
                  ₹{Number(asset.value).toLocaleString()}
                </h2>
              </div>

              <p
                style={{
                  color: "#555",
                }}
              >
                {asset.description || "No description available"}
              </p>

              <div
                style={{
                  marginTop: "15px",
                  padding: "10px",
                  background: "#f8fafc",
                  borderRadius: "8px",
                }}
              >
                <strong>ID:</strong> {asset._id.slice(-8)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Assets;
