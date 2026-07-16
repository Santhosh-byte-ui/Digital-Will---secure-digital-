import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function UploadTrendChart({ data }) {
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
        📈 Monthly Document Upload Trend
      </h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="uploads"
            stroke="#2563eb"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default UploadTrendChart;