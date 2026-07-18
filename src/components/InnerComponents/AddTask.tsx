import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Button, FormLabel, IconButton, Typography } from "@mui/material";
import { useEffect, useState, useId } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";
import dayjs from "dayjs";
import {
  type eventType,
  type taskDataType,
  type userDataType,
} from "../../types";
import { type SelectChangeEvent } from "@mui/material/Select";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";


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
  const id = useId();
  const [personName, setPersonName] = useState("");
  const [message, setMessage] = useState("");
  const [flag, setFlag] = useState(false);
  const [dateValue, setDateValue] = useState(dayjs());
  const [priority, setPriority] = useState("Medium");

  const [taskData, setTaskData] = useState<taskDataType>({
    title: "",
    description: "",
    assigned_user_id: undefined,
  });
  const[taskError,setTaskError]=useState({
    titleError:false,
    descriptionError: false,
    assigned_user_idError: false,
  });
  const [users, setUsers] = useState<userDataType[] | null>(null);
  useEffect(() => {
    async function fetchUsersApi() {
      const response=await axios.post('http://localhost:5000/graphql',{
        query:`query{
  fetchUsers {
    email
    isActive
    userName
    userId
    role
  }
}`},{withCredentials:true});
      // console.log(response);
      
      // console.log(response?.data?.data?.fetchUsers);
      setUsers(response?.data?.data?.fetchUsers);
    }
    fetchUsersApi();
  }, []);
  const handleTask = (event: eventType) => {
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
    if (!title?.trim()) { 
      setTaskError((prev)=>({...prev,titleError:true}));
      return;
    }
    if (!description?.trim()) { 
      setTaskError((prev)=>({...prev,descriptionError:true}));
      return;
    }
    if (!assigned_user_id) { 
      setTaskError((prev)=>({...prev,assigned_user_idError:true}));
      return;
    }
    // console.log(taskData, dateValue,priority);
    try {
      const response=await axios.post("http://localhost:5000/graphql",{
        query:`
        mutation($input: AddTaskInput!){
          addTask(input: $input)
        }`,variables:{
          input:{
            title: taskData?.title,
            description: taskData?.description,
            assigned_user_id: taskData?.assigned_user_id,  
            dueDate: dateValue,
            priority: priority,
          }
        }
      },{withCredentials:true})
      // console.log(response);
      if (response?.data?.data.addTask==='Task Created Successfully') {
        console.log("added");
        setMessage("✅ Task added successfully");
        setFlag(true);
      } else {
        setMessage("❌ Task added Unsuccessfully");
        setFlag(true);
        console.log("not added");
      }
    } catch (error) {
      console.log(error);
    }

    setPersonName("");
    setTaskData({
      title: "",
      description: "",
      assigned_user_id: undefined,
    });
    setDateValue(dayjs());
  }
  function handleClear() {
    setPersonName("");
    setTaskData({
      title: "",
      description: "",
      assigned_user_id: undefined,
    });
    setDateValue(dayjs());
  }

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => setFlag(false)}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ml:10
      }}
    >
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "70ch" },
          display: "flex",
          flexDirection: "column",
        }}
        noValidate
        autoComplete="off"
      >
        <FormLabel
          htmlFor="title"
          sx={{ fontWeight: 700, fontSize: "20px", color: "black" }}
        >
          <Typography variant="h5" color="initial">
            Task Title
          </Typography>
        </FormLabel>
        <TextField
          id="title"
          variant="outlined"
          placeholder="Enter Task Title"
          name="title"
          value={taskData?.title}
          onChange={handleTask}
          sx={{ width: "100%" }}
          error={taskData?.title?.trim()?.length>0 ? false : taskError?.titleError}
        />
        <FormLabel
          htmlFor="description"
          sx={{ fontWeight: 700, fontSize: "20px", color: "black" }}
        >
          <Typography variant="h5" color="initial">
            Description
          </Typography>
        </FormLabel>
        <TextField 
        error={taskData?.description?.trim()?.length>0 ? false : taskError?.descriptionError}
          id="description"
          name="description"
          value={taskData?.description}
          multiline
          rows={5}
          variant="outlined"
          placeholder="Enter Task Description"
          onChange={handleTask}
        />
        <Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DesktopDatePicker"]}>
              <DesktopDatePicker
                label="Due Date"
                onChange={(newValue) => setDateValue(newValue)}
                value={dateValue}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Box>
        <Box>
          <FormControl>
            <Typography variant="h5" color="initial">
              Priority
            </Typography>
            <RadioGroup
              aria-labelledby={`${id}-label`}
              defaultValue="Medium"
              name="radio-buttons-group"
              value={priority}
              onChange={(e) => setPriority(e.target?.value)}
            >
              <Box sx={{ display: "flex" }}>
                <FormControlLabel
                  value="Medium"
                  control={<Radio />}
                  label="Medium"
                />
                <FormControlLabel
                  value="High"
                  control={<Radio />}
                  label="High"
                />
                <FormControlLabel value="Low" control={<Radio />} label="Low" />
              </Box>
            </RadioGroup>
          </FormControl>
        </Box>
        <FormLabel
          htmlFor="selectUser"
          sx={{ fontWeight: 700, fontSize: "20px", color: "black" }}
        >
          <Typography variant="h5" color="initial">
            Select User
          </Typography>
        </FormLabel>
        <FormControl fullWidth variant="outlined">
          <InputLabel size="medium" id="selectUser">
            Pick User From Here
          </InputLabel>
          <Select  
          error={taskData?.assigned_user_id ? false : taskError?.assigned_user_idError}
            id="selectUser"
            value={personName}
            onChange={handleChange}
            MenuProps={MenuProps}
            label="Pick User From Here"
          >
            {users?.map((user: userDataType) => {
              return (
                <MenuItem
                  key={user.email}
                  value={user.userId}
                  sx={{ height: "56px" }}
                >
                  <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Avatar sx={{ mr: 2 }}>
                      {user?.email[0].toUpperCase()}
                    </Avatar>
                    <ListItemText primary={user.email} />
                  </Box>
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", justifyContent: "end", gap: 5 }}>
          <Button
            variant="outlined"
            sx={{
              px: 4,
              color: "#'&:hover': { backgroundColor: 'transparent' }",
            }}
            onClick={handleClear}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            sx={{ px: 6, color: "white", bgcolor: "#003049" }}
            onClick={handleSumbit}
          >
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
