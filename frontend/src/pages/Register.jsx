import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShieldAlt, FaEye, FaEyeSlash, FaCheck } from "react-icons/fa";
import { apiFetch } from "../api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.name || !formData.email || !formData.password) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters in length.");
      return;
    }

    try {
      setLoading(true);

      const response = await apiFetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        setErrorMessage(data.message || "Registration could not be completed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("Unable to connect to the authentication server. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--dw-bg-primary)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
      }}
    >
      {/* Brand Header */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              backgroundColor: "var(--dw-primary)",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaShieldAlt size={18} />
          </div>
          <span
            style={{
              fontFamily: "var(--dw-font-heading)",
              fontSize: "1.35rem",
              fontWeight: 700,
              color: "var(--dw-text-main)",
              letterSpacing: "-0.02em",
            }}
          >
            DigitalWill
          </span>
        </Link>
        <p style={{ marginTop: "6px", fontSize: "0.88rem" }}>
          Establish Your Digital Estate &amp; Testamentary Succession Account
        </p>
      </div>

      {/* Auth Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          backgroundColor: "var(--dw-bg-content)",
          border: "1px solid var(--dw-border)",
          borderRadius: "8px",
          boxShadow: "var(--dw-card-shadow)",
          padding: "32px 28px",
        }}
      >
        <div style={{ marginBottom: "22px" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "4px" }}>
            Create Your Account
          </h2>
          <p style={{ fontSize: "0.85rem", margin: 0 }}>
            Start drafting digital wills and securing estate assets.
          </p>
        </div>

        {errorMessage && (
          <div
            style={{
              padding: "10px 14px",
              backgroundColor: "var(--dw-danger-light)",
              border: "1px solid rgba(198, 71, 71, 0.25)",
              color: "var(--dw-danger)",
              borderRadius: "6px",
              fontSize: "0.85rem",
              marginBottom: "18px",
              lineHeight: "1.4",
            }}
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            style={{
              padding: "10px 14px",
              backgroundColor: "var(--dw-success-light)",
              border: "1px solid rgba(22, 132, 91, 0.25)",
              color: "var(--dw-success)",
              borderRadius: "6px",
              fontSize: "0.85rem",
              marginBottom: "18px",
              lineHeight: "1.4",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FaCheck size={12} /> {successMessage}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--dw-text-main)",
                marginBottom: "6px",
              }}
            >
              Full Legal Name
            </label>
            <input
              type="text"
              name="name"
              required
              autoFocus
              placeholder="e.g. Johnathan Connor"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--dw-text-main)",
                marginBottom: "6px",
              }}
            >
              Primary Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--dw-text-main)",
                marginBottom: "6px",
              }}
            >
              Master Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Choose a strong passphrase"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                style={{ paddingRight: "38px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--dw-secondary)",
                  cursor: "pointer",
                  padding: "4px",
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>
            <span style={{ fontSize: "0.75rem", color: "var(--dw-text-muted)", marginTop: "4px", display: "block" }}>
              Minimum 6 characters. Recommended: mix of letters, numbers, and symbols.
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", padding: "10px" }}
          >
            {loading ? "Registering Account..." : "Create Account"}
          </button>
        </form>

        <div
          style={{
            marginTop: "22px",
            paddingTop: "18px",
            borderTop: "1px solid var(--dw-border)",
            textAlign: "center",
            fontSize: "0.85rem",
            color: "var(--dw-text-muted)",
          }}
        >
          Already registered?{" "}
          <Link
            to="/login"
            style={{ fontWeight: 600, color: "var(--dw-primary)" }}
          >
            Sign in here
          </Link>
        </div>
      </div>

      <div
        style={{
          marginTop: "24px",
          fontSize: "0.78rem",
          color: "var(--dw-text-muted)",
          textAlign: "center",
        }}
      >
        By registering, you agree to the estate protocol terms and private cloud data encryption policies.
      </div>
    </div>
  );
}

export default Register;
