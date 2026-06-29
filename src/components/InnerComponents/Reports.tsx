import PieChartBoard from "../Boards/PieChartBoard";
import BarChartBoard from "../Boards/BarChartBoard";
import BarChart2 from "../Boards/Barchart2";
import { Box, Typography } from "@mui/material";
import { UseAuth } from "../../contexts/AuthContext";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Reports() {
  const { currentUser } = UseAuth();

  const [tasks, setTasks] = useState([]);
  const [result, setResult] = useState([]); 

  useEffect(() => {
    const role=currentUser?.role
    async function getTasksCall() {
      const response = await axios.get(
        `http://localhost:5000/${role}/fetch-tasks-status`,
        { withCredentials: true },
      ); 
      setTasks(response.data);
    }
    getTasksCall();
    let prefix='';
    if(role==='admin'){
      prefix='user';
    }else if(role=='user'){
      prefix='admin';
    }
    async function runner() {
      const response = await axios.get(
        `http://localhost:5000/${role}/fetch-tasks-${prefix}`,
        { withCredentials: true },
      );
      setResult(response.data);
    }
    runner();
  }, [currentUser]);
  
  return (
    <>
    {
      currentUser?.role==='admin' ? 
      <Box sx={{display:"flex",justifyContent:"center",mb:2}}>
        <Typography  sx={{boxShadow:1,px:5,py:2,fontWeight:700,fontSize:"18px",color:"#003049"}}>Task Overview & Admin Dashboard</Typography>
      </Box>
       :
       <Box sx={{display:"flex",justifyContent:"center",mb:2}}>
        <Typography  sx={{boxShadow:1,px:5,py:2,fontWeight:700,fontSize:"18px",color:"#003049"}} >Task Analytics & Overview</Typography>
       </Box>
    }
      <Box sx={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <PieChartBoard tasks={tasks} />
        <BarChartBoard tasks={tasks}/>
      </Box>
      <Box sx={{ mt:5}}>
        <BarChart2 result={result} />
      </Box>
    </>
  );
}
