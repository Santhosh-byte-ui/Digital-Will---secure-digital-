import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function AssetPieChart({ data }) {
  const COLORS = [
    "#2563eb",
    "#16a34a",
    "#dc2626",
    "#f59e0b",
    "#9333ea",
    "#06b6d4",
  ];

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
        📊 Asset Distribution
      </h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  COLORS[
                    index % COLORS.length
                  ]
                }
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AssetPieChart;