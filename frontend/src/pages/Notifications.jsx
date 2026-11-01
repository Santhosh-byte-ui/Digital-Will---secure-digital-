import { useEffect, useState } from "react";
import { apiFetch } from "../api";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const token = localStorage.getItem("token");
        const response = await apiFetch("/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) setNotifications(data.notifications);
      } catch (error) {
        console.error("Could not load notifications.", error.name);
      }
    }

    void fetchNotifications();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Notifications</h1>

      <hr />

      {notifications.length === 0 ? (
        <p>No Notifications Found</p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification._id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <h3>{notification.title}</h3>

            <p>{notification.message}</p>

            <small>{new Date(notification.createdAt).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;
