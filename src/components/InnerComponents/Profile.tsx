import { UseAuth } from "../../contexts/AuthContext";
import { Box, Typography, Avatar, Paper } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceIcon from "@mui/icons-material/Place";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import { Random } from "random-js";
const colorArray = [
  "#FFD400",
  "#39B1D1",
  "#4647AE",
  "#659287",
  "#6FD1D7",
  "#4B4038",
  "#ACCFA3",
  "#FF653F",
  "#1E104E",
];
export default function Profile() {
  const random = new Random();
  const { currentUser } = UseAuth()!;
  const [profiles, setProfiles] = useState([]);
  const role = currentUser?.role;
  useEffect(() => {
    async function runner() {
      const response = await axios.post(
        `http://localhost:5000/graphql`,
        {
          query: `query{
  fetchUserAndAdminStatuses {
    email
    status
    totalTasks
  }
}`,
        },
        { withCredentials: true },
      );
      setProfiles(response?.data?.data?.fetchUserAndAdminStatuses);
    }
    runner();
  }, [currentUser, role]);

  // console.log(profiles);
  const groupedData = Object.values(
    profiles.reduce((acc, current) => {
      const email = current.email;
      // console.log(current);

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
  // console.log(groupedData);
  const statusOrder = ["TO DO", "In Progress", "On Hold", "Completed"];

  groupedData.forEach((user) => {
    user.statuses.sort(
      (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status),
    );
  });

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
                {currentUser?.email.toUpperCase()}
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
                  sx={{ height: 210, width: 250, borderRadius: 2 }}
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
                            color: "white",
                            bgcolor: `${colorArray[random.integer(0, colorArray.length - 1)]}`,
                          }}
                        >
                          {current?.user[0]?.toUpperCase()}
                        </Avatar>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: "15px", mt: 0.5 }}>
                          {current?.user[0].toUpperCase() +
                            current?.user?.slice(1)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                       <Box sx={{display:'flex',justifyContent:'space-between',gap:1,flexWrap:'wrap'}}>
                      {current?.statuses?.map((item, index) => {
                        return (
                          <Box key={index}>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 2,
                              }}
                            >
                              <Box sx={{ display: "flex",mt:2 }}>
                                <Box
                                  sx={{

                                    borderRadius:1,
                                    fontSize: "12px",
                                    bgcolor:
                                      item?.status === "In Progress"
                                        ? "#98baee34"
                                        : item?.status === "TO DO"
                                        ? "#7a7b7e29"
                                        : item?.status === "Completed"
                                        ? "#bed1b769"
                                        : "#f9adad1d",

                                    color:
                                      item?.status === "TO DO"
                                        ? "#2a2929"
                                        : item?.status === "On Hold"
                                        ? "#f66868"
                                        : item?.status === "In Progress"
                                        ? "#1591DC"
                                        : "green",
                                  }}
                                >
                                 <Box sx={{minWidth:'50px',display:'flex',flexDirection:'row',gap:2,padding:1,}}>
                                  <Typography variant="p" color="initial" >
                                    {item?.status[0].toUpperCase() +
                                    item?.status?.slice(1)}
                                  </Typography>
                                   <Box sx={{ fontSize: "12px", fontWeight: 700 }}>
                                  {item?.totalTasks}
                                </Box>
                                </Box>
                                  
                                </Box>
                               
                                
                              </Box>
                              
                            </Box>
                            
                          </Box>
                          
                        );

                      })}
                      </Box>
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
};
