import { useEffect, useState } from "react";
import { apiFetch } from "../api";

function MyWills() {
  const [wills, setWills] = useState([]);

  useEffect(() => {
    async function fetchWills() {
      try {
        const token = localStorage.getItem("token");
        const response = await apiFetch("/api/will/my-wills", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) setWills(data.wills);
      } catch (error) {
        console.error("Could not load wills.", error.name);
      }
    }

    void fetchWills();
  }, []);

  const downloadPDF = async (willId, title) => {
    try {
      const token = localStorage.getItem("token");

      const response = await apiFetch(`/api/pdf/download/${willId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message);
        return;
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `${title}.pdf`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
      alert("Error downloading PDF");
    }
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
        <h1>📜 My Digital Wills</h1>

        <p>Manage, monitor and download your digital wills securely.</p>
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
          <h3>📜 Total Wills</h3>
          <h1>{wills.length}</h1>
        </div>

        <div className="card">
          <h3>🔐 Protected</h3>
          <h1>100%</h1>
        </div>

        <div className="card">
          <h3>📄 PDF Ready</h3>
          <h1>{wills.length}</h1>
        </div>
      </div>

      {/* Will Cards */}

      {wills.length === 0 ? (
        <div className="card">
          <h2>No Wills Found</h2>
          <p>Create your first digital will.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(350px,1fr))",
            gap: "20px",
          }}
        >
          {wills.map((will) => (
            <div key={will._id} className="card">
              <h2
                style={{
                  color: "#001f7f",
                }}
              >
                📜 {will.title}
              </h2>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color: will.status === "Draft" ? "#f59e0b" : "#16a34a",
                    fontWeight: "bold",
                  }}
                >
                  {will.status}
                </span>
              </p>

              <p>
                <strong>Verification:</strong>{" "}
                <span
                  style={{
                    color:
                      will.deathVerificationStatus === "Verified"
                        ? "#16a34a"
                        : "#f59e0b",
                    fontWeight: "bold",
                  }}
                >
                  {will.deathVerificationStatus}
                </span>
              </p>

              <p>
                <strong>Assets:</strong> {will.assets.length}
              </p>

              <p>
                <strong>Beneficiaries:</strong> {will.beneficiaries.length}
              </p>

              <p>
                <strong>Created:</strong>{" "}
                {new Date(will.createdAt).toLocaleDateString()}
              </p>

              <p>
                <strong>Instructions:</strong>
              </p>

              <p
                style={{
                  color: "#666",
                }}
              >
                {will.instructions}
              </p>

              <button
                onClick={() => downloadPDF(will._id, will.title)}
                style={{
                  background: "#001f7f",
                  color: "white",
                  border: "none",
                  padding: "12px 20px",
                  borderRadius: "10px",
                  marginTop: "15px",
                  width: "100%",
                }}
              >
                📄 Download PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyWills;
