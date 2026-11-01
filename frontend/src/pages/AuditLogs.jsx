import { useEffect, useState } from "react";
import {
  FaListUl,
  FaShieldAlt,
  FaClock,
  FaFilter,
} from "react-icons/fa";
import { apiFetch } from "../api";
import DashboardLayout from "../components/DashboardLayout";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");

  useEffect(() => {
    async function fetchLogs() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await apiFetch("/api/audit-logs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setLogs(data.logs || []);
        }
      } catch (error) {
        console.error("Could not load audit logs:", error);
      } finally {
        setLoading(false);
      }
    }

    void fetchLogs();
  }, []);

  const getActionBadge = (action) => {
    const act = (action || "").toUpperCase();
    if (act.includes("CREATE") || act.includes("ADD")) {
      return <span className="dw-badge-pill dw-badge-green">{act}</span>;
    }
    if (act.includes("UPDATE") || act.includes("EDIT")) {
      return <span className="dw-badge-pill dw-badge-blue">{act}</span>;
    }
    if (act.includes("DELETE") || act.includes("REMOVE")) {
      return <span className="dw-badge-pill dw-badge-red">{act}</span>;
    }
    return <span className="dw-badge-pill dw-badge-purple">{act}</span>;
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      (log.details &&
        log.details.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.action &&
        log.action.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.module &&
        log.module.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesModule =
      moduleFilter === "all" ||
      (log.module && log.module.toLowerCase() === moduleFilter.toLowerCase());

    return matchesSearch && matchesModule;
  });

  const uniqueModules = Array.from(new Set(logs.map((l) => l.module).filter(Boolean)));

  return (
    <DashboardLayout title="Activity Logs" activeNav="audit">
      {/* Header */}
      <div className="dw-page-header-row">
        <div className="dw-page-header-info">
          <h2>Immutable System Activity Trail</h2>
          <p>
            Chronological audit records tracking every asset mutation, will
            revision, authentication event, and vault interaction.
          </p>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="dw-metrics-grid" style={{ marginBottom: "24px" }}>
        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">Total Logged Events</span>
            <FaListUl className="dw-metric-icon blue" />
          </div>
          <div className="dw-metric-value">{logs.length}</div>
        </div>

        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">Active Modules</span>
            <FaFilter className="dw-metric-icon purple" />
          </div>
          <div className="dw-metric-value">{uniqueModules.length}</div>
        </div>

        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">Log Integrity</span>
            <FaShieldAlt className="dw-metric-icon" style={{ color: "#10B981" }} />
          </div>
          <div className="dw-metric-value" style={{ color: "#10B981" }}>
            Append-Only
          </div>
        </div>

        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">Latest Recorded Event</span>
            <FaClock className="dw-metric-icon indigo" />
          </div>
          <div className="dw-metric-value" style={{ fontSize: "14px", fontWeight: 600 }}>
            {logs[0]
              ? new Date(logs[0].createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "No events"}
          </div>
        </div>
      </div>

      {/* Filter and Table Card */}
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
            <div style={{ position: "relative", flex: 1, maxWidth: "320px" }}>
              <input
                type="text"
                placeholder="Search audit trail..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="dw-input-control"
              />
            </div>

            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="dw-select-control"
              style={{ maxWidth: "160px" }}
            >
              <option value="all">All Modules</option>
              {uniqueModules.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <span style={{ fontSize: "12.5px", color: "var(--dw-card-subtext)" }}>
            Showing {filteredLogs.length} of {logs.length} entries
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--dw-card-subtext)" }}>
            Retrieving audit records...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 20px",
              background: "var(--dw-inner-card-bg)",
              borderRadius: "12px",
              border: "1px dashed var(--dw-card-border)",
            }}
          >
            <FaListUl
              size={36}
              color="var(--dw-card-subtext)"
              style={{ opacity: 0.5, marginBottom: "12px" }}
            />
            <h3 style={{ margin: "0 0 6px 0", color: "var(--dw-card-header)" }}>
              No Activity Recorded
            </h3>
            <p style={{ margin: "0", fontSize: "13px", color: "var(--dw-card-subtext)" }}>
              {logs.length === 0
                ? "Actions performed in your estate management system will automatically be indexed here."
                : "No log records match your filter criteria."}
            </p>
          </div>
        ) : (
          <div className="dw-table-wrap">
            <table className="dw-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Module</th>
                  <th>Operation Details</th>
                  <th style={{ textAlign: "right" }}>Integrity</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log._id}>
                    <td style={{ fontSize: "12.5px", whiteSpace: "nowrap" }}>
                      <span style={{ fontWeight: 600 }}>
                        {new Date(log.createdAt).toLocaleDateString()}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "var(--dw-card-subtext)",
                          marginLeft: "6px",
                        }}
                      >
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </span>
                    </td>
                    <td>{getActionBadge(log.action)}</td>
                    <td>
                      <span className="dw-badge-pill dw-badge-neutral">
                        {log.module}
                      </span>
                    </td>
                    <td style={{ color: "var(--dw-card-header)", fontSize: "13px" }}>
                      {log.details}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span className="dw-badge-pill dw-badge-green">
                        <FaShieldAlt size={10} /> Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AuditLogs;
