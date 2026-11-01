import { useState } from "react";
import { Link } from "react-router-dom";
import { FaShieldAlt, FaArrowLeft, FaCheck } from "react-icons/fa";
import { apiFetch } from "../api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const forgotPassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setMessage("");

    if (!email) {
      setErrorMessage("Please provide your registered account email.");
      return;
    }

    try {
      setLoading(true);
      const response = await apiFetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Password reset instructions have been dispatched.");
      } else {
        setErrorMessage(data.message || "Failed to process recovery request.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Unable to connect to recovery server.");
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
            Account Password Recovery
          </h2>
          <p style={{ fontSize: "0.85rem", margin: 0 }}>
            Enter your email to receive a secure, one-time recovery token.
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

        {message && (
          <div
            style={{
              padding: "10px 14px",
              backgroundColor: "var(--dw-success-light)",
              border: "1px solid rgba(22, 132, 91, 0.25)",
              color: "var(--dw-success)",
              borderRadius: "6px",
              fontSize: "0.85rem",
              marginBottom: "18px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FaCheck size={12} /> {message}
          </div>
        )}

        <form onSubmit={forgotPassword}>
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
              Registered Email Address
            </label>
            <input
              type="email"
              required
              autoFocus
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", padding: "10px" }}
          >
            {loading ? "Transmitting..." : "Send Reset Instructions"}
          </button>
        </form>

        <div
          style={{
            marginTop: "22px",
            paddingTop: "18px",
            borderTop: "1px solid var(--dw-border)",
            textAlign: "center",
          }}
        >
          <Link
            to="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.85rem",
              fontWeight: 500,
              color: "var(--dw-primary)",
            }}
          >
            <FaArrowLeft size={10} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
