function Footer() {
  return (
    <footer
      style={{
        background: "#0f172a",
        color: "white",
        marginTop: "80px",
        padding: "60px 30px 30px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "40px",
        }}
      >
        {/* Company */}

        <div>
          <h2
            style={{
              marginBottom: "15px",
            }}
          >
            🔐 Digital Legacy
          </h2>

          <p
            style={{
              color: "#cbd5e1",
              lineHeight: "1.8",
            }}
          >
            A secure inheritance management
            platform for managing digital assets,
            wills, beneficiaries and confidential
            documents.
          </p>
        </div>

        {/* Quick Links */}

        <div>
          <h3
            style={{
              marginBottom: "15px",
            }}
          >
            Quick Links
          </h3>

          <p>Dashboard</p>
          <p>Create Will</p>
          <p>My Wills</p>
          <p>Digital Vault</p>
        </div>

        {/* Features */}

        <div>
          <h3
            style={{
              marginBottom: "15px",
            }}
          >
            Platform Features
          </h3>

          <p>Digital Will Creation</p>
          <p>Asset Management</p>
          <p>Beneficiary Portal</p>
          <p>Death Verification</p>
          <p>PDF Generation</p>
        </div>

        {/* Security */}

        <div>
          <h3
            style={{
              marginBottom: "15px",
            }}
          >
            Security
          </h3>

          <p>JWT Authentication</p>
          <p>Protected Access</p>
          <p>Document Security</p>
          <p>Role-Based Authorization</p>
        </div>
      </div>

      <hr
        style={{
          margin: "40px 0 25px",
          borderColor: "rgba(255,255,255,0.1)",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "15px",
          maxWidth: "1200px",
          margin: "auto",
          color: "#94a3b8",
          fontSize: "14px",
        }}
      >
        <span>
          © 2026 Digital Legacy Platform
        </span>

        <span>
          Final Year Project | MERN Stack
        </span>
      </div>
    </footer>
  );
}

export default Footer;