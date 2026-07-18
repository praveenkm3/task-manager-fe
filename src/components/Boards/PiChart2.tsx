import { pieClasses, PieChart,type PieChartProps } from '@mui/x-charts/PieChart';
import { Box } from '@mui/material';  


export default function Piechart2({data}) { 
const priorityColors = {
  High: "#f44336",     
  Medium: "#fbc02d",  
  Low: "#388E3C"     
};

const data1 = data.reduce((acc, item) => {
  const existing = acc.find(x => x.label === item.label1);

  if (existing) {
    existing.value += Number(item.value);
  } else {
    acc.push({
      label: item.label1,
      value: Number(item.value),
      color: priorityColors[item.label1],
    });
  }

  return acc;
}, []);

const data2 = data.map(item => ({
  label: `${item.label1} ${item.label2}`,
  value: Number(item.value),
  color: data1.find(x => x.label === item.label1)?.color,
}));


  const settings = {
    series: [
      {
        innerRadius: 0,
        outerRadius: 80,
        data: data1,
        highlightScope: { fade: 'global', highlight: 'item' },
      },
      {
        id: 'outer',
        innerRadius: 100,
        outerRadius: 120,
        data: data2,
        highlightScope: { fade: 'global', highlight: 'item' },
      },
    ],
    height: 300,
    hideLegend: true,
  } satisfies PieChartProps;

  return (
    <Box sx={{boxShadow:5,borderRadius:5,height:300,width:400}}>
        <PieChart
      {...settings}
      sx={{
        [`.${pieClasses.series}[data-series="outer"] .${pieClasses.arc}`]: {
          opacity: 0.6,
        },
        
      }}
      
    />
    </Box>
  );
}
