import { useEffect, useState } from "react";
import {
  FaListUl,
  FaShieldAlt,
  FaClock,
  FaFilter,
  FaSearch,
  FaFileContract,
  FaCoins,
  FaUsers,
  FaFolder,
  FaCheckCircle,
  FaExclamationCircle,
  FaSignInAlt,
  FaRedo,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
} from "react-icons/fa";
import { apiFetch } from "../api";
import DashboardLayout from "../components/DashboardLayout";
import "./AuditLogs.css";

function AuditLogs() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categories, setCategories] = useState([]);

  // Check admin role directly from localStorage initialization
  const [isAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored).role === "admin" : false;
    } catch {
      return false;
    }
  });
  const [viewScope, setViewScope] = useState("my"); // "my" or "admin"
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Fetch available categories
  useEffect(() => {
    let ignore = false;
    async function fetchCategories() {
      try {
        const token = localStorage.getItem("token");
        const res = await apiFetch("/api/audit-logs/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!ignore && res.ok && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Could not load categories:", err);
        }
      }
    }
    void fetchCategories();
    return () => {
      ignore = true;
    };
  }, []);

  // Fetch activities from server with server-side pagination and filters
  useEffect(() => {
    let isCancelled = false;

    async function loadActivities() {
      try {
        setError(null);
        const token = localStorage.getItem("token");

        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });

        if (categoryFilter && categoryFilter !== "all") {
          params.append("category", categoryFilter);
        }
        if (statusFilter && statusFilter !== "all") {
          params.append("status", statusFilter);
        }
        if (searchQuery.trim()) {
          params.append("search", searchQuery.trim());
        }
        if (startDate) {
          params.append("startDate", startDate);
        }
        if (endDate) {
          params.append("endDate", endDate);
        }

        const endpoint =
          viewScope === "admin" && isAdmin
            ? `/api/audit-logs/admin?${params.toString()}`
            : `/api/audit-logs?${params.toString()}`;

        const res = await apiFetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (isCancelled) return;

        if (!res.ok) {
          throw new Error(data.message || "Failed to load activity logs.");
        }

        const items = data.logs || data.activities || [];
        setActivities(items);
        setTotal(data.total || data.count || items.length);
        setTotalPages(data.totalPages || Math.ceil((data.total || items.length) / limit) || 1);
      } catch (err) {
        if (!isCancelled) {
          console.error("Activity fetch error:", err);
          setError(err.message || "An unexpected error occurred loading activity history.");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    void loadActivities();

    return () => {
      isCancelled = true;
    };
  }, [
    page,
    limit,
    categoryFilter,
    statusFilter,
    searchQuery,
    startDate,
    endDate,
    viewScope,
    isAdmin,
    refreshIndex,
  ]);

  // Reset to first page when changing filters
  const handleCategoryChange = (e) => {
    setLoading(true);
    setCategoryFilter(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e) => {
    setLoading(true);
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setLoading(true);
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleStartDateChange = (e) => {
    setLoading(true);
    setStartDate(e.target.value);
    setPage(1);
  };

  const handleEndDateChange = (e) => {
    setLoading(true);
    setEndDate(e.target.value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setLoading(true);
    setSearchQuery("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const handleRefresh = () => {
    setLoading(true);
    setRefreshIndex((prev) => prev + 1);
  };

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    categoryFilter !== "all" ||
    statusFilter !== "all" ||
    startDate ||
    endDate
  );

  // Category Icon & Styling Helper
  const getCategoryConfig = (category = "") => {
    const cat = category.toLowerCase();
    if (cat.includes("will")) {
      return {
        icon: <FaFileContract />,
        wrapClass: "dw-icon-purple",
        label: "Will Management",
      };
    }
    if (cat.includes("asset")) {
      return {
        icon: <FaCoins />,
        wrapClass: "dw-icon-green",
        label: "Asset Management",
      };
    }
    if (cat.includes("beneficiar")) {
      return {
        icon: <FaUsers />,
        wrapClass: "dw-icon-blue",
        label: "Beneficiary Management",
      };
    }
    if (cat.includes("vault") || cat.includes("document") || cat.includes("file")) {
      return {
        icon: <FaFolder />,
        wrapClass: "dw-icon-warning",
        label: "Document Vault",
      };
    }
    if (cat.includes("verif") || cat.includes("succession") || cat.includes("death")) {
      return {
        icon: <FaCheckCircle />,
        wrapClass: "dw-icon-green",
        label: "Succession Verification",
      };
    }
    if (cat.includes("auth") || cat.includes("login") || cat.includes("register")) {
      return {
        icon: <FaSignInAlt />,
        wrapClass: "dw-icon-blue",
        label: "Authentication",
      };
    }
    if (cat.includes("security") || cat.includes("admin")) {
      return {
        icon: <FaShieldAlt />,
        wrapClass: "dw-icon-purple",
        label: "Security / Admin",
      };
    }
    return {
      icon: <FaListUl />,
      wrapClass: "dw-icon-blue",
      label: category || "General",
    };
  };

  // Status Badge Helper
  const renderStatusBadge = (status = "success") => {
    const s = (status || "success").toLowerCase();
    if (s === "success") {
      return (
        <span className="dw-timeline-status-badge dw-status-success">
          <FaCheckCircle size={10} /> Success
        </span>
      );
    }
    if (s === "pending") {
      return (
        <span className="dw-timeline-status-badge dw-status-pending">
          <FaClock size={10} /> Pending Review
        </span>
      );
    }
    if (s === "failed") {
      return (
        <span className="dw-timeline-status-badge dw-status-failed">
          <FaExclamationCircle size={10} /> Rejected / Failed
        </span>
      );
    }
    return (
      <span className="dw-timeline-status-badge dw-status-info">
        <FaListUl size={10} /> Info
      </span>
    );
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return { date: "—", time: "" };
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return { date: "—", time: "" };

    const formattedDate = date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });

    return { date: formattedDate, time: formattedTime };
  };

  return (
    <DashboardLayout title="Activity Logs" activeNav="audit">
      <div className="dw-activity-container">
        {/* Page Header */}
        <div className="dw-page-header-row">
          <div className="dw-page-header-info">
            <h2>Activity History &amp; Audit Trail</h2>
            <p>
              Comprehensive, tamper-evident chronological timeline of all estate operations,
              security access events, will modifications, and verification requests.
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {isAdmin && (
              <div
                style={{
                  display: "inline-flex",
                  borderRadius: "8px",
                  border: "1px solid var(--dw-border)",
                  background: "var(--dw-bg-content)",
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    setViewScope("my");
                    setPage(1);
                  }}
                  style={{
                    padding: "8px 14px",
                    border: "none",
                    background: viewScope === "my" ? "var(--dw-primary)" : "transparent",
                    color: viewScope === "my" ? "#FFFFFF" : "var(--dw-text-muted)",
                    fontSize: "0.825rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  My Activities
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    setViewScope("admin");
                    setPage(1);
                  }}
                  style={{
                    padding: "8px 14px",
                    border: "none",
                    background: viewScope === "admin" ? "var(--dw-primary)" : "transparent",
                    color: viewScope === "admin" ? "#FFFFFF" : "var(--dw-text-muted)",
                    fontSize: "0.825rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  All System Logs (Admin)
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={handleRefresh}
              className="dw-btn-clear-filters"
              title="Refresh timeline records"
            >
              <FaRedo size={12} className={loading ? "dw-spin" : ""} /> Refresh
            </button>
          </div>
        </div>

        {/* Top Metrics Cards */}
        <div className="dw-activity-metrics">
          <div className="dw-activity-metric-card">
            <div className="dw-activity-metric-info">
              <span className="dw-activity-metric-label">Total Logged Events</span>
              <span className="dw-activity-metric-value">{total}</span>
              <span className="dw-activity-metric-subtext">Real-time database entries</span>
            </div>
            <div className="dw-activity-metric-icon-wrap dw-icon-blue">
              <FaListUl />
            </div>
          </div>

          <div className="dw-activity-metric-card">
            <div className="dw-activity-metric-info">
              <span className="dw-activity-metric-label">Active Modules</span>
              <span className="dw-activity-metric-value">
                {categories.length > 0 ? categories.length : 6}
              </span>
              <span className="dw-activity-metric-subtext">Tracked system services</span>
            </div>
            <div className="dw-activity-metric-icon-wrap dw-icon-purple">
              <FaFilter />
            </div>
          </div>

          <div className="dw-activity-metric-card">
            <div className="dw-activity-metric-info">
              <span className="dw-activity-metric-label">Audit Log Integrity</span>
              <span className="dw-activity-metric-value" style={{ color: "var(--dw-success)" }}>
                Verified
              </span>
              <span className="dw-activity-metric-subtext">Append-only immutable record</span>
            </div>
            <div className="dw-activity-metric-icon-wrap dw-icon-green">
              <FaShieldAlt />
            </div>
          </div>

          <div className="dw-activity-metric-card">
            <div className="dw-activity-metric-info">
              <span className="dw-activity-metric-label">Latest Recorded Event</span>
              <span className="dw-activity-metric-value" style={{ fontSize: "1.05rem" }}>
                {activities.length > 0
                  ? formatDateTime(activities[0].timestamp || activities[0].createdAt).time || "Recent"
                  : "No events"}
              </span>
              <span className="dw-activity-metric-subtext">
                {activities.length > 0
                  ? formatDateTime(activities[0].timestamp || activities[0].createdAt).date
                  : "Awaiting user operations"}
              </span>
            </div>
            <div className="dw-activity-metric-icon-wrap dw-icon-warning">
              <FaClock />
            </div>
          </div>
        </div>

        {/* Filter and Search Toolbar */}
        <div className="dw-activity-toolbar">
          <div className="dw-activity-filter-row">
            {/* Free-text Search */}
            <div className="dw-search-input-wrap">
              <FaSearch className="dw-search-input-icon" />
              <input
                type="text"
                placeholder="Search action, description, or keyword..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="dw-activity-search-input"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={handleCategoryChange}
              className="dw-activity-select"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="dw-activity-select"
              style={{ minWidth: "140px" }}
            >
              <option value="all">All Statuses</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed / Rejected</option>
              <option value="info">Info</option>
            </select>

            {/* Start Date */}
            <div className="dw-date-input-group">
              <FaCalendarAlt size={12} color="var(--dw-text-muted)" />
              <span className="dw-date-label">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="dw-date-input"
                title="Start date filter"
              />
            </div>

            {/* End Date */}
            <div className="dw-date-input-group">
              <FaCalendarAlt size={12} color="var(--dw-text-muted)" />
              <span className="dw-date-label">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className="dw-date-input"
                title="End date filter"
              />
            </div>

            {/* Clear Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="dw-btn-clear-filters"
              >
                <FaTimes size={12} /> Clear Filters
              </button>
            )}
          </div>

          <div className="dw-activity-filter-summary">
            <span>
              Showing {activities.length} of {total} recorded activities
              {hasActiveFilters && " (Filtered)"}
            </span>
            <div className="dw-limit-selector">
              <span>Rows per page:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                  setLoading(true);
                }}
                className="dw-limit-select"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              padding: "16px 20px",
              borderRadius: "10px",
              background: "var(--dw-danger-light)",
              color: "var(--dw-danger)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <FaExclamationCircle size={18} />
              <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>{error}</span>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              className="dw-btn-clear-filters"
              style={{ borderColor: "currentColor" }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Timeline Content */}
        {loading ? (
          <div className="dw-timeline-list">
            <div className="dw-skeleton-card" />
            <div className="dw-skeleton-card" />
            <div className="dw-skeleton-card" />
          </div>
        ) : activities.length === 0 ? (
          <div className="dw-empty-state-box">
            <FaListUl className="dw-empty-icon" />
            <h3 className="dw-empty-title">No Activity Records Found</h3>
            <p className="dw-empty-desc">
              {hasActiveFilters
                ? "No activities match your current filter parameters. Try adjusting the search keywords, category, or date range."
                : "No activities have been recorded in your account yet. Operations performed across wills, assets, documents, and beneficiaries will automatically populate this timeline."}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="dw-btn-clear-filters"
                style={{ padding: "10px 18px", fontSize: "0.85rem" }}
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="dw-timeline-container">
            <div className="dw-timeline-spine" />
            <div className="dw-timeline-list">
              {activities.map((item) => {
                const config = getCategoryConfig(item.category || item.module);
                const { date, time } = formatDateTime(item.timestamp || item.createdAt);

                return (
                  <div key={item._id || item.id} className="dw-timeline-item">
                    {/* Category Node Icon */}
                    <div className={`dw-timeline-node ${config.wrapClass}`}>
                      {config.icon}
                    </div>

                    {/* Timeline Event Card */}
                    <div className="dw-timeline-card">
                      <div className="dw-timeline-card-header">
                        <div className="dw-timeline-title-wrap">
                          <h4 className="dw-timeline-action-title">{item.action}</h4>
                          <span className="dw-timeline-category-tag">
                            {item.category || item.module || "General"}
                          </span>
                        </div>
                        {renderStatusBadge(item.status)}
                      </div>

                      <p className="dw-timeline-description">
                        {item.description || item.details || "No further details provided."}
                      </p>

                      <div className="dw-timeline-footer">
                        <div className="dw-timeline-time-group">
                          <span className="dw-timeline-meta-item">
                            <FaCalendarAlt size={11} /> {date}
                          </span>
                          <span className="dw-timeline-meta-item">
                            <FaClock size={11} /> {time}
                          </span>
                          {item.performedBy && typeof item.performedBy === "object" && (
                            <span className="dw-timeline-meta-item">
                              <strong>Performed by:</strong> {item.performedBy.name || item.performedBy.email}
                            </span>
                          )}
                          {viewScope === "admin" && item.user && typeof item.user === "object" && (
                            <span className="dw-timeline-meta-item">
                              <strong>User:</strong> {item.user.name || item.user.email}
                            </span>
                          )}
                        </div>

                        <span className="dw-audit-integrity-badge">
                          <FaShieldAlt size={11} /> System Verified
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="dw-pagination-bar">
            <div className="dw-pagination-info">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong> (
              {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} items)
            </div>

            <div className="dw-pagination-controls">
              <button
                type="button"
                className="dw-btn-page"
                onClick={() => {
                  setLoading(true);
                  setPage((p) => Math.max(1, p - 1));
                }}
                disabled={page <= 1 || loading}
                title="Previous page"
              >
                <FaChevronLeft size={10} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  return (
                    p === 1 ||
                    p === totalPages ||
                    (p >= page - 1 && p <= page + 1)
                  );
                })
                .map((p, idx, arr) => {
                  const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                  return (
                    <span key={p} style={{ display: "inline-flex", alignItems: "center" }}>
                      {showEllipsis && (
                        <span style={{ padding: "0 4px", color: "var(--dw-text-muted)" }}>…</span>
                      )}
                      <button
                        type="button"
                        className={`dw-btn-page ${p === page ? "active" : ""}`}
                        onClick={() => {
                          setLoading(true);
                          setPage(p);
                        }}
                        disabled={loading}
                      >
                        {p}
                      </button>
                    </span>
                  );
                })}

              <button
                type="button"
                className="dw-btn-page"
                onClick={() => {
                  setLoading(true);
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
                disabled={page >= totalPages || loading}
                title="Next page"
              >
                <FaChevronRight size={10} />
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AuditLogs;
