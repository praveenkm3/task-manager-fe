import { PieChart } from "@mui/x-charts/PieChart"; 
import { Box } from "@mui/material";
export default function PieChartBoard({tasks}) {
 
  const completed={name:"Completed",value:0};
  const pending={name:"Pending",value:0};
  const progress={name:"Progress",value:0};
  const todo={name:"TO DO",value:0};
  for(let i=0;i<tasks.length;i++){
    const curr=tasks[i];
    if(curr?.taskStatusCount==='Completed'){
      completed.value=curr.count
    }else if(curr?.taskStatusCount==='In Progress'){
      progress.value=curr.count;
    }else if(curr.taskStatusCount==='pending'){
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
              { id: 0, value: completed.value, label: "COMPLETED" },
              {
                id: 1,
                value: progress.value,
                label: "IN PROGRESS",
              },
              { id: 2, value: todo.value, label: "TO DO" },
              { id: 3, value: pending.value, label: "PENDING" },
            ],
          },
        ]}
        width={300}
        height={200}
        sx={{p:5}}
      />
    </Box>
  );
}
