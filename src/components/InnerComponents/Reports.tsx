import PieChartBoard from "../Boards/PieChartBoard";
import BarChartBoard from "../Boards/BarChartBoard";
import BarChart2 from "../Boards/Barchart2";
import { Box, Typography } from "@mui/material";
import { UseAuth } from "../../contexts/AuthContext";
import Piechart2 from "../Boards/PiChart2";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Reports() {
  const { currentUser } = UseAuth();

  const [tasks, setTasks] = useState([]);
  const [result, setResult] = useState([]);

  const [priorityCount, setPriorityCount] = useState([]);
  useEffect(() => {
    const role = currentUser?.role;
    const prefix = role == "user" ? "admin" : "user";
    async function getTasksCall() {
      const response1 = await axios.post(
        `http://localhost:5000/graphql`,
        {
          query: `query{
              fetchTaskStatuses {
                taskStatusCount
                count
              }
            }`,
        },
        { withCredentials: true },
      );

      const response2 = await axios.post(
        `http://localhost:5000/graphql`,
        {
          query: `query{
  fetchUserAndAdminStatuses {
    email
    status
    totalTasks
  }
}`,
        },
        { withCredentials: true },
      );
      const response3 = await axios.post(
        `http://localhost:5000/graphql`,
        {
          query: `query{
  fetchPriorityCount {
    label1
    label2
    value
  }
}`,
        },
        { withCredentials: true },
      );
      setTasks(response1?.data?.data?.fetchTaskStatuses);
      setResult(response2?.data?.data?.fetchUserAndAdminStatuses);
      setPriorityCount(response3?.data?.data?.fetchPriorityCount);
    }
    getTasksCall();
  }, [currentUser]);

  return (
    <>
      {currentUser?.role === "admin" ? (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Typography
            sx={{
              // boxShadow: 1,
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
              // boxShadow: 1,
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
        <Piechart2 data={priorityCount} />
        <BarChartBoard tasks={tasks} />
        <PieChartBoard tasks={tasks} />
      </Box>
      <Box sx={{ mt: 5 }}>
        <BarChart2 result={result} />
      </Box>
    </>
  );
}
