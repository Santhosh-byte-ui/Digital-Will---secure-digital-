import { Link } from "react-router-dom";
import Footer from "../components/Footer";

function Home() {
  return (
    <div
      style={{
        background: "#f4f7fc",
        minHeight: "100vh",
      }}
    >
      {/* Hero Section */}

      <section
        style={{
          background:
            "linear-gradient(135deg,#0f172a,#1e293b,#334155)",
          color: "white",
          textAlign: "center",
          padding: "120px 20px",
        }}
      >
        <h1
          style={{
            fontSize: "58px",
            marginBottom: "20px",
            fontWeight: "700",
            lineHeight: "1.2",
          }}
        >
          Digital Legacy &
          <br />
          Inheritance Management Platform
        </h1>

        <p
          style={{
            maxWidth: "900px",
            margin: "auto",
            fontSize: "20px",
            lineHeight: "1.8",
            opacity: 0.9,
          }}
        >
          A secure enterprise platform designed to
          manage digital assets, legal documents,
          beneficiaries and inheritance distribution
          through protected verification workflows.
        </p>

        <div
          style={{
            marginTop: "40px",
          }}
        >
          <Link to="/register">
            <button
              style={{
                background: "white",
                color: "#0f172a",
                border: "none",
                padding: "15px 30px",
                borderRadius: "12px",
                marginRight: "15px",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              🚀 Get Started
            </button>
          </Link>

          <Link to="/login">
            <button
              style={{
                background: "transparent",
                color: "white",
                border: "2px solid white",
                padding: "15px 30px",
                borderRadius: "12px",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              🔑 Login
            </button>
          </Link>
        </div>
      </section>

      {/* Stats */}

      <section
        style={{
          padding: "60px 30px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "25px",
          }}
        >
          <div className="card">
            <h2>🔐</h2>
            <h3>Enterprise Security</h3>
            <p>Protected Authentication</p>
          </div>

          <div className="card">
            <h2>📜</h2>
            <h3>Will Management</h3>
            <p>Digital Inheritance Planning</p>
          </div>

          <div className="card">
            <h2>👥</h2>
            <h3>Beneficiary Portal</h3>
            <p>Secure Nominee Access</p>
          </div>

          <div className="card">
            <h2>☁️</h2>
            <h3>Document Vault</h3>
            <p>24/7 Secure Storage</p>
          </div>
        </div>
      </section>

      {/* Features */}

      <section
        style={{
          padding: "20px 30px 70px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#0f172a",
            marginBottom: "40px",
            fontSize: "40px",
          }}
        >
          Platform Features
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(280px,1fr))",
            gap: "25px",
          }}
        >
          <div className="card">
            <h3>🔐 Digital Vault</h3>
            <p>
              Securely store legal documents,
              certificates and confidential files.
            </p>
          </div>

          <div className="card">
            <h3>📜 Digital Will Creation</h3>
            <p>
              Create and manage structured digital
              wills with beneficiary allocation.
            </p>
          </div>

          <div className="card">
            <h3>👥 Beneficiary Management</h3>
            <p>
              Manage nominees and inheritance
              distribution efficiently.
            </p>
          </div>

          <div className="card">
            <h3>📧 Notifications</h3>
            <p>
              Receive security alerts and system
              updates instantly.
            </p>
          </div>

          <div className="card">
            <h3>🛡 Verification Process</h3>
            <p>
              Information is released only after
              successful verification.
            </p>
          </div>

          <div className="card">
            <h3>📄 PDF Generation</h3>
            <p>
              Download professional PDF copies of
              your digital wills.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}

      <section
        style={{
          padding: "80px 30px",
          background: "white",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#0f172a",
            marginBottom: "50px",
            fontSize: "38px",
          }}
        >
          How It Works
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "25px",
          }}
        >
          <div className="card">
            <h3>1️⃣ Create Account</h3>
            <p>
              Register and access your secure
              inheritance workspace.
            </p>
          </div>

          <div className="card">
            <h3>2️⃣ Register Assets</h3>
            <p>
              Add properties, bank accounts and
              investment details.
            </p>
          </div>

          <div className="card">
            <h3>3️⃣ Create Digital Will</h3>
            <p>
              Define beneficiaries and inheritance
              instructions.
            </p>
          </div>

          <div className="card">
            <h3>4️⃣ Verified Distribution</h3>
            <p>
              Assets are released through secure
              verification procedures.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;