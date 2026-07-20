import { Alert, Box, Button, Paper, Snackbar, TextField, Typography, type SnackbarCloseReason } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
// import axios from "axios";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useForgot } from "../../reactQuery/hooks/authHooks";
export default function ForgotPassword() {
  const{mutate}=useForgot();
  const [email, setEmail] = useState("");
  const navigate=useNavigate();
  const [flag,setFlag]=useState(false);
   const [open, setOpen] = React.useState(false);
 const [message,setMessage]=useState("");
  const handleSendOtp = async(e:React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault(); 
    setFlag(true);
    // const response=await axios.post("http://localhost:5000/api/forgot",{
    //   email
    // },{withCredentials:true});
    mutate( email ,{
      onSuccess:()=>{
        setFlag(false);
        sessionStorage.setItem("email",email);
        navigate('/verify-otp');
      },
      onError:()=>{
        setMessage("Invalid Email Address");
        setOpen(true);
        setFlag(false);
      }
    })
   
    
  };




  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: 500,
          height: 300,
        }}
      >
           <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                  onClose={handleClose}
                  severity="warning"
                  variant="filled"
                  sx={{ width: '100%' }}
                >
                  {message}
                </Alert>
              </Snackbar>
        <Box sx={{display:"flex",flexDirection:"column",gap:3}}>
          
          <Typography variant="h5" fontWeight="bold">
            Forgot Password
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Enter your email address to receive a (OTP).
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSendOtp}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
{flag && <Box sx={{display:"flex",justifyContent:"center"}}>
  <CircularProgress />
</Box>}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={!email.trim()}
          >
            Send OTP
          </Button>
          
        </Box>
      </Paper>
    </Box>
  );
}
