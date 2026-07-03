import { UseAuth } from "../../contexts/AuthContext";
import { Box, Typography, Avatar } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceIcon from '@mui/icons-material/Place';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

export default function Profile() {
  const { currentUser } = UseAuth();
  const [profiles, setProfiles] = useState([]);
  const role = currentUser?.role;
  useEffect(() => {
    let prefix = "";
    if (role === "admin") {
      prefix = "user";
    } else if (role == "user") {
      prefix = "admin";
    }
    async function runner() {
      const response = await axios.get(
        `http://localhost:5000/${role}/fetch-tasks-${prefix}`,
        { withCredentials: true },
      );
      setProfiles(response.data);
    }
    runner();
  }, [currentUser, role]);
  //   let role=currentUser?.role;
  let value = "";
  if (role === "admin") {
    value = "assignedUser_email";
  } else {
    value = "createdUser_email";
  }
  // console.log(profiles);
  const users = [...new Set(profiles.map((item) => item[value].toUpperCase()))];
  let total = 0;
  let progress=0;
  let completed=0;
  let pending=0;
  let todo=0;
  for (let ele of profiles) {
    let value = parseInt(ele?.totalTasks);
    if(ele.task_status==='In Progress'){
        progress+=value;
    }else if(ele.task_status==="Completed"){
        completed+=value;
    }else if(ele.task_status==="TO DO"){
        todo+=value;
    }else if(ele.task_status==="pending"){
        pending+=value;
    }
     
  }
 total=progress+completed+pending+todo;
  return (
    <>
      <Box sx={{display:"flex",justifyContent:"center",alignItems:"center",mt:5}}> 
        <Box sx={{ boxShadow: 5, height: 600, width: 800 }}>
        <Box sx={{ display: "flex",gap:1, px: 5, py: 3,boxShadow:4 }}>
          <Avatar sx={{ bgcolor: deepPurple[500] }}>
            {currentUser?.email[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography sx={{ mt: 1.5 ,fontWeight:700,fontSize:"13px"}}>
              {currentUser.email.toUpperCase()}
            </Typography>
          </Box>
          
            <Box>
                {
                    role==='admin' ? 
                    <Typography sx={{fontSize:"10px",color:"green",p:0.5,borderRadius:2,bgcolor:"#8aeda340"}}>Admin</Typography>
                :
                <Typography sx={{fontSize:"10px",color:"#0303ff",p:0.5,borderRadius:2,bgcolor:"#7676e328"}}>Member</Typography>
                }
            </Box>
            
            <Box sx={{ml:43,display:"flex",flexDirection:"column",gap:2}}>
                <Box sx={{display:"flex",gap:0.6}}>
                    <PlaceIcon sx={{fontSize:15}}/>
                <Typography sx={{fontSize:12}}>Ind,Banglore</Typography>
                </Box>
                <Box sx={{display:"flex",gap:0.6}}>
                    <LocalPhoneIcon sx={{fontSize:15}}/>
                <Typography sx={{fontSize:12}}>+91 987654320</Typography>
                </Box>
            </Box>
        </Box>
        <Box sx={{ display: "flex",px:5 }}>
          {currentUser?.role === "admin" ? (
            <Typography sx={{ fontWeight: 600 ,py:2}}>Team Members</Typography>
          ) : (
            <Typography sx={{ fontWeight: 600 ,py:2}}>Assigned Admins</Typography>
          )}
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 0.5,
            px:5
          }}
        >
          {users?.map((user) => {
            return (
              <Box sx={{display:"flex",gap:0.7}} key={user}>
                <Avatar sx={{fontSize:"12px",height:30,width:30,color:"black"}}>
                  {user[0].toUpperCase()}
                </Avatar>
                <Typography sx={{ fontSize: "12px" ,mt:1}}>{user}</Typography>
              </Box>
            );
          })}
        </Box>
        
        <Box sx={{display:"flex",flexDirection:"column",gap:1.5,mt:4,px:5}}>
            <Typography sx={{fontWeight:700}}>Task Summary</Typography>
            <Typography sx={{fontSize:"12px"}}>IN PROGRESS <span style={{marginLeft:20,fontSize:15,fontWeight:700}}>{progress}</span> </Typography>
            <Typography sx={{fontSize:"12px"}}>PENDING <span style={{marginLeft:50,fontSize:15,fontWeight:700}}>{pending}</span> </Typography>
            <Typography sx={{fontSize:"12px"}}>TO DO <span style={{marginLeft:67,fontSize:15,fontWeight:700}}>{todo}</span> </Typography>
            <Typography sx={{fontSize:"12px"}}>COMPLETED <span style={{marginLeft:30,fontSize:15,fontWeight:700}}> {completed}</span> </Typography>  

        </Box>
      </Box>
      </Box>
    </>
  );
}
