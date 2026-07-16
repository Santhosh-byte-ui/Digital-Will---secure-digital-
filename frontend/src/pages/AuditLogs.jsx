import { useEffect, useState } from "react";

function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/audit-logs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setLogs(data.logs);
      }
    } catch (error) {
      console.log(error);
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
      <div
        style={{
          background:
            "linear-gradient(135deg,#001f7f,#2563eb)",
          color: "white",
          padding: "30px",
          borderRadius: "20px",
          marginBottom: "30px",
        }}
      >
        <h1>📋 Audit Logs</h1>

        <p>
          Track all important activities
          performed within your Digital Will
          Management System.
        </p>
      </div>

      {logs.length === 0 ? (
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
          }}
        >
          <h2>No Activity Found</h2>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "20px",
          }}
        >
          {logs.map((log) => (
            <div
              key={log._id}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "15px",
                boxShadow:
                  "0 8px 20px rgba(0,0,0,0.08)",
              }}
            >
              <h3
                style={{
                  color: "#001f7f",
                  marginBottom: "10px",
                }}
              >
                {log.action}
              </h3>

              <p>
                <strong>Module:</strong>{" "}
                {log.module}
              </p>

              <p>
                <strong>Details:</strong>{" "}
                {log.details}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(
                  log.createdAt
                ).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AuditLogs;