import { useState } from "react";

function DeadManSettings() {
  const [deadManEnabled, setDeadManEnabled] =
    useState(false);

  const [inactivityDays, setInactivityDays] =
    useState(30);

  const saveSettings = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://digital-will-wg4g.onrender.com/api/deadman/settings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            deadManEnabled,
            inactivityDays,
          }),
        }
      );

      const data = await response.json();

      alert(data.message);
    } catch (error) {
      console.log(error);
      alert("Failed to save settings");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fc",
        padding: "30px",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "auto",
          background: "white",
          padding: "35px",
          borderRadius: "20px",
          boxShadow:
            "0 10px 25px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            color: "#001f7f",
            marginBottom: "20px",
          }}
        >
          ⏳ Dead Man's Algorithm Settings
        </h1>

        <p
          style={{
            color: "#666",
            lineHeight: "1.8",
          }}
        >
          Configure the inactivity period after
          which the system will begin the Death
          Verification Process.
        </p>

        <div
          style={{
            marginTop: "30px",
          }}
        >
          <label>
            <input
              type="checkbox"
              checked={deadManEnabled}
              onChange={(e) =>
                setDeadManEnabled(
                  e.target.checked
                )
              }
            />

            <span
              style={{
                marginLeft: "10px",
                fontWeight: "bold",
              }}
            >
              Enable Dead Man's Algorithm
            </span>
          </label>
        </div>

        <div
          style={{
            marginTop: "25px",
          }}
        >
          <label>
            <strong>Inactivity Period (Days)</strong>
          </label>

          <br />
          <br />

          <input
            type="number"
            min="1"
            value={inactivityDays}
            onChange={(e) =>
              setInactivityDays(
                Number(e.target.value)
              )
            }
            placeholder="Enter inactivity days"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ddd",
            }}
          />
        </div>

        <button
          onClick={saveSettings}
          style={{
            marginTop: "30px",
            width: "100%",
            background:
              "linear-gradient(135deg,#001f7f,#2563eb)",
            color: "white",
            border: "none",
            padding: "15px",
            borderRadius: "12px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}

export default DeadManSettings;