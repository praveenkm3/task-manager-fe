import { Random } from "random-js";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import Chip from "@mui/material/Chip";
import axios from "axios";
import { Avatar, Box, Button, Badge, Typography } from "@mui/material";
import { UseAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const colorArray = [
  "#FFD400",
  "#39B1D1",
  "#4647AE",
  "#659287",
  "#6FD1D7",
  "#4B4038",
  "#ACCFA3",
  "#FF653F",
  "#1E104E",
];

// value = random.integer(0, colorArray.length-1);
export default function Tasks() {
  const random = new Random();
  const navigate = useNavigate();
  const { currentUser } = UseAuth();
  // console.log(currentUser);
  const [tasks, setTasks] = useState(null);
  useEffect(() => {
    async function runner() {
      if (currentUser.role === "admin") {
        const response = await axios.get(
          "http://localhost:5000/admin/fetch-tasks",
          { withCredentials: true },
        );
        // console.log(response.data);
        setTasks(response.data);
      } else {
        const response = await axios.get(
          "http://localhost:5000/user/fetch-tasks",
          { withCredentials: true },
        );
        // console.log(response.data);
        setTasks(response.data);
      }
    }
    runner();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table
        size="small"
        sx={{
          minWidth: 450,
          textAlignLast: "left",
        }}
        aria-label="simple table"
      >
        <TableHead sx={{ bgcolor: "#003049", height: "54px" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700, fontSize: 20, color: "white" }}>
              Title
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontWeight: 700, fontSize: 20, color: "white" }}
            >
              Description
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontWeight: 700, fontSize: 20, color: "white" }}
            >
              Status
            </TableCell>
            {currentUser.role === "user" ? (
              <>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 700, fontSize: 20, color: "white" }}
                >
                  Created By
                </TableCell>
                
              </>
            ) : (
              <>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 700, fontSize: 20, color: "white" }}
                >
                  Assigned to
                </TableCell>
              </>
            )}
            <TableCell
                  align="right"
                  sx={{ fontWeight: 700, fontSize: 20, color: "white" }}
                >
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Box>Task</Box>
                    <Box>Details</Box>
                  </Box>
                </TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ textAlignLast: "left" }}>
          {tasks?.map((task) => (
            <TableRow
              key={task.title}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {task.title.toUpperCase()}
              </TableCell>
              <TableCell align="right">
                {task.description.toUpperCase()}
              </TableCell>
              <TableCell
                align="right"
                sx={{ pr: 10, fontFamily: "monospace", fontWeight: 700 }}
              >
                {/* <Typography > */}
                <Chip
                  sx={{
                    fontWeight: 700,
                    fontSize: "13px",
                    borderRadius: 10,
                    width: 140,
                    bgcolor:
                      task.status === "In Progress"
                        ? "#ebedf0"
                        : task.status === "TO DO"
                          ? "#ebedf0"
                          : task.status === "Completed"
                            ? "#bed1b769"
                            : "#ebedf0",

                    color:
                      task.status === "TO DO"
                        ? "#4d4a4a"
                        : task.status === "pending"
                          ? "#fc9a9a"
                          : task.status === "In Progress"
                            ? "#1591DC"
                            : "green",
                  }}
                  label={task.status.toUpperCase()}
                />
                {/* </Typography> */}
              </TableCell>
              {currentUser.role === "user" ? (
                <>
                  <TableCell>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 25,
                          height: 25,
                          bgcolor: `${colorArray[random.integer(0, colorArray.length - 1)]}`,
                        }}
                      >
                        <Typography sx={{ fontSize: "10px" }}>
                          {task.createdUser?.email[0].toUpperCase()}
                        </Typography>
                      </Avatar>
                      <Box>{task.createdUser?.email.toUpperCase()}</Box>
                    </Box>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                      <Avatar
                        sx={{
                          width: 25,
                          height: 25,
                          bgcolor: `${colorArray[random.integer(0, colorArray.length - 1)]}`,
                        }}
                      >
                        <Typography sx={{ fontSize: "10px" }}>
                          {task.assignedUser?.email[0].toUpperCase()}
                        </Typography>
                      </Avatar>
                      <Box>{task.assignedUser?.email.toUpperCase()}</Box>
                    </Box>
                  </TableCell>
                </>
              )}
              <TableCell align="right">
                <Button
                  onClick={() => navigate(`/task/${task?.taskId}`)}
                  sx={{
                    "&:hover": {
                      background: "none",
                    },
                  }}
                >
                  <RemoveRedEyeIcon sx={{ color: "#4d4a4a",height:20 }} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
