import { PieChart } from "@mui/x-charts/PieChart"; 
import { Box } from "@mui/material";
export default function PieChartBoard({tasks}) {
  const completed={name:"Completed",value:0};
  const pending={name:"On Hold",value:0};
  const progress={name:"Progress",value:0};
  const todo={name:"TO DO",value:0};
  for(let i=0;i<tasks.length;i++){
    const curr=tasks[i];
    if(curr?.taskStatusCount==='Completed'){
      completed.value=curr.count
    }else if(curr?.taskStatusCount==='In Progress'){
      progress.value=curr.count;
    }else if(curr.taskStatusCount==='On Hold'){
      pending.value=curr.count;
    }else if(curr.taskStatusCount==='TO DO'){
      todo.value=curr.count;
    }
  } 
  return (
    <Box sx={{boxShadow:5,borderRadius:5}}>
      <PieChart
        series={[
          {
            data: [
              { id: 0, value: completed.value, label: "COMPLETED",color:"#4CAF50" },
              {
                id: 1,
                value: progress.value,
                label: "IN PROGRESS",color:"#2196F3"
              },
              { id: 2, value: todo.value, label: "TO DO",color:"#9E9E9E" },
              { id: 3, value: pending.value, label: "ON HOLD",color: "#FF9800"},
            ],
          },
        ]}
        width={200}
        height={200}
        sx={{px:5,py:6}}
      />
    </Box>
  );
}
