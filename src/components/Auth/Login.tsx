import { Box, TextField, Button, IconButton } from "@mui/material";
import { type register } from "../../types";
import { useState, useEffect } from "react";
import axios from "axios";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { UseAuth } from "../../contexts/AuthContext";
import LoginIcon from "../../../public/assets/Login copy.png";
export default function Login() {
  const { currentUser, setCurrentUser } = UseAuth();
  if (currentUser) {
    console.log(currentUser);
  }
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState<register | null>(null);
  const [user, setUser] = useState<register | null>(null);
  const [error, setError] = useState({
    emailError: false,
    passwordError: false,
  });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const { name, value } = event.target;
    setRegisterData({ ...registerData, [name]: value });
  }

  useEffect(() => {
    async function login() {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/login",
          {
            email: user?.email?.toLocaleLowerCase(),
            password: user?.password,
          },
          { withCredentials: true },
        );
        setCurrentUser({
          role: response.data.role,
          email: response.data.email,
        });

        if (response.status === 200) {
          console.log("main page");
          return navigate("/main");
        } else {
          console.log("still inside login page");
          return navigate("/login");
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (user) {
      login();
    }
  }, [user, navigate, setCurrentUser]);

  function handleSubmit() {
    if (!registerData) {
      setError({ emailError: true, passwordError: true });
      return;
    } else {
      const { email, password } = registerData;
      if (!email) {
        setError((prev) => ({ ...prev, emailError: true }));
        return;
      }
      if (!password) {
        setError((prev) => ({ ...prev, passwordError: true }));
        return;
      }
    }
    setUser(registerData);
    setRegisterData(null);
    setError({ emailError: false, passwordError: false });
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "90vh",
        width: "100vw",
        backgroundColor: "#f0f6fb",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          flexDirection: "column",
          gap: 3,
          // border:"1px solid black",
          p: 5,
          borderRadius: 5,
          bgcolor: "#ffffff",
        }}
      > 
            <IconButton sx={{
        '&:hover': {
          backgroundColor: 'transparent'
        }
      }}>
            <Box
              component="img"
              src={LoginIcon}
              alt="3D Home Icon"
              sx={{
                width: 40,
                height: 40,
              }}
            />
          </IconButton> 
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          
          <Typography variant="h5">Welcome Back to Login</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "50ch",
          }}
        >
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
          
        </Box>

         <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              bgcolor: "#17313E",
              width: "100%",
              fontSize: 20,
              textTransform:"none"
            }}
          >
            <Typography variant="body1" color="initial">Login</Typography>
          </Button> 
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Typography sx={{fontWeight:200}}>Don't have an account ?</Typography>
            <Button
              sx={{ height: 5, textTransform: "none" }}
              onClick={() => navigate("/register")}
            >
              <Typography sx={{ mt: 1.5 }}>Register</Typography>
            </Button>
          </Box>
      </Box>
      
    </Box>
  );
}
