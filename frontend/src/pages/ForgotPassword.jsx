import { useState } from "react";
import { apiFetch } from "../api";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const forgotPassword = async () => {
    try {
      const response = await apiFetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      alert(data.message);
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div
      style={{
        padding: "50px",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "#001f7f" }}>Forgot Password</h1>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: "12px",
          width: "300px",
          marginTop: "20px",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <br />

      <button
        onClick={forgotPassword}
        style={{
          marginTop: "20px",
          padding: "12px 25px",
          background: "#001f7f",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Send Reset Link
      </button>
    </div>
  );
}

export default ForgotPassword;
