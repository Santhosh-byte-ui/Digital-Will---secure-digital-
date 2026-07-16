function SecurityScore({ stats }) {
  if (!stats) return null;

  let score = 0;

  if (stats.totalAssets > 0) score += 20;
  if (stats.totalWills > 0) score += 20;
  if (stats.totalBeneficiaries > 0) score += 20;

  if (
    stats.deadManStatus &&
    stats.deadManStatus.deadManEnabled
  ) {
    score += 20;
  }

  if (stats.totalDocuments > 0) score += 20;

  return (
    <div
      style={{
        background: "#fff",
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
        🔐 Security & Readiness Score
      </h2>

      <h1
        style={{
          color: "#16a34a",
        }}
      >
        {score}%
      </h1>

      <div
        style={{
          width: "100%",
          background: "#ddd",
          borderRadius: "20px",
          height: "15px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${score}%`,
            background: "#16a34a",
            height: "100%",
          }}
        />
      </div>

      <div
        style={{
          marginTop: "20px",
        }}
      >
        <p>
          Assets Added:
          {stats.totalAssets > 0
            ? " ✅"
            : " ❌"}
        </p>

        <p>
          Will Created:
          {stats.totalWills > 0
            ? " ✅"
            : " ❌"}
        </p>

        <p>
          Beneficiaries Added:
          {stats.totalBeneficiaries > 0
            ? " ✅"
            : " ❌"}
        </p>

        <p>
          Documents Uploaded:
          {stats.totalDocuments > 0
            ? " ✅"
            : " ❌"}
        </p>

        <p>
          Dead Man Algorithm:
          {stats.deadManStatus &&
          stats.deadManStatus.deadManEnabled
            ? " ✅"
            : " ❌"}
        </p>
      </div>
    </div>
  );
}

export default SecurityScore;