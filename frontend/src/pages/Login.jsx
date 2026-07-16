import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      alert("Please fill all fields!");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        alert("Login Successful!");

        navigate("/dashboard");
      } else {
        alert(data.message || "Login Failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#0f172a,#1e293b,#334155)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          alignItems: "center",
        }}
      >
        {/* LEFT SIDE */}

        <div
          style={{
            color: "white",
          }}
        >
          <h1
            style={{
              fontSize: "52px",
              marginBottom: "20px",
              fontWeight: "700",
              lineHeight: "1.2",
              letterSpacing: "-1px",
            }}
          >
            Digital Legacy &
            <br />
            Inheritance Platform
          </h1>

          <p
            style={{
              fontSize: "20px",
              lineHeight: "1.8",
              opacity: 0.9,
              maxWidth: "600px",
            }}
          >
            Securely manage digital assets,
            legal documents, beneficiary records
            and testament information through an
            enterprise-grade inheritance
            management platform.
          </p>

          <div
            style={{
              marginTop: "40px",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              fontSize: "18px",
              fontWeight: "500",
            }}
          >
            <div>
              🔐 Enterprise-Grade Document Security
            </div>

            <div>
              📜 Digital Will Creation & Management
            </div>

            <div>
              👥 Beneficiary & Nominee Administration
            </div>

            <div>
              🏦 Asset Portfolio Management
            </div>

            <div>
              📄 Secure PDF Will Generation
            </div>

            <div>
              ✔ Verified Inheritance Distribution
            </div>
          </div>

          <div
            style={{
              marginTop: "45px",
              display: "flex",
              gap: "40px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "32px",
                }}
              >
                100%
              </h2>

              <small
                style={{
                  opacity: 0.8,
                }}
              >
                Secure Storage
              </small>
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "32px",
                }}
              >
                24/7
              </h2>

              <small
                style={{
                  opacity: 0.8,
                }}
              >
                System Availability
              </small>
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "32px",
                }}
              >
                PDF
              </h2>

              <small
                style={{
                  opacity: 0.8,
                }}
              >
                Legal Documentation
              </small>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: "25px",
            padding: "45px",
            boxShadow:
              "0 25px 50px rgba(0,0,0,0.3)",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "30px",
            }}
          >
            <h1
              style={{
                color: "#001f7f",
                marginBottom: "10px",
              }}
            >
              🔑 Login
            </h1>

            <p
              style={{
                color: "#666",
              }}
            >
              Access your Digital Will account
            </p>
          </div>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              marginBottom: "20px",
              boxSizing: "border-box",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              boxSizing: "border-box",
            }}
          />

          <div
            style={{
              textAlign: "right",
              marginTop: "12px",
              marginBottom: "25px",
            }}
          >
            <Link
              to="/forgot-password"
              style={{
                color: "#001f7f",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Forgot Password?
            </Link>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%",
              background:
                "linear-gradient(135deg,#001f7f,#2563eb)",
              color: "white",
              border: "none",
              padding: "15px",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {loading
              ? "Logging in..."
              : "🔑 Login"}
          </button>

          <div
            style={{
              textAlign: "center",
              marginTop: "25px",
            }}
          >
            <p>Don't have an account?</p>

            <Link
              to="/register"
              style={{
                color: "#001f7f",
                fontWeight: "bold",
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
        </div>
      </div>
    </div>
  );
}

export default Login;