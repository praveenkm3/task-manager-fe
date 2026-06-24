 
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';  
export default function Navbar2() { 
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{bgcolor:"#17313E",p:1}}>
        <Toolbar variant="dense">
           
          <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"}}>
             
            <Typography
            variant="h6"
            component="div"
            sx={{
              color: 'whitesmoke',fontFamily:"roboto" 
            }}
          >
            Jira Work Management
          </Typography> 
          
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
