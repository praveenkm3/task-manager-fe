import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import axios from "axios"; 
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';





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
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    assigned_user_id: undefined,
  });

  const [users, setUsers] = useState(null);
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
  const handleTask = (event) => {
    const { name, value } = event.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };
  const handleChange = (event) => {
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
      console.log(error?.message);
    }

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
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "70ch" },
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="filled-basic"
        label="Title"
        variant="filled"
        placeholder="Enter Task Title"
        name="title"
        value={taskData?.title}
        onChange={handleTask}
      />
      <TextField
        id="filled-multiline-static"
        label="Description"
        name="description"
        value={taskData?.description}
        multiline
        rows={5}
        variant="filled"
        placeholder="Enter Task Description"
        onChange={handleTask}
      />
      <FormControl fullWidth variant="filled">
        <InputLabel size="medium" id="demo-multiple-checkbox-label">
          Select Users
        </InputLabel>
        <Select 
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          value={personName}
          onChange={handleChange}
          MenuProps={MenuProps}
          label="Select Users"
          
        >
          {users?.map((user) => {
            return (
              <MenuItem key={user.email} value={user.userId}>
                <Avatar sx={{mx:4}}>{user.email[0].toUpperCase()}</Avatar>
                <ListItemText primary={user.email} />
                
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button variant="contained" sx={{ px: 10 }} onClick={handleSumbit}>
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
  );
}
