import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

function CreateWill() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    assetName: "",
    assetType: "",
    value: "",
    beneficiaryName: "",
    beneficiaryEmail: "",
    beneficiaryMobile: "",
    instructions: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const response = await apiFetch("/api/will/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          assets: [
            {
              assetName: formData.assetName,
              assetType: formData.assetType,
              value: Number(formData.value),
            },
          ],
          beneficiaries: [
            {
              name: formData.beneficiaryName,
              email: formData.beneficiaryEmail,
              mobile: formData.beneficiaryMobile,
              relation: "Nominee",
              sharePercentage: 100,
            },
          ],
          instructions: formData.instructions,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Digital Will Created Successfully");

        setFormData({
          title: "",
          assetName: "",
          assetType: "",
          value: "",
          beneficiaryName: "",
          beneficiaryEmail: "",
          beneficiaryMobile: "",
          instructions: "",
        });

        navigate("/my-wills");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Error creating will");
    } finally {
      setLoading(false);
    }
  };

  const sectionStyle = {
    background: "#f8fafc",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    border: "1px solid #e5e7eb",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fc",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "35px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}

        <div style={{ marginBottom: "30px" }}>
          <h1
            style={{
              color: "#001f7f",
              marginBottom: "10px",
            }}
          >
            📜 Create Digital Will
          </h1>

          <p
            style={{
              color: "#666",
            }}
          >
            Securely create your digital inheritance plan and assign
            beneficiaries.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Will Information */}

          <div style={sectionStyle}>
            <h3 style={{ color: "#001f7f" }}>📄 Will Information</h3>

            <input
              type="text"
              name="title"
              placeholder="Will Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Asset Information */}

          <div style={sectionStyle}>
            <h3 style={{ color: "#001f7f" }}>🏠 Asset Information</h3>

            <input
              type="text"
              name="assetName"
              placeholder="Asset Name"
              value={formData.assetName}
              onChange={handleChange}
              required
            />

            <br />
            <br />

            <input
              type="text"
              name="assetType"
              placeholder="Asset Type (Property, Bank Account, Investment...)"
              value={formData.assetType}
              onChange={handleChange}
              required
            />

            <br />
            <br />

            <input
              type="number"
              name="value"
              placeholder="Asset Value"
              value={formData.value}
              onChange={handleChange}
              required
            />
          </div>

          {/* Beneficiary Information */}

          <div style={sectionStyle}>
            <h3 style={{ color: "#001f7f" }}>👤 Beneficiary Information</h3>

            <input
              type="text"
              name="beneficiaryName"
              placeholder="Beneficiary Name"
              value={formData.beneficiaryName}
              onChange={handleChange}
              required
            />

            <br />
            <br />

            <input
              type="email"
              name="beneficiaryEmail"
              placeholder="Beneficiary Email"
              value={formData.beneficiaryEmail}
              onChange={handleChange}
              required
            />

            <br />
            <br />

            <input
              type="text"
              name="beneficiaryMobile"
              placeholder="Beneficiary Mobile"
              value={formData.beneficiaryMobile}
              onChange={handleChange}
              required
            />
          </div>

          {/* Instructions */}

          <div style={sectionStyle}>
            <h3 style={{ color: "#001f7f" }}>📝 Final Instructions</h3>

            <textarea
              name="instructions"
              rows="5"
              placeholder="Enter your special instructions..."
              value={formData.instructions}
              onChange={handleChange}
              required
            />
          </div>

          {/* Button */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "linear-gradient(135deg,#001f7f,#2563eb)",
              color: "white",
              border: "none",
              padding: "15px",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {loading ? "Creating Will..." : "📜 Create Digital Will"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateWill;
