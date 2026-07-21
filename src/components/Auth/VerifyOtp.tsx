import {
  Alert,
  Box,
  Button,
  Paper,
  Snackbar,
  TextField,
  Typography,
  type SnackbarCloseReason,
} from "@mui/material";
import { CircularProgress } from "@mui/material";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  useVerifyOtp,
  useVerifyPassword,
} from "../../reactQuery/hooks/authHooks";
export default function VerifyOtp() {
  const { mutate, isPending: isOtpPending } = useVerifyOtp();
  const { mutate: mutatePassword, isPending: isPasswordPending } =
    useVerifyPassword();
  const [otp, setOtp] = useState("");
  const email = sessionStorage.getItem("email");
  const navigate = useNavigate();
  const [makeEnterPassword, setMakeEnterPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = React.useState(false);
  async function handleOtpSubmit(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (!email || !otp) {
      return;
    }
    mutate(
      {
        uemail: email ?? "",
        otp: otp,
      },
      {
        onSuccess: () => {
          setMakeEnterPassword(true);
          setOpen(false);
          return;
        },
        onError: () => {
          setOtp("");
          setMessage("Incorrect OTP Entered");
          setOpen(true);
          return;
        },
      },
    );
  }
  async function handlePasswordSubmit() {
    mutatePassword(
      {
        uemail: email ?? "",
        password,
      },
      {
        onSuccess: () => {
          sessionStorage.removeItem("email");
          navigate("/login");
        },
        onError: (error) => {
          if (error.response?.data?.message === "Not Generated New Password") {
            navigate("/forgot");
            return;
          } else if (error.response?.data?.message === "SamePasswordEntered") {
            setPassword("");
            setMessage(
              "Enter New password, It cannot be the same as the current password",
            );
            setOpen(true);
            return;
          }
        },
      },
    );
  }

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === "clickaway") {
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
              <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
              >
                <Alert
                  onClose={handleClose}
                  severity="warning"
                  variant="filled"
                  sx={{ width: "100%" }}
                >
                  {message}
                </Alert>
              </Snackbar>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="h5" sx={{fontWeight:"bold"}}>
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
                  disabled={!otp.trim() || isOtpPending}
                >
                  {isOtpPending ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Submit OTP"
                  )}
                </Button>
              </Box>
            </>
          )}
          {makeEnterPassword && (
            <>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 5 }}
              >
                <Snackbar
                  open={open}
                  autoHideDuration={6000}
                  onClose={handleClose}
                >
                  <Alert
                    onClose={handleClose}
                    severity={
                      message !==
                      "Enter New password, It cannot be the same as the current password"
                        ? "success"
                        : "error"
                    }
                    variant="filled"
                    sx={{ width: "100%" }}
                  >
                    {message}
                  </Alert>
                </Snackbar>
                <Typography variant="h5"  sx={{ mb: 2,fontWeight:"bold" }}>
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
                  disabled={!password.trim() || isPasswordPending}
                  onClick={handlePasswordSubmit}
                >
                  {isPasswordPending ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Change Password"
                  )}
                  
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </>
  );
}
