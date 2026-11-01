import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function verifyEmail() {
      try {
        const response = await apiFetch(`/api/auth/verify-email/${token}`);
        const data = await response.json();
        alert(data.message);
        if (response.ok) navigate("/login", { replace: true });
      } catch (error) {
        console.error("Email verification request failed.", error.name);
        alert("Something went wrong");
      }
    }

    void verifyEmail();
  }, [navigate, token]);

  return (
    <div
      style={{
        padding: "50px",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "#001f7f" }}>Verifying Email...</h1>

      <p>Please wait...</p>
    </div>
  );
}

export default VerifyEmail;
