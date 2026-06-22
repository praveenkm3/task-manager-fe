import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import axios from "axios";
import { Accordion, Button, Typography } from "@mui/material";
import { AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { UseAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";


export default function Tasks() {
  const navigate=useNavigate();
  const { currentUser } = UseAuth();
  console.log(currentUser);
  const [tasks, setTasks] = useState(null);
  useEffect(() => {
    async function runner() {
      if (currentUser.role === "admin") {
        const response = await axios.get(
          "http://localhost:5000/admin/fetch-tasks",
          { withCredentials: true },
        );
        console.log(response.data);
        setTasks(response.data);
      } else {
        const response = await axios.get(
          "http://localhost:5000/user/fetch-tasks",
          { withCredentials: true },
        );
        console.log(response.data);
        setTasks(response.data);
      }
    }
    runner();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table
        sx={{
          minWidth: 450,
          textAlignLast: "left",
          borderSpacing: "10px 10px",
        }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ fontWeight: 700, fontFamily: "cursive", fontSize: 20 }}
            >
              Task
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontWeight: 700, fontFamily: "cursive", fontSize: 20 }}
            >
              Description
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontWeight: 700, fontFamily: "cursive", fontSize: 20 }}
            >
              Status
            </TableCell>
            {currentUser.role === "user" ? (
              <TableCell
                align="right"
                sx={{ fontWeight: 700, fontFamily: "cursive", fontSize: 20 }}
              >
                Created By
              </TableCell>
            ) : (
              <>
              
              <TableCell
                align="right"
                sx={{ fontWeight: 700, fontFamily: "cursive", fontSize: 20 }}
              >
                Assigned to
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: 700, fontFamily: "cursive", fontSize: 20 }}
              >
                Task Details
              </TableCell>
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody sx={{ textAlignLast: "left" }}>
          {tasks?.map((task) => (
            
            <TableRow
              key={task.title}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              
              <TableCell component="th" scope="row">
                {task.title}
              </TableCell>
              <TableCell align="right">{task.description}</TableCell>

              {currentUser.role === "user" ? (
                <>
                  <TableCell align="right">{task.status}</TableCell>
                  <TableCell align="right">{task.createdUser?.email}</TableCell>
                </>
              ) : (
                <>
                  <TableCell align="right">{task.status}</TableCell>
                  <TableCell>
                    {task.assignedUser?.email}
                  </TableCell> 
                </>
              )}
              <TableCell align="right">
                <Button onClick={()=>navigate(`/task/${task?.taskId}`)}>View Task</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
