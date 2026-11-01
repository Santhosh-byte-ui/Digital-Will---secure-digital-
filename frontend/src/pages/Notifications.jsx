import { useEffect, useState } from "react";
import {
  FaBell,
  FaInfoCircle,
  FaClock,
} from "react-icons/fa";
import { apiFetch } from "../api";
import DashboardLayout from "../components/DashboardLayout";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await apiFetch("/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setNotifications(data.notifications || []);
        }
      } catch (error) {
        console.error("Could not load notifications:", error);
      } finally {
        setLoading(false);
      }
    }

    void fetchNotifications();
  }, []);

  return (
    <DashboardLayout title="Notifications" activeNav="dashboard">
      {/* Header */}
      <div className="dw-page-header-row">
        <div className="dw-page-header-info">
          <h2>Alerts &amp; System Notifications</h2>
          <p>
            Real-time status updates regarding estate verification, security
            heartbeat pings, and nominee notices.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div className="dw-content-card">
          <div className="dw-content-card-header">
            <h3>
              <FaBell size={15} color="#2563EB" /> Notification Feed ({notifications.length})
            </h3>
            <span style={{ fontSize: "12px", color: "var(--dw-card-subtext)" }}>
              Sorted by most recent
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
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px 20px",
                background: "var(--dw-inner-card-bg)",
                borderRadius: "12px",
                border: "1px dashed var(--dw-card-border)",
              }}
            >
              <FaBell
                size={36}
                color="var(--dw-card-subtext)"
                style={{ opacity: 0.5, marginBottom: "12px" }}
              />
              <h3 style={{ margin: "0 0 6px 0", color: "var(--dw-card-header)" }}>
                All Caught Up!
              </h3>
              <p
                style={{
                  margin: "0",
                  fontSize: "13px",
                  color: "var(--dw-card-subtext)",
                }}
              >
                You have no pending notifications or urgent estate warnings.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {notifications.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    padding: "16px",
                    background: "var(--dw-inner-card-bg)",
                    border: "1px solid var(--dw-card-border)",
                    borderRadius: "10px",
                    transition: "border-color 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "8px",
                      background: "rgba(37, 99, 235, 0.12)",
                      color: "#2563EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <FaInfoCircle size={17} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginBottom: "4px",
                      }}
                    >
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "var(--dw-card-header)",
                        }}
                      >
                        {item.title}
                      </h4>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "var(--dw-card-subtext)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <FaClock size={10} />
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        color: "var(--dw-card-subtext)",
                        lineHeight: "1.5",
                      }}
                    >
                      {item.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Notifications;
