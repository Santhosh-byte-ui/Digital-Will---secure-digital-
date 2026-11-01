import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../api";

function Vault() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // ==========================
  // Get Files
  // ==========================
  const fetchFiles = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await apiFetch("/api/vault", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setFiles(data.files);
      } else {
        console.error("Could not load vault files.", response.status);
      }
    } catch (error) {
      console.error("Could not load vault files.", error.name);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchFiles);
  }, [fetchFiles]);

  // ==========================
  // Upload File
  // ==========================
  const uploadFile = async () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await apiFetch("/api/vault/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      alert(data.message);

      setSelectedFile(null);

      fetchFiles();
    } catch (error) {
      console.log(error);
      alert("Upload Failed");
    }
  };

  // ==========================
  // Secure View / Download
  // ==========================
  const viewFile = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await apiFetch(`/api/vault/view/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        window.open(data.url, "_blank");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Unable to open file");
    }
  };

  // ==========================
  // Delete File
  // ==========================
  const deleteFile = async (id) => {
    const confirmDelete = window.confirm("Delete this document?");

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await apiFetch(`/api/vault/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      alert(data.message);

      fetchFiles();
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
        <h1>🔐 Digital Vault</h1>

        <p>
          Store important legal documents, certificates and inheritance records
          securely using AWS Cloud Storage.
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
          <h3>📄 Documents</h3>
          <h1>{files.length}</h1>
        </div>

        <div className="card">
          <h3>🔒 Security</h3>
          <h1>100%</h1>
        </div>

        <div className="card">
          <h3>☁ AWS S3</h3>
          <h1>Active</h1>
        </div>
      </div>

      {/* Upload */}
      <div
        className="card"
        style={{
          marginBottom: "30px",
        }}
      >
        <h2>📤 Upload Document</h2>

        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />

        <br />
        <br />

        <button
          onClick={uploadFile}
          style={{
            background: "#001f7f",
            color: "white",
            border: "none",
            padding: "12px 22px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Upload Securely
        </button>
      </div>

      <h2
        style={{
          color: "#001f7f",
          marginBottom: "20px",
        }}
      >
        Uploaded Documents
      </h2>

      {files.length === 0 ? (
        <div className="card">
          <h2>📭 No Documents Found</h2>
          <p>Upload your first secure document.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
            gap: "20px",
          }}
        >
          {files.map((file) => (
            <div key={file._id} className="card">
              <h3>📄 {file.fileName}</h3>

              <p>
                <strong>Type:</strong> {file.fileType}
              </p>

              <p>
                <strong>Size:</strong>{" "}
                {file.fileSize ? `${file.fileSize} Bytes` : "N/A"}
              </p>

              <p>
                <strong>Uploaded:</strong>{" "}
                {new Date(file.createdAt).toLocaleDateString()}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "15px",
                }}
              >
                {/* View */}
                <button
                  onClick={() => viewFile(file._id)}
                  style={{
                    flex: 1,
                    background: "#16a34a",
                    color: "white",
                    border: "none",
                    padding: "10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  👁 View
                </button>

                {/* Download */}
                <button
                  onClick={() => viewFile(file._id)}
                  style={{
                    flex: 1,
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    padding: "10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  ⬇ Download
                </button>

                {/* Delete */}
                <button
                  onClick={() => deleteFile(file._id)}
                  style={{
                    flex: 1,
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    padding: "10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Vault;
