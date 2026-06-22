import { Box, TextField, Button, Paper,IconButton } from "@mui/material";
import { type register } from "../../types";
import { useState, useEffect } from "react";
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router";
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
export default function Register() {
  const navigate=useNavigate();
  const [registerData, setRegisterData] = useState<register | null>(null);
  const [user, setUser] = useState<register | null>(null);
  const [error, setError] = useState({
    userError: false,
    emailError: false,
    passwordError: false,
  });
  const [snack,setSnack]=useState("");
const [flag,setFlag]=useState(false);
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const { name, value } = event.target;
    setRegisterData({ ...registerData, [name]: value });
  }

  useEffect(() => {
    // console.log(user);
    async function register() {
      try{

        const response = await axios.post("http://localhost:5000/api/register", {
          username: user?.username?.toLocaleLowerCase(),
          email: user?.email?.toLocaleLowerCase(),
          password: user?.password,
          adminSecretKey: user?.adminSecretKey,
        });
        console.log(typeof response.status,response.data);
        setSnack(String("✅ Registration successful"));
        setFlag(true);

      }catch{
        setSnack(String("❌ Registration Unsuccessful"));
        setFlag(true);

      }
      
      // setSnack(String(response.data));
      // console.log(response.status, response.data);
    }
    if (user) {
      register();
    }
  }, [user]);

  function handleSubmit() {
    if (!registerData) {
      setError({ userError: true, emailError: true, passwordError: true });
      return;
    } else {
      const { username, email, password } = registerData;
      if (!username) {
        setError((prev) => ({ ...prev, userError: true }));
      }
      if (!email) {
        setError((prev) => ({ ...prev, emailError: true }));
      }
      if (!password) {
        setError((prev) => ({ ...prev, passwordError: true }));
        return;
      }
    }
    setUser(registerData);
    setRegisterData(null);
    setError({ userError: false, emailError: false, passwordError: false });
  }
const action = (
    < >
       
      <IconButton
        size="small"
        aria-label="close"
        color="inherit" 
        onClick={()=>setFlag(false)}
      >
        <CloseIcon fontSize="small"  />
      </IconButton>
    </ >
  );
  return (
    <Paper
      elevation={20}
      sx={{
        display: "flex",
        justifyContent:"flex-start",
        mt: 5,
        px: 20,
        py:5,
        width: "600px",
        height: "600px",
        ml: 35,
        flexDirection:"column",
        gap:3
      }}
    >
      <Snackbar
        open={flag}
        autoHideDuration={3000} 
        message={snack}
        action={action}
        onClose={()=>setFlag(false)}
      />
        <Box>
          <Typography variant="h3" sx={{ fontFamily: "cursive",ml:7 }}>
          Welcome to  Registration
        </Typography>
        </Box>
        <Box sx={{display:"flex",flexDirection:"column",gap:3}}>
          <TextField 
          error={error.userError}
          type="text"
          id="outlined-error-helper-text"
          helperText={error.userError ? "Username Required" : ""}
          label="User Name"
          variant="outlined"
          value={registerData?.username || ""}
          onChange={handleChange}
          name="username"
        />
        <TextField
          error={error.emailError}
          id="outlined-error-helper-text"
          helperText={error.emailError ? "Email Required" : ""}
          type="email"
          label="Email"
          variant="outlined"
          value={registerData?.email || ""}
          onChange={handleChange}
          name="email"
        />
        <TextField
          error={error.passwordError}
          id={
            error.passwordError
              ? "outlined-error-helper-text"
              : "outlined-basic"
          }
          helperText={error.passwordError ? "Password Required" : ""}
          type="password"
          label="Password"
          variant="outlined"
          value={registerData?.password || ""}
          onChange={handleChange}
          name="password"
        />
        <Box sx={{display:"flex",justifyContent:"end"}}>
         <Button sx={{height:5}} onClick={()=>navigate('/login')}>
           <Typography>click here to Login</Typography>

          </Button>
        </Box>
        </Box>
        <Box >
          <Accordion sx={{border:"0.5px solid black",boxShadow:"none"}}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography component="span" >Admin</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                sx={{ "& > :not(style)": { m: 1, width: "40ch" } }}
                type="password"
                label="Admin Key "
                variant="outlined"
                value={registerData?.adminSecretKey || ""}
                onChange={handleChange}
                name="adminSecretKey"
              />
            </AccordionDetails>
          </Accordion>
          
        </Box>
        <Box sx={{pb:10}}>
          <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{  color: "white", bgcolor: "black",width:"100%",fontFamily:"cursive",fontSize:20 }}
        >
          Register
        </Button>
        </Box>
      
    </Paper>
  );
}
