function DeadManStatus({ data }) {

  if (!data) {
    return null;
  }

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
        🛡 Dead Man Algorithm Protection
      </h2>


      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >

        <div>
          <h3>Status</h3>

          <p
            style={{
              color: data.deadManEnabled
                ? "green"
                : "red",
              fontWeight: "bold",
            }}
          >
            {data.deadManEnabled
              ? "ACTIVE ✅"
              : "DISABLED ❌"}
          </p>
        </div>


        <div>
          <h3>Inactivity Period</h3>

          <p>
            {data.inactivityDays} Days
          </p>
        </div>


        <div>
          <h3>Last Active</h3>

          <p>
            {new Date(
              data.lastActiveDate
            ).toLocaleDateString()}
          </p>
        </div>


        <div>
          <h3>Verification Status</h3>

          <p>
            {data.deathVerificationTriggered
              ? "Verification Started ⚠️"
              : "Protected 🔒"}
          </p>
        </div>


      </div>

    </div>
  );
}

export default DeadManStatus;