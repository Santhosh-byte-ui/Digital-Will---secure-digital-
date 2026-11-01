import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiFetch } from "../api";

function Profile() {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    emergencyContactName: "",
    emergencyContactMobile: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        const response = await apiFetch("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) setUser(data.user);
      } catch (error) {
        console.error("Could not load profile.", error.name);
      } finally {
        setLoading(false);
      }
    }

    void fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUser({
      ...user,

      [e.target.name]: e.target.value,
    });
  };

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await apiFetch("/api/auth/emergency-contact", {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          emergencyContactName: user.emergencyContactName,

          emergencyContactMobile: user.emergencyContactMobile,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Profile updated successfully");

        setUser(data.user);

        setEditing(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          textAlign: "center",
          marginTop: "100px",
        }}
      >
        Loading Profile...
      </motion.h2>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",

        background: "#f8fafc",

        padding: "30px 15px",
      }}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 50,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
        }}
        style={{
          maxWidth: "650px",

          margin: "auto",

          background: "white",

          padding: "35px",

          borderRadius: "25px",

          boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
        }}
      >
        <h1
          style={{
            textAlign: "center",

            color: "#001f7f",
          }}
        >
          👤 My Profile
        </h1>

        <p
          style={{
            textAlign: "center",

            color: "#666",
          }}
        >
          Manage your personal information
        </p>

        <hr />

        <label>Name</label>

        <motion.input
          whileFocus={{
            scale: 1.02,
          }}
          value={user.name || ""}
          disabled
          style={inputStyle}
        />

        <label>Email</label>

        <motion.input
          whileFocus={{
            scale: 1.02,
          }}
          value={user.email || ""}
          disabled
          style={inputStyle}
        />

        <label>Role</label>

        <motion.input
          whileFocus={{
            scale: 1.02,
          }}
          value={user.role || ""}
          disabled
          style={inputStyle}
        />

        <h3
          style={{
            color: "#001f7f",

            marginTop: "25px",
          }}
        >
          🚨 Emergency Contact
        </h3>

        <label>Contact Name</label>

        <motion.input
          whileFocus={{
            scale: 1.02,
          }}
          name="emergencyContactName"
          value={user.emergencyContactName || ""}
          disabled={!editing}
          onChange={handleChange}
          style={inputStyle}
        />

        <label>Contact Mobile</label>

        <motion.input
          whileFocus={{
            scale: 1.02,
          }}
          name="emergencyContactMobile"
          value={user.emergencyContactMobile || ""}
          disabled={!editing}
          onChange={handleChange}
          style={inputStyle}
        />

        <motion.button
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={() => {
            editing ? updateProfile() : setEditing(true);
          }}
          style={buttonStyle}
        >
          {editing ? "💾 Save Changes" : "✏️ Edit Profile"}
        </motion.button>
      </motion.div>
    </div>
  );
}

const inputStyle = {
  width: "100%",

  padding: "14px",

  marginTop: "8px",

  marginBottom: "20px",

  borderRadius: "10px",

  border: "1px solid #ddd",

  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",

  padding: "15px",

  border: "none",

  borderRadius: "12px",

  background: "linear-gradient(135deg,#001f7f,#2563eb)",

  color: "white",

  fontSize: "16px",

  fontWeight: "700",

  cursor: "pointer",
};

export default Profile;
