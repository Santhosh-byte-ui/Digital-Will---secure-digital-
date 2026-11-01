import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { apiFetch } from "../api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    if (!email || !password) {
      alert("Please fill all fields!");
      return;
    }

    try {
      setLoading(true);

      const response = await apiFetch("/api/auth/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard", { replace: true });
      } else {
        alert(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.log(error);

      const isOfflineOrNetworkError =
        error instanceof TypeError &&
        (error.message.includes("fetch") ||
          error.message.includes("NetworkError") ||
          error.message.includes("Failed"));

      alert(
        isOfflineOrNetworkError
          ? "Unable to connect to the backend server. Please verify the backend is running on http://localhost:5000."
          : "Server Error: Unable to complete login. Please check backend logs.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",

        background: "linear-gradient(135deg,#020617,#0f172a,#1e3a8a)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        padding: "20px",

        boxSizing: "border-box",

        overflowX: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",

          maxWidth: "1200px",

          display: "grid",

          gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",

          gap: "40px",

          alignItems: "center",
        }}
      >
        {/* LEFT SECTION */}

        <motion.div
          initial={{
            opacity: 0,
            x: -80,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          style={{
            color: "white",

            padding: "20px",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(32px,5vw,55px)",

              fontWeight: "800",

              lineHeight: "1.2",
            }}
          >
            Digital Legacy &
            <br />
            Inheritance Platform
          </h1>

          <p
            style={{
              fontSize: "20px",

              lineHeight: "1.7",

              opacity: "0.85",
            }}
          >
            Securely manage digital assets, legal documents, beneficiary records
            and testament information through an enterprise-grade inheritance
            management platform.
          </p>

          <div
            style={{
              marginTop: "35px",

              display: "flex",

              flexDirection: "column",

              gap: "18px",

              fontSize: "18px",
            }}
          >
            <div>🔐 Enterprise-Grade Document Security</div>

            <div>📜 Digital Will Creation & Management</div>

            <div>👥 Beneficiary & Nominee Administration</div>

            <div>🏦 Asset Portfolio Management</div>

            <div>📄 Secure PDF Will Generation</div>

            <div>✔ Verified Inheritance Distribution</div>
          </div>
        </motion.div>

        {/* RIGHT LOGIN CARD */}

        <motion.div
          initial={{
            opacity: 0,
            x: 80,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          style={{
            background: "rgba(255,255,255,0.96)",

            borderRadius: "25px",

            padding: "40px",

            boxShadow: "0 25px 50px rgba(0,0,0,0.3)",

            width: "100%",

            boxSizing: "border-box",
          }}
        >
          {/* LOGIN CONTENT */}

          <div
            style={{
              textAlign: "center",

              marginBottom: "30px",
            }}
          >
            <h1
              style={{
                color: "#001f7f",

                fontSize: "36px",

                marginBottom: "10px",
              }}
            >
              🔑 Login
            </h1>

            <p
              style={{
                color: "#666",

                fontSize: "16px",
              }}
            >
              Access your Digital Will account
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <motion.input
              whileFocus={{
                scale: 1.02,
              }}
              type="email"
              aria-label="Email Address"
              autoComplete="email"
              required
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",

                padding: "15px",

                borderRadius: "12px",

                border: "1px solid #ddd",

                marginBottom: "20px",

                fontSize: "15px",

                boxSizing: "border-box",
              }}
            />

            <motion.input
              whileFocus={{
                scale: 1.02,
              }}
              type="password"
              aria-label="Password"
              autoComplete="current-password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",

                padding: "15px",

                borderRadius: "12px",

                border: "1px solid #ddd",

                fontSize: "15px",

                boxSizing: "border-box",
              }}
            />

            <div
              style={{
                textAlign: "right",

                marginTop: "15px",

                marginBottom: "25px",
              }}
            >
              <Link
                to="/forgot-password"
                style={{
                  color: "#001f7f",

                  fontWeight: "700",

                  textDecoration: "none",
                }}
              >
                Forgot Password?
              </Link>
            </div>

            <motion.button
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              type="submit"
              disabled={loading}
              style={{
                width: "100%",

                padding: "15px",

                borderRadius: "12px",

                border: "none",

                background: "linear-gradient(135deg,#001f7f,#2563eb)",

                color: "white",

                fontSize: "17px",

                fontWeight: "700",

                cursor: "pointer",
              }}
            >
              {loading ? "Logging in..." : "🔑 Login"}
            </motion.button>
          </form>

          <div
            style={{
              textAlign: "center",

              marginTop: "25px",
            }}
          >
            <p
              style={{
                color: "#555",
              }}
            >
              Don't have an account?
            </p>

            <Link
              to="/register"
              style={{
                color: "#001f7f",

                fontWeight: "700",

                textDecoration: "none",
              }}
            >
              Create Account
            </Link>
          </div>

          <div
            style={{
              textAlign: "center",

              marginTop: "20px",
            }}
          >
            <Link
              to="/"
              style={{
                color: "#666",

                textDecoration: "none",
              }}
            >
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
