import { Button } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography'; 
import { useNavigate } from 'react-router';
export default function Navbar2() {
  const navigate=useNavigate();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{bgcolor:"black",p:1}}>
        <Toolbar variant="dense">
           
          <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"}}>
             
            <Typography
            variant="h6"
            component="div"
            sx={{
              color: 'whitesmoke', 
              fontFamily:"cursive"
            }}
          >
            Task Manager
          </Typography> 
          <Box sx={{display:"flex",flexDirection:"row",gap:6}}> 
            <Button sx={{fontFamily:"cursive",bgcolor:"black",color:"white"}} onClick={()=>navigate('/register')}>Register</Button>
          </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
