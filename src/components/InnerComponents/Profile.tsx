import { UseAuth } from "../../contexts/AuthContext";
import { Box, Typography, Avatar, Paper, Badge, Chip } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceIcon from "@mui/icons-material/Place";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";

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
 
  
// console.log(profiles);
  const groupedData = Object.values(
    profiles.reduce((acc, current) => {
      const email = current.email;
      console.log(current);

      if (!acc[email]) {
        acc[email] = { user: email, statuses: [] };
      }

      acc[email].statuses.push({
        status: current.status,
        totalTasks: parseInt(current.totalTasks),
      });

      return acc;
    }, {}),
  );
  console.log(groupedData);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          
        }}
      >
        <Box sx={{ boxShadow: 5, height: "100vh", width: "100%" }}>
          <Box sx={{ display: "flex", gap: 1, px: 5, py: 3, boxShadow: 4 }}>
            <Avatar sx={{ bgcolor: deepPurple[500] }}>
              {currentUser?.email[0].toUpperCase()}
            </Avatar>
            <Box>
              <Typography sx={{ mt: 1.5, fontWeight: 700, fontSize: "13px" }}>
                {currentUser.email.toUpperCase()}
              </Typography>
            </Box>

            <Box>
              {role === "admin" ? (
                <Typography
                  sx={{
                    fontSize: "10px",
                    color: "green",
                    p: 0.5,
                    borderRadius: 2,
                    bgcolor: "#8aeda340",
                  }}
                >
                  Admin
                </Typography>
              ) : (
                <Typography
                  sx={{
                    fontSize: "10px",
                    color: "#0303ff",
                    p: 0.5,
                    borderRadius: 2,
                    bgcolor: "#7676e328",
                  }}
                >
                  Member
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                ml: 43,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                marginLeft: 120,
              }}
            >
              <Box sx={{ display: "flex", gap: 0.6 }}>
                <PlaceIcon sx={{ fontSize: 15 }} />
                <Typography sx={{ fontSize: 12 }}>Ind,Banglore</Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 0.6 }}>
                <LocalPhoneIcon sx={{ fontSize: 15 }} />
                <Typography sx={{ fontSize: 12 }}>+91 987654320</Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: "flex", px: 5 }}>
            {currentUser?.role === "admin" ? (
              <Typography sx={{ fontWeight: 600, py: 2 }}>
                Team Members
              </Typography>
            ) : (
              <Typography sx={{ fontWeight: 600, py: 2 }}>
                Assigned Admins
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 2,
              px: 5,
            }}
          >
            {groupedData?.map((current, index) => {
              return (
                <Paper
                  elevation={5}
                  sx={{ height: 250, width: 220, borderRadius: 2 }}
                  key={index}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: 0.7,
                      p: 3,
                      flexDirection: "column",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Box>
                        <Avatar
                          sx={{
                            fontSize: "15px",
                            height: 30,
                            width: 30,
                            color: "black",
                          }}
                        >
                          {current?.user[0]?.toUpperCase()}
                        </Avatar>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: "15px", mt: 0.5 }}>
                          {current?.user[0].toUpperCase()+current?.user?.slice(1)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      {current?.statuses?.map((item) => {
                        return (
                          <>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                              }}
                            >
                              <Box sx={{ display: "flex" }}>
                                <Badge
                                  badgeContent={item?.totalTasks}
                                  color={
                                    item?.status === "TO DO"
                                      ? "info"
                                      : item?.status === "pending"
                                      ? "error"
                                      : item?.status === "In Progress"
                                      ? "warning"
                                      : "success"
                                  }
                                  overlap="circular" 
                                >
                                  <Chip
                                    label={item?.status[0].toUpperCase()+item?.status?.slice(1)}
                                    variant="outlined"
                                    sx={{ m: 0.5 }}
                                  />
                                </Badge>
                              </Box>
                            </Box>
                          </>
                        );
                      })}
                    </Box>
                  </Box>
                </Paper>
              );
            })}
          </Box>
        </Box>
      </Box>
    </>
  );
}
{
  /* <Box sx={{display:"flex",flexDirection:"column",gap:1.5,mt:4,px:5}}>
            <Typography sx={{fontWeight:700}}>Task Summary</Typography>
            <Typography sx={{fontSize:"12px"}}>IN PROGRESS <span style={{marginLeft:20,fontSize:15,fontWeight:700}}>{progress}</span> </Typography>
            <Typography sx={{fontSize:"12px"}}>PENDING <span style={{marginLeft:50,fontSize:15,fontWeight:700}}>{pending}</span> </Typography>
            <Typography sx={{fontSize:"12px"}}>TO DO <span style={{marginLeft:67,fontSize:15,fontWeight:700}}>{todo}</span> </Typography>
            <Typography sx={{fontSize:"12px"}}>COMPLETED <span style={{marginLeft:30,fontSize:15,fontWeight:700}}> {completed}</span> </Typography>  

        </Box> */
}

// {users?.map((user) => {
//     return (
//       <Box sx={{display:"flex",gap:0.7}} key={user}>
//         <Avatar sx={{fontSize:"12px",height:30,width:30,color:"black"}}>
//           {user[0].toUpperCase()}
//         </Avatar>
//         <Typography sx={{ fontSize: "12px" ,mt:1}}>{user}</Typography>
//       </Box>
//     );
//   })}
