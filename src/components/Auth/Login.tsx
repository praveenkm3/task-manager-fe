import { Box, TextField, Button, IconButton } from "@mui/material";
import { type register } from "../../types";
import { useState } from "react"; 
import { Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { UseAuth } from "../../contexts/AuthContext";
import LoginIcon from "../../../public/assets/Login copy.png";
import { useLogin } from "../../reactQuery/hooks/authHooks";
export default function Login() {
  const { currentUser, setCurrentUser } = UseAuth()!;
  const {mutate}=useLogin();
  if (currentUser) {
    console.log(currentUser);
  }
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState<register | null>(null); 
  const [error, setError] = useState({
    emailError: false,
    passwordError: false,
  });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    const { name, value } = event.target;
    setRegisterData({ ...registerData, [name]: value });
  }

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
    mutate({
      email:registerData?.email?.toLocaleLowerCase(),
      password:registerData?.password,
    },{
      onSuccess:(data)=>{
        setCurrentUser({
          role:data.role,
          email:data.email,
        });
      navigate('/main');
      },
      onError:()=>{
        navigate("/login");
      }
    }) 
    setError({ emailError: false, passwordError: false });
  }
  function handleForgot(){
    navigate('/forgot');
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
        backgroundColor: "#f8f8f8fe",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          flexDirection: "column",
          gap: 1,
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
        <Box sx={{display:"flex",justifyContent:"end"}}>
            <Button sx={{textTransform: "none"}} onClick={handleForgot}>Forgot Password</Button>
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
