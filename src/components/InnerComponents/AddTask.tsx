import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, FormLabel, IconButton, Typography } from "@mui/material";
import  { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import axios from "axios"; 
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import {type eventType,type taskDataType,type userDataType } from "../../types";
import {type SelectChangeEvent } from "@mui/material/Select";



const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  slotProps: {
    paper: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  },
};

export default function Addtask() {
  const [personName, setPersonName] = useState("");
  const [message, setMessage] = useState("");
  const [flag,setFlag]=useState(false);
  const [taskData, setTaskData] = useState<taskDataType>({
    title: "",
    description: "",
    assigned_user_id: undefined,
  });

  const [users, setUsers] = useState<userDataType[] | null >(null);
  useEffect(() => {
    async function fetchUsers() {
      const response = await axios.get(
        "http://localhost:5000/admin/fetch-users",
        { withCredentials: true },
      );
      setUsers(response.data);
    }
    fetchUsers();
  }, []);
  const handleTask = (event:eventType) => {
    const { name, value } = event.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };
  const handleChange = (event: SelectChangeEvent<string>) => {
    const { value } = event.target;
    setPersonName(value);
    setTaskData((prev) => ({ ...prev, assigned_user_id: value }));
  };
  async function handleSumbit() {
    const { title, description, assigned_user_id } = taskData;
    if (!title || !description || !assigned_user_id) {
      return alert("eneter details");
    }
    console.log(taskData);
    try {
      const response = await axios.post(
        "http://localhost:5000/admin/add-task",
        {
          ...taskData,
        },
        { withCredentials: true },
      );
      if (response.status === 201) {
        console.log("added");
        setMessage("✅ Task added successfully");
        setFlag(true);
      } else {
        setMessage("❌ Task added Unsuccessfully");
        setFlag(true);
        console.log("not added");
      }
      //   console.log(response);
    } catch (error) {
      console.log(error);
    }

    setPersonName("");
    setTaskData({
      title: "",
      description: "",
      assigned_user_id: undefined,
    });
  }
function handleClear(){
  setPersonName("");
  setTaskData({
      title: "",
      description: "",
      assigned_user_id: undefined,
    });

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
    <Box sx={{display:"flex",justifyContent:"center",alignItems:"center",width:"100%",height:"70vh"}}>
      <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "70ch" },
        display: "flex",
        flexDirection: "column"
      }}
      noValidate
      autoComplete="off"
    >
      
        <FormLabel htmlFor="title" sx={{fontWeight:700,fontSize:"20px",color:"black"}}>
        <Typography variant="h5" color="initial">Task Title</Typography>
        </FormLabel>
        <TextField
        id="title"
        variant="outlined"
        placeholder="Enter Task Title"
        name="title"
        value={taskData?.title}
        onChange={handleTask}
        sx={{width:"100%"}}
      /> 
      <FormLabel htmlFor="description" sx={{fontWeight:700,fontSize:"20px",color:"black"}}>
        <Typography variant="h5" color="initial">Description</Typography>
        </FormLabel>
      <TextField
        id="description" 
        name="description"
        value={taskData?.description}
        multiline
        rows={5}
        variant="outlined"
        placeholder="Enter Task Description"
        onChange={handleTask}
      />
      <FormLabel htmlFor="selectUser" sx={{fontWeight:700,fontSize:"20px",color:"black"}}>
        <Typography variant="h5" color="initial">Select User</Typography>
        </FormLabel>
      <FormControl fullWidth variant="outlined">
        <InputLabel size="medium" id="selectUser">
          Pick User From Here
        </InputLabel>
        <Select  
          id="selectUser"
          value={personName}
          onChange={handleChange}
          MenuProps={MenuProps}
          label="Pick User From Here" 
        >
          {users?.map((user:userDataType) => {
            return (
              <MenuItem key={user.email} value={user.userId} sx={{height:"56px"}}  >
                <Box sx={{display:"flex",flexDirection:"row"}}>
                  <Avatar sx={{mr:2}}>{user?.email[0].toUpperCase()}</Avatar>
                <ListItemText primary={user.email} />
                </Box>
                
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <Box sx={{ display: "flex", justifyContent: "end",gap:5 }}>
        
        <Button variant="outlined" sx={{ px: 4,color:"#'&:hover': { backgroundColor: 'transparent' }"}} onClick={handleClear} >
          Clear
        </Button>
        <Button variant="contained" sx={{ px: 6,color:"white",bgcolor:"#003049"  }} onClick={handleSumbit}>
          Assign Task
        </Button>
      </Box>
      <Box>
        <Snackbar
          open={flag}
          autoHideDuration={3000}
          message={message}
          action={action}
          onClose={() => setFlag(false)}
        />
      </Box>
    </Box>
    </Box>
  );
}


 