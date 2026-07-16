function RecentActivity({ activities }) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "25px",
        borderRadius: "16px",
        boxShadow:
          "0 8px 20px rgba(0,0,0,0.08)",
        marginTop: "30px",
      }}
    >
      <h2
        style={{
          color: "#001f7f",
          marginBottom: "20px",
        }}
      >
        🕒 Recent Activity
      </h2>

      {activities.length === 0 ? (
        <p>
          No recent activities found.
        </p>
      ) : (
        activities.map((activity) => (
          <div
            key={activity._id}
            style={{
              borderLeft:
                "4px solid #2563eb",
              paddingLeft: "15px",
              marginBottom: "20px",
            }}
          >
            <h3
              style={{
                margin: "0",
                color: "#333",
              }}
            >
              {activity.action} - {activity.module}
            </h3>

            <p
              style={{
                color: "#666",
                marginTop: "5px",
              }}
            >
              {activity.details}
            </p>

            <small
              style={{
                color: "#999",
              }}
            >
              {new Date(
                activity.createdAt
              ).toLocaleString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
}

export default RecentActivity;