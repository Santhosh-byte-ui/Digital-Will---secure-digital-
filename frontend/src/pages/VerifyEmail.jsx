import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    try {
      const response = await fetch(
        `https://digital-will-wg4g.onrender.com/api/auth/verify-email/${token}`
      );

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
      <h1 style={{ color: "#001f7f" }}>
        Verifying Email...
      </h1>

      <p>Please wait...</p>
    </div>
  );
}

export default VerifyEmail;