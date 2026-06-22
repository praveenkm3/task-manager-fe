import { Box, TextField, Button, Paper,IconButton } from "@mui/material";
import { type register } from "../../types";
import { useState, useEffect } from "react";
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import {Typography} from "@mui/material"; 
import { useNavigate } from "react-router";
import { UseAuth } from "../../contexts/AuthContext";





export default function Login() {
  const {currentUser,setCurrentUser}=UseAuth();
  if(currentUser){

    console.log(currentUser);
  }
  const navigate=useNavigate();
  const [registerData, setRegisterData] = useState<register | null>(null);
  const [user, setUser] = useState<register | null>(null);
  const [error, setError] = useState({ 
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
    async function login() {
      try{

        const response = await axios.post("http://localhost:5000/api/login", { 
          email: user?.email?.toLocaleLowerCase(),
          password: user?.password
        },{withCredentials:true}); 
        setCurrentUser({role:response.data.role,email:response.data.email})
        setSnack(String("✅ Login successful"));
        setFlag(true);
        if(response.status===200){
          console.log("main page");
          return navigate('/main');
        }else{
          console.log("still inside login page");
          return navigate('/login')
        }
      }catch{
        setSnack(String("❌ login Unsuccessful"));
        setFlag(true);
      }
    }
    if (user) {
      login();
    }
  }, [user,navigate]);

  function handleSubmit() {
    if (!registerData) {
      setError({ emailError: true, passwordError: true });
      return;
    } else {
      const { email, password } = registerData;
      if (!email) {
        setError((prev) => ({ ...prev, emailError: true }));
        return
      }
      if (!password) {
        setError((prev) => ({ ...prev, passwordError: true }));
        return;
      }
    }
    setUser(registerData);
    setRegisterData(null);
    setError({emailError: false, passwordError: false });
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
        gap:10
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
          Welcome Back to Login
        </Typography>
        </Box>
        <Box sx={{display:"flex",flexDirection:"column",gap:5}}>
          
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
         <Button sx={{height:5}} onClick={()=>navigate('/register')}>
           <Typography>create account</Typography>
          </Button>
        </Box>
        </Box>
        
        <Box sx={{pb:10}}>
          <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{  color: "white", bgcolor: "black",width:"100%",fontFamily:"cursive",fontSize:20 }}
        >
          Login
        </Button>
        </Box>
      
    </Paper>
  );
}
