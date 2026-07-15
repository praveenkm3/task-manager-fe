import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { UseAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";

export default function Calender() {
  const [taskDates, setTaskDates] = useState([]);
  const { currentUser } = UseAuth();
  const navigate = useNavigate();
  const role = currentUser?.role;
  useEffect(() => {
    async function fetchDates() {
      const response = await axios.post(
        `http://localhost:5000/graphql`,{
          query:`query{
  fetchDates {
    duedate
    id
    taskname
    tasks_taskId
    status
  }
}`
        },
        { withCredentials: true },
      );
      setTaskDates(response?.data?.data?.fetchDates);
    }
    fetchDates();
  }, [role]);

  // console.log(taskDates);

  const calendarEvents = taskDates?.map((task) => ({
    id: task?.id,
    title: task?.taskname,
    start: task?.duedate?.split("T")[0],
    backgroundColor:
      task?.status === "Pending"
        ? "#E3F2FD"
        : task?.status === "Completed"
        ? "#E8F5E9"
        : task?.status === "TO DO"
        ? "#FFEBEE"
        : task?.status === "In Progress"
        ? "#FFF3E0"
        : "#F5F5F5",

    borderColor:
      task?.status === "Pending"
        ? "#2196F3"
        : task?.status === "Completed"
        ? "#4CAF50"
        : task?.status === "TO DO"
        ? "#F44336"
        : task?.status === "In Progress"
        ? "#FF9800"
        : "#BDBDBD",
    textColor: "#172B4D",
    extendedProps: {
      status: task?.status,
    },
  }));

  return (
    <Box sx={{ px: "20px" }}>
      <h2>Task Deadlines</h2>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={calendarEvents}
        eventDidMount={(info) => {
          info.el.title = `Status: ${info.event.extendedProps.status[0].toUpperCase()+info.event.extendedProps.status.slice(1)}`;
        }}
        eventClick={(info) => {
          navigate(`/task/${info.event.id}`);
        }}
      />
    </Box>
  );
}
