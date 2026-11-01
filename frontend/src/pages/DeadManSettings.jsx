import { useState, useEffect } from "react";
import {
  FaHeartbeat,
  FaShieldAlt,
  FaClock,
  FaEnvelope,
  FaPhoneAlt,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";
import { apiFetch } from "../api";
import DashboardLayout from "../components/DashboardLayout";

function DeadManSettings() {
  const [deadManEnabled, setDeadManEnabled] = useState(false);
  const [inactivityDays, setInactivityDays] = useState(30);
  const [remainingDays, setRemainingDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadCurrentSettings() {
      try {
        const token = localStorage.getItem("token");
        const res = await apiFetch("/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.deadManStatus) {
            setDeadManEnabled(Boolean(data.deadManStatus.deadManEnabled));
            const daysConfig = data.deadManStatus.inactivityDays || 30;
            setInactivityDays(daysConfig);
            if (data.deadManStatus.lastActiveDate) {
              const elapsedMs =
                Date.now() -
                new Date(data.deadManStatus.lastActiveDate).getTime();
              const elapsedDays = Math.floor(
                elapsedMs / (1000 * 60 * 60 * 24),
              );
              setRemainingDays(Math.max(1, daysConfig - elapsedDays));
            } else {
              setRemainingDays(daysConfig);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load dead man settings:", err);
      } finally {
        setLoading(false);
      }
    }
    void loadCurrentSettings();
  }, []);

  const saveSettings = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      setSavedSuccess(false);
      const token = localStorage.getItem("token");

      const response = await apiFetch("/api/deadman/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deadManEnabled,
          inactivityDays: Number(inactivityDays),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        alert(data.message || "Failed to update settings");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Inactivity Monitoring" activeNav="deadman">
      {/* Page Header */}
      <div className="dw-page-header-row">
        <div className="dw-page-header-info">
          <h2>Inactivity Monitoring &amp; Dead Man&apos;s Switch</h2>
          <p>
            Configure automated heartbeat checks and inactivity timers that
            safely trigger death verification review protocols.
          </p>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="dw-metrics-grid" style={{ marginBottom: "24px" }}>
        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">Switch Status</span>
            <FaHeartbeat
              className="dw-metric-icon"
              style={{ color: deadManEnabled ? "#10B981" : "#94A3B8" }}
            />
          </div>
          <div
            className="dw-metric-value"
            style={{ color: deadManEnabled ? "#10B981" : "var(--dw-card-subtext)" }}
          >
            {deadManEnabled ? "Active & Armed" : "Disabled"}
          </div>
        </div>

        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">Inactivity Threshold</span>
            <FaClock className="dw-metric-icon blue" />
          </div>
          <div className="dw-metric-value">{inactivityDays} Days</div>
        </div>

        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">Next Heartbeat Check</span>
            <FaClock className="dw-metric-icon purple" />
          </div>
          <div className="dw-metric-value">
            {deadManEnabled ? `${remainingDays} Days` : "Paused"}
          </div>
        </div>

        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">Protection Protocol</span>
            <FaShieldAlt className="dw-metric-icon" style={{ color: "#F59E0B" }} />
          </div>
          <div className="dw-metric-value" style={{ color: "#F59E0B" }}>
            Admin Review
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Visual Pulse Banner matching Mockup */}
        <div
          className="dw-card"
          style={{ marginBottom: "20px" }}
        >
          <div className="dw-pulse-banner">
            <div className="dw-pulse-icon-box">
              <FaHeartbeat size={15} />
            </div>
            <div className="dw-pulse-content">
              <span className="dw-pulse-title">
                {deadManEnabled
                  ? `Next ping in ${remainingDays} days`
                  : "Dead Man's Switch is currently inactive"}
              </span>
              <span className="dw-pulse-sub">
                Trigger config &amp; email/SMS verification channels
              </span>
            </div>
          </div>

          <div className="dw-deadman-config-box" style={{ marginTop: "12px" }}>
            <div className="dw-deadman-left">
              <div className="dw-deadman-icon-wrap">
                <FaEnvelope size={13} />
              </div>
              <div className="dw-deadman-text">
                <span className="dw-deadman-title">Configured Heartbeat Channels</span>
                <span className="dw-deadman-sub">
                  Email pings &amp; Emergency SMS alerts
                </span>
              </div>
            </div>
            <div className="dw-deadman-right">
              <span className="dw-badge-pill-status">Status: Active</span>
              <button
                type="button"
                className="dw-deadman-phone-btn"
                title="Emergency phone verification active"
              >
                <FaPhoneAlt size={11} />
              </button>
            </div>
          </div>
        </div>

        {/* Configuration Form */}
        <div className="dw-content-card">
          <div className="dw-content-card-header">
            <h3>
              <FaClock size={15} color="#2563EB" /> Inactivity Trigger Configuration
            </h3>
            {savedSuccess && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#10B981",
                  fontSize: "12.5px",
                  fontWeight: 600,
                }}
              >
                <FaCheckCircle size={12} /> Settings saved successfully
              </span>
            )}
          </div>

          {loading ? (
            <div style={{ padding: "30px", textAlign: "center", color: "var(--dw-card-subtext)" }}>
              Loading timer configuration...
            </div>
          ) : (
            <form onSubmit={saveSettings}>
              {/* Toggle Switch */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px",
                  background: "var(--dw-inner-card-bg)",
                  border: "1px solid var(--dw-card-border)",
                  borderRadius: "10px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: "var(--dw-card-header)" }}>
                    Enable Dead Man&apos;s Switch Algorithm
                  </div>
                  <div
                    style={{
                      fontSize: "12.5px",
                      color: "var(--dw-card-subtext)",
                      marginTop: "4px",
                    }}
                  >
                    Automatically monitor user login and system activity
                  </div>
                </div>
                <label
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: "48px",
                    height: "26px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={deadManEnabled}
                    onChange={(e) => setDeadManEnabled(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: deadManEnabled ? "#10B981" : "#94A3B8",
                      borderRadius: "26px",
                      transition: "0.2s",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        height: "20px",
                        width: "20px",
                        left: deadManEnabled ? "24px" : "3px",
                        bottom: "3px",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        transition: "0.2s",
                      }}
                    />
                  </span>
                </label>
              </div>

              {/* Inactivity Threshold */}
              <div className="dw-form-group">
                <label className="dw-label">
                  Inactivity Timeout Threshold: <strong>{inactivityDays} Days</strong>
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <input
                    type="range"
                    min="1"
                    max="365"
                    value={inactivityDays}
                    onChange={(e) => setInactivityDays(Number(e.target.value))}
                    style={{ flex: 1 }}
                  />
                  <input
                    type="number"
                    min="1"
                    max="3650"
                    value={inactivityDays}
                    onChange={(e) => setInactivityDays(Number(e.target.value))}
                    className="dw-input-control"
                    style={{ maxWidth: "100px" }}
                  />
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--dw-card-subtext)",
                    marginTop: "6px",
                  }}
                >
                  Recommended: 30 to 90 days for balanced responsiveness and security.
                </div>
              </div>

              {/* Security Rule Alert Box */}
              <div
                style={{
                  background: "rgba(245, 158, 11, 0.08)",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  borderRadius: "10px",
                  padding: "16px",
                  marginBottom: "24px",
                  display: "flex",
                  gap: "12px",
                }}
              >
                <FaExclamationTriangle
                  size={18}
                  color="#F59E0B"
                  style={{ flexShrink: 0, marginTop: "2px" }}
                />
                <div style={{ fontSize: "12.5px", color: "var(--dw-card-header)", lineHeight: "1.6" }}>
                  <strong>Fail-Safe Death Verification Standard:</strong> Expiration of the
                  inactivity timer will <em>never</em> release sensitive wills or asset
                  credentials directly. Inactivity only initiates formal notifications and
                  requests evidence (e.g. death certificates) for official administrator review.
                </div>
              </div>

              {/* Submit Button */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="submit"
                  className="dw-btn dw-btn-primary"
                  disabled={saving}
                  style={{ padding: "10px 24px" }}
                >
                  {saving ? "Saving Settings..." : "Save Monitoring Settings"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DeadManSettings;
