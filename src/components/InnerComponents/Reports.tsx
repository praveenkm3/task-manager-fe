import PieChartBoard from "../Boards/PieChartBoard";
import BarChartBoard from "../Boards/BarChartBoard";
import BarChart2 from "../Boards/Barchart2";
import { Box, Typography } from "@mui/material";
import { UseAuth } from "../../contexts/AuthContext";
import Piechart2 from "../Boards/PiChart2";
import {
  useFetchTaskStatus,
  useFetchPriorityCount,
  useFetchUserAndAdminStatuses,
} from "../../reactQuery/hooks/fetchHooks";
import Spinner from "./Spinner";

export default function Reports() {
  const { currentUser } = UseAuth()!;
  const { data: data1, isLoading: load1 } = useFetchTaskStatus();
  const { data: data2, isLoading: load2 } = useFetchUserAndAdminStatuses();
  const { data: data3, isLoading: load3 } = useFetchPriorityCount();
  if (load1 || load2 || load3) {
    return <Spinner />;
  }
  return (
    <>
      {currentUser?.role === "admin" ? (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Typography
            sx={{
              px: 5,
              py: 2,
              fontWeight: 700,
              fontSize: "18px",
              color: "#003049",
            }}
          >
            Task Overview & Admin Dashboard
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Typography
            sx={{
              px: 5,
              py: 2,
              fontWeight: 700,
              fontSize: "18px",
              color: "#003049",
            }}
          >
            Task Analytics & Overview
          </Typography>
        </Box>
      )}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 5 }}>
        <Piechart2 data={data3?.fetchPriorityCount} />
        <BarChartBoard tasks={data1?.fetchTaskStatuses} />
        <PieChartBoard tasks={data1?.fetchTaskStatuses} />
      </Box>
      <Box sx={{ mt: 5 }}>
        <BarChart2 result={data2?.fetchUserAndAdminStatuses} />
      </Box>
    </>
  );
}
