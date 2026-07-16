import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      alert("Registration Failed");
    } finally {
      setLoading(false);
    }
  };

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
            Secure Your
            <br />
            Digital Legacy
          </h1>

          <p
            style={{
              fontSize: "20px",
              lineHeight: "1.8",
              opacity: 0.9,
              maxWidth: "600px",
            }}
          >
            Create your account and start managing
            digital assets, wills, beneficiaries and
            confidential documents through a secure
            inheritance management platform.
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
              🔐 Secure Document Storage
            </div>

            <div>
              📜 Digital Will Creation
            </div>

            <div>
              👥 Beneficiary Management
            </div>

            <div>
              🏦 Asset Portfolio Tracking
            </div>

            <div>
              📄 Professional PDF Reports
            </div>

            <div>
              ✔ Verified Distribution Workflow
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
                Secure
              </h2>

              <small
                style={{
                  opacity: 0.8,
                }}
              >
                Authentication
              </small>
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "32px",
                }}
              >
                Email
              </h2>

              <small
                style={{
                  opacity: 0.8,
                }}
              >
                Verification
              </small>
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "32px",
                }}
              >
                Cloud
              </h2>

              <small
                style={{
                  opacity: 0.8,
                }}
              >
                Ready
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
              🚀 Create Account
            </h1>

            <p
              style={{
                color: "#666",
              }}
            >
              Join the Digital Will Management Platform
            </p>
          </div>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
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
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
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
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              boxSizing: "border-box",
            }}
          />

          <button
            onClick={handleRegister}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "25px",
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
              ? "Creating Account..."
              : "🚀 Create Account"}
          </button>

          <div
            style={{
              textAlign: "center",
              marginTop: "25px",
            }}
          >
            <p>Already have an account?</p>

            <Link
              to="/login"
              style={{
                color: "#001f7f",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Login Here
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

export default Register;