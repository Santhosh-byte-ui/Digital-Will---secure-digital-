import { useEffect, useState } from "react";
import {
  FaFolder,
  FaFilePdf,
  FaKey,
  FaCloudUploadAlt,
  FaEye,
  FaDownload,
  FaTrash,
  FaShieldAlt,
  FaCloud,
  FaLock,
} from "react-icons/fa";
import { apiFetch } from "../api";
import DashboardLayout from "../components/DashboardLayout";

function Vault() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function fetchFiles() {
      try {
        const token = localStorage.getItem("token");
        const response = await apiFetch("/api/vault", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setFiles(data.files || []);
        }
      } catch (error) {
        console.error("Could not load vault files:", error);
      } finally {
        setLoading(false);
      }
    }

    void fetchFiles();
  }, [refreshKey]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a document to upload");
      return;
    }

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await apiFetch("/api/vault/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setSelectedFile(null);
        setUploadModalOpen(false);
        setRefreshKey((k) => k + 1);
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Ensure server and storage connectivity.");
    } finally {
      setUploading(false);
    }
  };

  const viewFile = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await apiFetch(`/api/vault/view/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && data.url) {
        window.open(data.url, "_blank");
      } else {
        alert(data.message || "Unable to open file");
      }
    } catch (error) {
      console.error("File view error:", error);
      alert("Unable to open file.");
    }
  };

  const deleteFile = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from your vault?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await apiFetch(`/api/vault/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setRefreshKey((k) => k + 1);
      } else {
        alert(data.message || "Could not delete document");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <DashboardLayout title="Secure Document Vault" activeNav="vault">
      {/* Header Row */}
      <div className="dw-page-header-row">
        <div className="dw-page-header-info">
          <h2>Encrypted Cloud Storage Vault</h2>
          <p>
            Securely deposit legal deeds, property titles, insurance policies,
            and cryptographic keys on AWS S3.
          </p>
        </div>
        <div>
          <button
            type="button"
            className="dw-btn dw-btn-primary"
            onClick={() => setUploadModalOpen(true)}
          >
            <FaCloudUploadAlt size={14} /> Upload New Document
          </button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="dw-metrics-grid" style={{ marginBottom: "24px" }}>
        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">Stored Documents</span>
            <FaFolder className="dw-metric-icon blue" />
          </div>
          <div className="dw-metric-value">{files.length}</div>
        </div>

        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">Cloud Infrastructure</span>
            <FaCloud className="dw-metric-icon indigo" />
          </div>
          <div className="dw-metric-value" style={{ color: "#3B82F6" }}>
            AWS S3
          </div>
        </div>

        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">Encryption Standard</span>
            <FaLock className="dw-metric-icon purple" />
          </div>
          <div className="dw-metric-value">AES-256</div>
        </div>

        <div className="dw-metric-card">
          <div className="dw-metric-header">
            <span className="dw-metric-title">Access Policy</span>
            <FaShieldAlt className="dw-metric-icon" style={{ color: "#10B981" }} />
          </div>
          <div className="dw-metric-value" style={{ color: "#10B981" }}>
            Time-Signed
          </div>
        </div>
      </div>

      {/* Content Card */}
      <div className="dw-content-card">
        <div className="dw-content-card-header">
          <h3>
            <FaFolder size={15} color="#2563EB" /> Repository Files ({files.length})
          </h3>
          <span style={{ fontSize: "12px", color: "var(--dw-card-subtext)" }}>
            Protected by pre-signed short-lived token authentication
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--dw-card-subtext)" }}>
            Accessing encrypted vault...
          </div>
        ) : files.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "48px 20px",
              background: "var(--dw-inner-card-bg)",
              borderRadius: "12px",
              border: "1px dashed var(--dw-card-border)",
            }}
          >
            <FaFolder size={36} color="var(--dw-card-subtext)" style={{ opacity: 0.5, marginBottom: "12px" }} />
            <h3 style={{ margin: "0 0 6px 0", color: "var(--dw-card-header)" }}>No Documents in Vault</h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "var(--dw-card-subtext)" }}>
              Upload estate planning documents, property deeds, or digital key backups to preserve them securely.
            </p>
            <button
              type="button"
              className="dw-btn dw-btn-primary"
              onClick={() => setUploadModalOpen(true)}
            >
              <FaCloudUploadAlt size={14} /> Upload First Document
            </button>
          </div>
        ) : (
          <div className="dw-table-wrap">
            <table className="dw-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Type</th>
                  <th>File Size</th>
                  <th>Uploaded Date</th>
                  <th>Security Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => {
                  const isPdf =
                    file.fileType?.includes("pdf") ||
                    file.fileName?.toLowerCase().endsWith(".pdf");
                  return (
                    <tr key={file._id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "8px",
                              background: isPdf
                                ? "rgba(239, 68, 68, 0.12)"
                                : "rgba(16, 185, 129, 0.12)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: isPdf ? "#EF4444" : "#10B981",
                            }}
                          >
                            {isPdf ? <FaFilePdf size={16} /> : <FaKey size={15} />}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>{file.fileName}</div>
                            <div style={{ fontSize: "11px", color: "var(--dw-card-subtext)" }}>
                              ID: {file._id.slice(-6).toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: "12px", color: "var(--dw-card-subtext)" }}>
                          {file.fileType || "application/octet-stream"}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {formatFileSize(file.fileSize)}
                      </td>
                      <td style={{ fontSize: "12.5px", color: "var(--dw-card-subtext)" }}>
                        {new Date(file.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <span className="dw-badge-pill dw-badge-green">
                          <FaShieldAlt size={10} /> Encrypted
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          <button
                            type="button"
                            className="dw-btn dw-btn-outline dw-btn-sm"
                            title="View Document"
                            onClick={() => viewFile(file._id)}
                          >
                            <FaEye size={12} /> View
                          </button>
                          <button
                            type="button"
                            className="dw-btn dw-btn-outline dw-btn-sm"
                            title="Download Document"
                            onClick={() => viewFile(file._id)}
                          >
                            <FaDownload size={12} /> Download
                          </button>
                          <button
                            type="button"
                            className="dw-btn dw-btn-danger dw-btn-sm"
                            title="Delete Document"
                            onClick={() => deleteFile(file._id, file.fileName)}
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Document Modal */}
      {uploadModalOpen && (
        <div
          className="dw-modal-backdrop"
          onClick={() => !uploading && setUploadModalOpen(false)}
        >
          <div className="dw-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="dw-modal-header">
              <h3>Upload Document to Vault</h3>
              <button
                type="button"
                className="dw-modal-close"
                disabled={uploading}
                onClick={() => setUploadModalOpen(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleUpload}>
              <div className="dw-modal-body">
                <div
                  style={{
                    border: "2px dashed var(--dw-card-border)",
                    borderRadius: "12px",
                    padding: "30px 20px",
                    textAlign: "center",
                    background: "var(--dw-inner-card-bg)",
                    cursor: "pointer",
                    marginBottom: "16px",
                  }}
                  onClick={() => document.getElementById("vaultFileInput")?.click()}
                >
                  <FaCloudUploadAlt
                    size={42}
                    color="#2563EB"
                    style={{ marginBottom: "10px" }}
                  />
                  <div style={{ fontWeight: 600, color: "var(--dw-card-header)" }}>
                    {selectedFile ? selectedFile.name : "Choose a file to deposit"}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--dw-card-subtext)",
                      marginTop: "6px",
                    }}
                  >
                    {selectedFile
                      ? `Size: ${formatFileSize(selectedFile.size)}`
                      : "PDF, DOCX, TXT, PNG, JPG, or GPG keys (Max 15MB)"}
                  </div>
                  <input
                    id="vaultFileInput"
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                  />
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--dw-card-subtext)",
                    lineHeight: "1.6",
                    background: "var(--dw-inner-card-bg)",
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <FaLock size={11} style={{ marginRight: "6px", color: "#10B981" }} />
                  Files are transferred directly via secure TLS and encrypted with S3
                  server-side encryption (SSE-S3). Access is restricted strictly to
                  your authenticated account.
                </div>
              </div>
              <div className="dw-modal-footer">
                <button
                  type="button"
                  className="dw-btn dw-btn-outline"
                  disabled={uploading}
                  onClick={() => setUploadModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="dw-btn dw-btn-primary"
                  disabled={!selectedFile || uploading}
                >
                  {uploading ? "Encrypting & Uploading..." : "Deposit File"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Vault;
