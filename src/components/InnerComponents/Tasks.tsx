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
import { Avatar, Box, Button, Typography } from "@mui/material";
import { UseAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

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
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const totalPages = Math.trunc(count / 10);
  useEffect(() => {
    async function runner() {
      if (currentUser.role === "admin") {
        const response = await axios.get(
          "http://localhost:5000/admin/fetch-tasks",
          { withCredentials: true },
        ); 
        setTasks(response.data);
      } else {
        const response = await axios.get(
          `http://localhost:5000/user/fetch-tasks/${page}`,
          { withCredentials: true },
        );
        setTasks(response.data);
        const response2 = await axios.get(
          `http://localhost:5000/user/fetch-tasks-length`,
          { withCredentials: true },
        );
        setCount(response2?.data?.length);
      }
    }
    runner();
  }, [page]);  
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  // console.log(page);
  return (
    <>
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
            {tasks?.map((task, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {task?.tasks_title.toUpperCase()}
                </TableCell>
                <TableCell align="right">{task?.tasks_description}</TableCell>
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
                        task?.tasks_status === "In Progress"
                          ? "#ebedf0"
                          : task?.tasks_status === "TO DO"
                            ? "#ebedf0"
                            : task?.tasks_status === "Completed"
                              ? "#bed1b769"
                              : "#ebedf0",

                      color:
                        task?.tasks_status === "TO DO"
                          ? "#4d4a4a"
                          : task?.tasks_status === "pending"
                            ? "#fc9a9a"
                            : task?.tasks_status === "In Progress"
                              ? "#1591DC"
                              : "green",
                    }}
                    label={task?.tasks_status.toUpperCase()}
                  />
                  {/* </Typography> */}
                </TableCell>
                {currentUser.role === "user" ? (
                  <>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", flexDirection: "row", gap: 2 }}
                      >
                        <Avatar
                          sx={{
                            width: 25,
                            height: 25,
                            bgcolor: `${colorArray[random.integer(0, colorArray.length - 1)]}`,
                          }}
                        >
                          <Typography sx={{ fontSize: "10px" }}>
                            {task.admins_email[0].toUpperCase()}
                          </Typography>
                        </Avatar>
                        <Box>{task.admins_email.toUpperCase()}</Box>
                      </Box>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", flexDirection: "row", gap: 2 }}
                      >
                        <Avatar
                          sx={{
                            width: 25,
                            height: 25,
                            bgcolor: `${colorArray[random.integer(0, colorArray.length - 1)]}`,
                          }}
                        >
                          <Typography sx={{ fontSize: "10px" }}>
                            {task?.users_email[0].toUpperCase()}
                          </Typography>
                        </Avatar>
                        <Box>{task.users_email.toUpperCase()}</Box>
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
                    <RemoveRedEyeIcon sx={{ color: "#4d4a4a", height: 20 }} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack spacing={5}>
        <Pagination count={totalPages} page={page} onChange={handleChange} />
      </Stack>
    </>
  );
}
