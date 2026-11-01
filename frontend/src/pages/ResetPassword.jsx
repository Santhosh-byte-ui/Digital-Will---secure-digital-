import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaShieldAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { apiFetch } from "../api";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const resetPassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!password || password.length < 6) {
      setErrorMessage("Please enter a new password with at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const response = await apiFetch(`/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        setErrorMessage(data.message || "Password reset token is invalid or expired.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong. Please request a new reset link.");
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
            }}
          >
            DigitalWill
          </span>
        </Link>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "var(--dw-bg-content)",
          border: "1px solid var(--dw-border)",
          borderRadius: "8px",
          boxShadow: "var(--dw-card-shadow)",
          padding: "32px 28px",
        }}
      >
        <div style={{ marginBottom: "22px" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "4px" }}>
            Set New Password
          </h2>
          <p style={{ fontSize: "0.85rem", margin: 0 }}>
            Enter a secure new master passphrase for your estate account.
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
            }}
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={resetPassword}>
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--dw-text-main)",
                marginBottom: "6px",
              }}
            >
              New Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter at least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", padding: "10px" }}
          >
            {loading ? "Updating Password..." : "Update Master Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
