import { BarChart } from "@mui/x-charts/BarChart";
import { UseAuth } from "../../contexts/AuthContext";
import { Box } from "@mui/material";
export default function BarChart2({result}) {
  // console.log(result);
const {currentUser}=UseAuth()
let role=currentUser?.role;
let value='';
if(role==='admin'){
  value='assignedUser_email';
}else{
  value='createdUser_email';
}
   const colorMap={
    "COMPLETED":"#4254fb","IN PROGRESS":"#F9A825","TO DO":"#E53935","PENDING":"#29B9F6"
   }
  const users = [...new Set(result.map(item => item[value].toUpperCase()))];
 
  const statuses = [...new Set(result.map(item => item.task_status))];
  const seriesData = statuses.map(status => ({
  label: status.toUpperCase(),
  color:colorMap[status.toUpperCase()],
  data: users.length>0 ? users.map(user => {
    const row = result.find((item)=>{
        return item[value].toUpperCase() === user && item.task_status === status
    }
    ); 
    return row?.totalTasks ? row?.totalTasks  : 0;
  }) : [{data:[2, 5, 6]},{data:[2, 5, 6]},{data:[2, 5, 6]}]
}));
 

  return (
    <Box sx={{borderRadius:5,boxShadow:5}}>
    <BarChart
    xAxis={[
      {
        scaleType: "band",
        data: users.length > 0 ? [...users] : ["group A", "group B", "group C"],
        id: "auto-generated-id-0",
      },
    ]}
    
    series={seriesData}
    height={300}
    margin={{ left: 0 }}
    yAxis={[{ width: 30 }]}
    />
    </Box>
  );
}
