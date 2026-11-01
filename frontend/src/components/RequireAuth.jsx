import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { apiFetch } from "../api";

function RequireAuth({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [isChecking, setIsChecking] = useState(Boolean(token));

  useEffect(() => {
    if (!token) return;

    let active = true;
    apiFetch("/api/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) return null;
        const data = await response.json();
        return data.user;
      })
      .then((verifiedUser) => {
        if (!active) return;
        if (verifiedUser) {
          localStorage.setItem("user", JSON.stringify(verifiedUser));
          setUser(verifiedUser);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setIsChecking(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (isChecking) {
    return (
      <p role="status" style={{ padding: "24px" }}>
        Checking session...
      </p>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default RequireAuth;
