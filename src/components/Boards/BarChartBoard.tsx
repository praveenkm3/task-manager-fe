 
import { ChartsContainer } from "@mui/x-charts/ChartsContainer";
import { BarPlot } from "@mui/x-charts/BarChart"; 
import { ChartsXAxis, ChartsYAxis } from "@mui/x-charts";
import { Box } from "@mui/material";


export default function BarChartBoard({tasks}) {
  

  
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
const uData = [
    completed.value,pending.value,progress.value,todo.value
  ];
  return (
    <Box sx={{boxShadow:5,borderRadius:5}}>
      <ChartsContainer
      xAxis={[
        {
          scaleType: "band",
          data: ["COMPLETED", "PENDING", "IN PROGRESS", "TO DO"],
          colorMap: {
        type: 'ordinal',
        colors: ['#4254fb', '#2196f3', '#ff9800', '#f44336']
      }
        },
      ]}
      series={[{ type: "bar", id: "base", data: uData, barLabel:"value" }]}
      height={250}
      width={500}
      yAxis={[{ width: 30 }]}
      margin={{ left: 0, right: 10 }}
      sx={{mt:2,px:2,p:1}}
    >
      <BarPlot />
      <ChartsXAxis />
      <ChartsYAxis />
    </ChartsContainer>
    </Box>
  );
}
