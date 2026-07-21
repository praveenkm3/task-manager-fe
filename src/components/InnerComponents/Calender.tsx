import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Box } from "@mui/material"; 
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import { useFetchDates } from "../../reactQuery/hooks/fetchHooks"; 
import Spinner from "./Spinner";
export default function Calender() { 
  const navigate = useNavigate(); 

  const {data,isLoading}=useFetchDates();
  if(isLoading){
    return <Spinner />
  }

  const calendarEvents = data.fetchDates?.map((task:any) => ({
    id: task?.id,
    title: task?.taskname,
    start: dayjs(task?.duedate).format("YYYY-MM-DD"),
    backgroundColor:
      task?.status === "In Progress"
        ? "#E3F2FD"
        : task?.status === "Completed"
        ? "#E8F5E9"
        : task?.status === "TO DO"
        ? "#FFEBEE"
        : task?.status === "On Hold"
        ? "#FFF3E0"
        : "#F5F5F5",

    borderColor:
      task?.status === "In Progress"
        ? "#2196F3"
        : task?.status === "Completed"
        ? "#4CAF50"
        : task?.status === "TO DO"
        ? "#F44336"
        : task?.status === "On Hold"
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
