import SecurityScore from "../components/SecurityScore";
import DeadManStatus from "../components/DeadManStatus";
import RecentActivity from "../components/RecentActivity";
import UploadTrendChart from "../components/UploadTrendChart";
import AssetPieChart from "../components/AssetPieChart";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [stats, setStats] = useState({
    totalAssets: 0,
    totalBeneficiaries: 0,
    totalWills: 0,
    totalDocuments: 0,
    totalEstateValue: 0,
    assetDistribution: [],
    uploadTrend: [],
    recentActivities: [],
    deadManStatus: null,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://digital-will-wg4g.onrender.com/api/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Dashboard Data:", data);

      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cardStyle = {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "25px",
    minWidth: "220px",
    textAlign: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  };

  const buttonStyle = {
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
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
          background:
            "linear-gradient(135deg,#001f7f,#0047ff)",
          color: "white",
          padding: "30px",
          borderRadius: "20px",
          marginBottom: "30px",
        }}
      >
        <h1>
          👋 Welcome to Digital Will Management System
        </h1>

        <p>
          Securely manage your wills, assets,
          beneficiaries and important documents.
        </p>
      </div>

      {/* Dashboard Overview */}
      <h2
        style={{
          color: "#001f7f",
          marginBottom: "20px",
        }}
      >
        Dashboard Overview
      </h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <div style={cardStyle}>
          <h1>📜</h1>
          <h2>{stats.totalWills}</h2>
          <p>Total Wills</p>
        </div>

        <div style={cardStyle}>
          <h1>🏠</h1>
          <h2>{stats.totalAssets}</h2>
          <p>Total Assets</p>
        </div>

        <div style={cardStyle}>
          <h1>💰</h1>
          <h2>
            ₹
            {Number(
              stats.totalEstateValue || 0
            ).toLocaleString()}
          </h2>
          <p>Total Estate Value</p>
        </div>

        <div style={cardStyle}>
          <h1>👨‍👩‍👧‍👦</h1>
          <h2>{stats.totalBeneficiaries}</h2>
          <p>Total Beneficiaries</p>
        </div>

        <div style={cardStyle}>
          <h1>📄</h1>
          <h2>{stats.totalDocuments}</h2>
          <p>Vault Documents</p>
        </div>

        <div style={cardStyle}>
          <h1>☁️</h1>
          <h2>AWS S3</h2>
          <p>Cloud Storage Active</p>
        </div>
      </div>

      {/* Charts */}
      <AssetPieChart
        data={stats.assetDistribution}
      />

      <UploadTrendChart
        data={stats.uploadTrend}
      />

      {/* Recent Activity */}
      <RecentActivity
        activities={stats.recentActivities}
      />

      {/* Dead Man Algorithm */}
      <DeadManStatus
        data={stats.deadManStatus}
      />

      {/* Security Score */}
      <SecurityScore
        stats={stats}
      />

      {/* Quick Actions */}
      <div
        style={{
          marginTop: "40px",
        }}
      >
        <h2
          style={{
            color: "#001f7f",
            marginBottom: "20px",
          }}
        >
          Quick Actions
        </h2>

        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <Link to="/create-will">
            <button
              style={{
                ...buttonStyle,
                background: "#001f7f",
              }}
            >
              ➕ Create Will
            </button>
          </Link>

          <Link to="/assets">
            <button
              style={{
                ...buttonStyle,
                background: "#16a34a",
              }}
            >
              🏠 Manage Assets
            </button>
          </Link>

          <Link to="/vault">
            <button
              style={{
                ...buttonStyle,
                background: "#dc2626",
              }}
            >
              📂 Digital Vault
            </button>
          </Link>

          <Link to="/my-wills">
            <button
              style={{
                ...buttonStyle,
                background: "#9333ea",
              }}
            >
              📄 My Wills
            </button>
          </Link>
        </div>
      </div>

      {/* About */}
      <div
        style={{
          background: "#ffffff",
          marginTop: "40px",
          padding: "25px",
          borderRadius: "16px",
          boxShadow:
            "0 8px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ color: "#001f7f" }}>
          About Your Digital Will
        </h2>

        <p
          style={{
            color: "#555",
            lineHeight: "1.8",
          }}
        >
          This platform helps you securely store
          assets, create digital wills, manage
          beneficiaries, upload important
          documents, and ensure proper
          inheritance distribution through a
          secure verification process.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;