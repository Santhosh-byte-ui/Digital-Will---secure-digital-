import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaShieldAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { apiFetch } from "../api";

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "error"
  const [message, setMessage] = useState("Confirming your digital signature token...");

  useEffect(() => {
    async function verifyEmail() {
      try {
        const response = await apiFetch(`/api/auth/verify-email/${token}`);
        const data = await response.json();
        if (response.ok) {
          setStatus("success");
          setMessage(data.message || "Email address confirmed successfully.");
          setTimeout(() => navigate("/login", { replace: true }), 2000);
        } else {
          setStatus("error");
          setMessage(data.message || "Verification link is invalid or expired.");
        }
      } catch (error) {
        console.error("Email verification request failed:", error);
        setStatus("error");
        setMessage("Unable to reach verification service.");
      }
    }

    void verifyEmail();
  }, [navigate, token]);

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
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "var(--dw-bg-content)",
          border: "1px solid var(--dw-border)",
          borderRadius: "8px",
          boxShadow: "var(--dw-card-shadow)",
          padding: "36px 28px",
          textAlign: "center",
        }}
      >
        <div style={{ marginBottom: "16px" }}>
          {status === "verifying" && (
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "var(--dw-primary-light)",
                color: "var(--dw-primary)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaShieldAlt size={22} />
            </div>
          )}
          {status === "success" && (
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "var(--dw-success-light)",
                color: "var(--dw-success)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaCheckCircle size={24} />
            </div>
          )}
          {status === "error" && (
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "var(--dw-danger-light)",
                color: "var(--dw-danger)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaTimesCircle size={24} />
            </div>
          )}
        </div>

        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "8px" }}>
          {status === "verifying"
            ? "Verifying Email..."
            : status === "success"
              ? "Verification Complete"
              : "Verification Issue"}
        </h2>

        <p style={{ fontSize: "0.88rem", marginBottom: "20px" }}>{message}</p>

        <Link to="/login" className="btn btn-primary btn-sm">
          Return to Sign In
        </Link>
      </div>
    </div>
  );
}

export default VerifyEmail;
