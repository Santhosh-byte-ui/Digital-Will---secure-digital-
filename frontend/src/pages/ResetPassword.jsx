import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const resetPassword = async () => {
    try {
      const response = await apiFetch(`/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
        }),
      });

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        navigate("/login");
      }
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
      <h1 style={{ color: "#001f7f" }}>Reset Password</h1>

      <input
        type="password"
        placeholder="Enter New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
        onClick={resetPassword}
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
        Reset Password
      </button>
    </div>
  );
}

export default ResetPassword;
