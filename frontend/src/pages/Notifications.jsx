import { useEffect, useState } from "react";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("TOKEN:", token);

      const response = await fetch(
        "https://digital-will-wg4g.onrender.com/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("COUNT:", data.count);
      console.log("NOTIFICATIONS:", data.notifications);

      if (response.ok) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.log("ERROR:", error);
    }
  };

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

            <small>
              {new Date(notification.createdAt).toLocaleString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
}

export default Notifications;