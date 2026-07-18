import { Alert, Box, Button, Paper, Snackbar, TextField, Typography } from "@mui/material";
import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const email = sessionStorage.getItem("email");
  const navigate = useNavigate();
  const [makeEnterPassword, setMakeEnterPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [message,setMessage]=useState("");
   const [open, setOpen] = React.useState(false);
  async function handleOtpSubmit(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (email) {
      try {
        const response = await axios.post(
        "http://localhost:5000/api/verify-otp",
        {
          otp,
          uemail: email,
        },
        { withCredentials: true },
      );
      if (response?.status === 200) {
        setMakeEnterPassword(true);
        return;
      }else{
        alert("Invalid Otp");
        navigate('/forgot')
      }
      
      } catch (error) {
        console.log(error);
        setOtp("");
        // alert("Incorrect OTP Entered")
        setMessage("Incorrect OTP Entered");
        setOpen(true);
        return;
      }
    }
    alert("Something Interuppted Session");
    navigate('/forgot')
  }
  async function handlePasswordSubmit() {
    if (email) {
      try {
        const response = await axios.post(
        "http://localhost:5000/api/change-password",
        {
          uemail: email,
          password,
        },
        { withCredentials: true },
      );
      if (response.status === 200 && response.data.message ==='Generated New Password') {
        sessionStorage.removeItem("email");
        navigate("/login");
      }else if(response.status === 200 && response.data.message ==='SamePasswordEntered'){
        setPassword("");
        // alert("Same Password Entered");
        setMessage("Same Password Entered")
        setOpen(true);
        return;
      }
      } catch (error) {
        console.log(error);
        // alert("Invalid Attempt");
        // setMessage("Invalid Attempt");
        setOpen(true);
        navigate('/forgot');
        return;
      }
    }else{
      setMessage("Something Interuppted Session");
      setOpen(true);
      return;
      // return alert("Something Interuppted Session");
    }
  }


 



  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };


  return (
    <>
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
          {!makeEnterPassword && (
            <>
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
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="h5" fontWeight="bold">
                  Enter OTP
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Enter the OTP sent to your email address.
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleOtpSubmit}>
                <TextField
                  name="otp"
                  value={otp}
                  placeholder="Enter Otp"
                  fullWidth
                  onChange={(e) => setOtp(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={!otp.trim()}
                >
                  Submit OTP
                </Button>
              </Box>
            </>
          )}
          {makeEnterPassword && (
            <>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 5 }}
              >
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={message !== "Same Password Entered" ? "success"  :"error"}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                  Enter New Password
                </Typography>
              </Box>

              <Box>
                <TextField
                  name="password"
                  type="password"
                  value={password}
                  placeholder="Enter New Password"
                  fullWidth
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={!password.trim()}
                  onClick={handlePasswordSubmit}
                >
                  Change Password
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </>
  );
}
