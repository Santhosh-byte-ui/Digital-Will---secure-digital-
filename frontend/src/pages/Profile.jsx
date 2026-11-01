import { useEffect, useState } from "react";
import {
  FaUser,
  FaPhoneAlt,
  FaEdit,
  FaSave,
  FaCheckCircle,
  FaLock,
} from "react-icons/fa";
import { apiFetch } from "../api";
import DashboardLayout from "../components/DashboardLayout";

function Profile() {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    emergencyContactName: "",
    emergencyContactMobile: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await apiFetch("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok && data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Could not load profile:", error);
      } finally {
        setLoading(false);
      }
    }

    void fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const updateProfile = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      setSuccessMsg("");
      const token = localStorage.getItem("token");

      const response = await apiFetch("/api/auth/emergency-contact", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          emergencyContactName: user.emergencyContactName,
          emergencyContactMobile: user.emergencyContactMobile,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setEditing(false);
        setSuccessMsg("Emergency contact updated successfully");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update emergency contact.");
    } finally {
      setSaving(false);
    }
  };

  const avatarInitial = (user.name || "U").charAt(0).toUpperCase();

  return (
    <DashboardLayout title="User Profile" activeNav="profile">
      {/* Header */}
      <div className="dw-page-header-row">
        <div className="dw-page-header-info">
          <h2>Account Security &amp; Contact Information</h2>
          <p>
            Review your verified credentials, account role permissions, and
            designated emergency contact for heartbeat pings.
          </p>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="dw-metrics-grid" style={{ marginBottom: "24px" }}>
        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">Account Type</span>
            <FaUser className="dw-metric-icon purple" />
          </div>
          <div className="dw-metric-value" style={{ textTransform: "capitalize" }}>
            {user.role === "admin" ? "Platform Administrator" : "Estate Owner"}
          </div>
        </div>

        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">Verification Status</span>
            <FaCheckCircle className="dw-metric-icon" style={{ color: "#10B981" }} />
          </div>
          <div className="dw-metric-value" style={{ color: "#10B981" }}>
            Active &amp; Verified
          </div>
        </div>

        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">Emergency Contact</span>
            <FaPhoneAlt className="dw-metric-icon blue" />
          </div>
          <div className="dw-metric-value" style={{ fontSize: "15px" }}>
            {user.emergencyContactName ? user.emergencyContactName : "Not Configured"}
          </div>
        </div>

        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">Session Security</span>
            <FaLock className="dw-metric-icon indigo" />
          </div>
          <div className="dw-metric-value">JWT Protected</div>
        </div>
      </div>

      <div style={{ maxWidth: "750px", margin: "0 auto" }}>
        <div className="dw-content-card">
          <div className="dw-content-card-header">
            <h3>
              <FaUser size={15} color="#2563EB" /> Account Identity
            </h3>
            {successMsg && (
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
                <FaCheckCircle size={12} /> {successMsg}
              </span>
            )}
          </div>

          {loading ? (
            <div style={{ padding: "30px", textAlign: "center", color: "var(--dw-card-subtext)" }}>
              Loading profile details...
            </div>
          ) : (
            <div>
              {/* User Avatar + Identity Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                  padding: "16px",
                  background: "var(--dw-inner-card-bg)",
                  borderRadius: "12px",
                  border: "1px solid var(--dw-card-border)",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                    color: "#FFFFFF",
                    fontSize: "22px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {avatarInitial}
                </div>
                <div>
                  <h3 style={{ margin: "0 0 4px 0", color: "var(--dw-card-header)" }}>
                    {user.name}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "12.5px",
                      color: "var(--dw-card-subtext)",
                    }}
                  >
                    <span>{user.email}</span>
                    <span className="dw-badge-pill dw-badge-blue">
                      {user.role === "admin" ? "Admin" : "Owner"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Readonly Core Credentials */}
              <div className="dw-form-grid-2">
                <div className="dw-form-group">
                  <label className="dw-label">Account Holder Name</label>
                  <input
                    type="text"
                    disabled
                    value={user.name || ""}
                    className="dw-input-control"
                    style={{ opacity: 0.8, cursor: "not-allowed" }}
                  />
                </div>

                <div className="dw-form-group">
                  <label className="dw-label">Registered Primary Email</label>
                  <input
                    type="email"
                    disabled
                    value={user.email || ""}
                    className="dw-input-control"
                    style={{ opacity: 0.8, cursor: "not-allowed" }}
                  />
                </div>
              </div>

              {/* Emergency Contact Section */}
              <div style={{ marginTop: "16px", paddingTop: "18px", borderTop: "1px solid var(--dw-card-border)" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <div>
                    <h4 style={{ margin: "0 0 4px 0", color: "var(--dw-card-header)", fontSize: "14px" }}>
                      Emergency Heartbeat Contact
                    </h4>
                    <p style={{ margin: 0, fontSize: "12px", color: "var(--dw-card-subtext)" }}>
                      Notified if inactivity threshold is reached before verification starts.
                    </p>
                  </div>
                  {!editing && (
                    <button
                      type="button"
                      className="dw-btn dw-btn-outline dw-btn-sm"
                      onClick={() => setEditing(true)}
                    >
                      <FaEdit size={12} /> Edit Contact
                    </button>
                  )}
                </div>

                <div className="dw-form-grid-2">
                  <div className="dw-form-group">
                    <label className="dw-label">Emergency Contact Name</label>
                    <input
                      type="text"
                      name="emergencyContactName"
                      disabled={!editing}
                      placeholder="e.g. John Connor"
                      value={user.emergencyContactName || ""}
                      onChange={handleChange}
                      className="dw-input-control"
                      style={!editing ? { opacity: 0.8 } : {}}
                    />
                  </div>

                  <div className="dw-form-group">
                    <label className="dw-label">Emergency Contact Mobile Phone</label>
                    <input
                      type="tel"
                      name="emergencyContactMobile"
                      disabled={!editing}
                      placeholder="e.g. +91 9876543210"
                      value={user.emergencyContactMobile || ""}
                      onChange={handleChange}
                      className="dw-input-control"
                      style={!editing ? { opacity: 0.8 } : {}}
                    />
                  </div>
                </div>

                {editing && (
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                    <button
                      type="button"
                      className="dw-btn dw-btn-outline"
                      onClick={() => setEditing(false)}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="dw-btn dw-btn-primary"
                      onClick={updateProfile}
                      disabled={saving}
                    >
                      <FaSave size={12} /> {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Profile;
