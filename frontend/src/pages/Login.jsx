import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShieldAlt, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { apiFetch } from "../api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin(event) {
    event.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both your email address and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard", { replace: true });
      } else {
        setErrorMessage(data.message || "Invalid credentials. Please verify your email and password.");
      }
    } catch (error) {
      console.error("Login network error:", error);
      setErrorMessage("Unable to connect to the authentication server. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

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
          Secure Digital Estate &amp; Testamentary Succession Console
        </p>
      </div>

      {/* Auth Card */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#FFFFFF",
          border: "1px solid var(--dw-border)",
          borderRadius: "8px",
          boxShadow: "var(--dw-card-shadow)",
          padding: "32px 28px",
        }}
      >
        <div style={{ marginBottom: "22px" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "4px" }}>
            Sign In to Your Account
          </h2>
          <p style={{ fontSize: "0.85rem", margin: 0 }}>
            Enter your credentials to access your estate inventory.
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

        <form onSubmit={handleLogin}>
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
              Email Address
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

          <div style={{ marginBottom: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "var(--dw-text-main)",
                  margin: 0,
                }}
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                style={{ fontSize: "0.8rem", color: "var(--dw-primary)" }}
              >
                Forgot password?
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter account password"
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
            <FaLock size={11} /> {loading ? "Authenticating..." : "Sign In"}
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
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            style={{ fontWeight: 600, color: "var(--dw-primary)" }}
          >
            Create an account
          </Link>
        </div>
      </div>

      {/* Compliance footer note */}
      <div
        style={{
          marginTop: "24px",
          fontSize: "0.78rem",
          color: "var(--dw-text-muted)",
          textAlign: "center",
        }}
      >
        Protected by 256-bit encryption &bull; JWT Authenticated &bull; HIPAA &amp; SOC-2 aligned
      </div>
    </div>
  );
}

export default Login;
