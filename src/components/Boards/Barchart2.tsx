import { BarChart } from "@mui/x-charts/BarChart";
import { Box } from "@mui/material";

export default function BarChart2({ result }) {
  const colorMap = {
    "COMPLETED": "#4CAF50",
    "IN PROGRESS": "#2196F3",
    "TO DO": "#9E9E9E",
    "ON HOLD": "#FF9800",
  };

  const users = [...new Set(result.map((item) => item.email))];

  const statuses = [...new Set(result.map((item) => item.status))];

  const seriesData = statuses.map((status) => ({
    label: status.toUpperCase(),
    color: colorMap[status.toUpperCase()],
    data: users.map((user) => {
      const row = result.find(
        (item) => item.email === user && item.status === status
      );

      return row ? Number(row.totalTasks) : 0;
    }),
  }));

  return (
    <Box sx={{ borderRadius: 5, boxShadow: 5 }}>
      <BarChart
        xAxis={[
          {
            scaleType: "band",
            data: users,
          },
        ]}
        series={seriesData}
        height={350}
        yAxis={[{ width: 40 }]}
      />
    </Box>
  );
}