import Chip from "@mui/material/Chip";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Typography, type SelectChangeEvent } from "@mui/material";
import { type createTaskDataType, type userDataType } from "../../types";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

import React from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { UseAuth } from "../../contexts/AuthContext";
import dayjs from "dayjs";

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

export default function SpecificTask() {
  const [dateValue, setDateValue] = useState(dayjs());
  const [priority, setPriority] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const { currentUser } = UseAuth();
  const [flag, setFlag] = useState(false);
  const [radio, setRadio] = useState("TO DO");
  const [data, setData] = useState<createTaskDataType | null>(null);
  const { id } = useParams();
  const taskId = parseInt(id as string);
  useEffect(() => {
    async function getOneTask() {
      const response2 = await axios.post(
        "http://localhost:5000/graphql",
        {
          query: `query($taskId: Int!){
  getOneTask(taskId: $taskId) {
    admins_email
    tasks_description
    tasks_dueDate
    tasks_priority
    tasks_status
    tasks_taskId
    tasks_title
    users_email
    admins_userid
    users_userid
  }
}`,
          variables: {
            taskId: taskId,
          },
        },
        { withCredentials: true },
      );
      // console.log(response2?.data?.data.getOneTask[0]);
      setData(response2?.data?.data.getOneTask[0]);
    }
    getOneTask();
  }, [taskId, currentUser.role]);
  useEffect(() => {
    if (data?.tasks_priority) {
      setPriority(data?.tasks_priority);
    }
    if (data?.tasks_status) { 
      setRadio(data?.tasks_status);
    }
    if (data?.tasks_dueDate) {
      setDateValue(dayjs(data?.tasks_dueDate));
    }
  }, [data?.tasks_taskId]);

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
  const [personName, setPersonName] =
    useState<React.SetStateAction<string | number | undefined>>(0);
  const handleSelection = (event: SelectChangeEvent<string>) => {
    const { value } = event.target;
    setPersonName(value);
    setData((prev) => ({ ...prev, users_userid: value }));
  };
  const [users, setUsers] = useState<userDataType | null>(null);
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
    if(currentUser?.role==='admin'){
      fetchUsersApi();
    }
  }, [currentUser.role]);
  const [edit, setEdit] = useState<boolean>(false);
  function handleEdit() {
    setEdit(true);
    setPersonName(data?.users_userid);
  }
  function handleDelete() {

    async function deleteTaskByAdmin() {
      const response=await axios.post('http://localhost:5000/graphql',{
        query:`
            mutation($taskId: Int!){
                  deleteTask(taskId: $taskId)
            }
        `,
        variables:{
          taskId:data?.tasks_taskId
        }
      },{withCredentials:true})
      // console.log(response);
      if (response?.data?.data?.deleteTask==='Task Deleted Successfully') {
        console.log("deleted");
        setMessage("✅ Task deleted successfully");
        navigate("/tasks");
        setFlag(true);
      } else {
        setMessage("❌ Task deleted Unsuccessfully");
        setFlag(true);
        console.log("not deleted");
      }
      
      
    }
    deleteTaskByAdmin();
  }
  function handleUpdate() {
    async function updateTask() {
      // console.log(data);
      // console.log(personName);
      const res2 = await axios.post(
        "http://localhost:5000/graphql",
        {
          query: `
      mutation($input: UpdateTaskInput!) {
  updateTask(input: $input)
}
    `,
          variables: {
            input: {
              taskId: data?.tasks_taskId,
              title: data?.tasks_title,
              description: data?.tasks_description,
              assigned_user_id: personName,
              duedate: dateValue,
              priority: priority,
              status: radio,
            },
          },
        },
        { withCredentials: true },
      );
      // console.log(res2?.data?.data?.updateTask);
      if (res2?.data?.data?.updateTask === "Update Success") {
        setMessage("✅ Task Updated successfully");
        setFlag(true);
      } else {
        setMessage("❌ Task Updated Unsuccessfully");
        setFlag(true);
        console.log("not added");
      }
    }
    updateTask();
  }
  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = event.target; 
    setData((prev) => ({ ...prev, [name]: value }));
    // console.log("inside handle change ");
  }

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "70ch",
          }}
        >
          <FormLabel
            htmlFor="tasks_title"
            sx={{ fontWeight: 700, fontSize: "20px", color: "black" }}
          >
            <Typography variant="h5" color="initial">
              Task Title
            </Typography>
          </FormLabel>
          <TextField
            id="tasks_title"
            variant="outlined"
            placeholder="Enter Task Title"
            name="tasks_title"
            value={data?.tasks_title || ""}
            onChange={currentUser.role === "admin" && handleChange}
            disabled={!edit}
            sx={{
              width: "100%",
              "& .MuiInputBase-root": {
                borderRadius: "12px",
              },
            }}
          />
          <FormLabel
            htmlFor="tasks_description"
            sx={{ fontWeight: 700, fontSize: "20px", color: "black" }}
          >
            <Typography variant="h5" color="initial">
              Description
            </Typography>
          </FormLabel>
          <TextField
            id="tasks_description"
            name="tasks_description"
            value={data?.tasks_description || ""}
            multiline
            rows={5}
            variant="outlined"
            placeholder="Enter Task Description"
            onChange={currentUser.role === "admin" && handleChange}
            disabled={!edit}
            sx={{
              "& .MuiInputBase-root": {
                borderRadius: "12px",
              },
            }}
            size="small"
          />

          <Box></Box>
          {currentUser.role === "admin" && edit && (
            <>
              <>
              <FormControl sx={{ mb: 0 }} disabled={!edit}>
                <Typography sx={{ color: "black", fontSize: "21px"}}>
                  Change Status
                </Typography>
                <RadioGroup
                  value={radio}
                  name="radio-buttons-group"
                  onChange={(event) => setRadio(event.target.value)} 
                >
                  <Box sx={{display:"flex"}}>
                    <FormControlLabel
                    value="TO DO"
                    control={<Radio color="secondary" />}
                    label="TO DO"
                    sx={{width:100}}
                  />
                  <FormControlLabel
                    value="Completed"
                    control={<Radio color="success" />}
                    label="Completed"
                    sx={{width:150}}
                  />
                  <FormControlLabel
                    value="In Progress"
                    control={<Radio color="warning" />}
                    label="In Progress"
                    sx={{width:150}}
                  />
                  <FormControlLabel
                    value="On Hold"
                    control={<Radio color="error" />}
                    label="On Hold"
                    sx={{width:150}}
                  />
                  </Box>
                </RadioGroup>
              </FormControl>
              </>
              <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DesktopDatePicker"]}>
                    <DesktopDatePicker
                      label="Due Date"
                      disabled={!edit}
                      onChange={(newValue) => setDateValue(newValue!)}
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
              <Typography variant="h5" color="initial" sx={{}}>Priority</Typography>
               <RadioGroup
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                sx={{ display: "flex", flexDirection: "row" }}
              >
                <FormControlLabel value="Low" control={<Radio />} label="Low" />
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
              </RadioGroup>
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
                  id="selectUser"
                  value={personName}
                  onChange={handleSelection}
                  MenuProps={MenuProps}
                  label="Pick User From Here"
                  size="small"
                  sx={{ borderRadius: 3 }}
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
            </>
          )}
          {currentUser?.role === "user" && (
            <>
              <FormControl sx={{ width: "30%", mt: 0 }} >
                <Typography sx={{ color: "black", fontSize: "21px", pb: 2 }}>
                  Change Status
                </Typography>
                <RadioGroup
                  value={radio}
                  name="radio-buttons-group"
                  onChange={(event) => setRadio(event.target.value)}
                >
                  <FormControlLabel
                    value="TO DO"
                    control={<Radio color="secondary" />}
                    label="TO DO"
                  />
                  <FormControlLabel
                    value="Completed"
                    control={<Radio color="success" />}
                    label="Completed"
                  />
                  <FormControlLabel
                    value="In Progress"
                    control={<Radio color="warning" />}
                    label="In Progress"
                  />
                  <FormControlLabel
                    value="On Hold"
                    control={<Radio color="error" />}
                    label="On Hold"
                  />
                </RadioGroup>
              </FormControl>
            </>
          )}
          <Box sx={{ display: "flex", gap: 1, justifyContent: "end" }}>
            {currentUser?.role === "admin" ? (
              <>
                {!edit && (
                  <>
                    <Dialog
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                      role="alertdialog"
                    >
                      <DialogTitle id="alert-dialog-title">
                        {"Are You Sure to Delete This Task ? "}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          {data?.tasks_description}
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={handleClose}
                          autoFocus
                          sx={{ bgcolor: "black", color: "white" }}
                        >
                          No
                        </Button>
                        <Button
                          onClick={handleDelete}
                          sx={{ bgcolor: "red", color: "white" }}
                        >
                          Yes
                        </Button>
                      </DialogActions>
                    </Dialog>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        onClick={handleEdit}
                        variant="outlined"
                        sx={{ border: "0.4px solid black" }}
                      >
                        <EditIcon sx={{ color: "#003049" }} />
                      </Button>
                      <Button
                        onClick={handleClickOpen}
                        variant="outlined"
                        sx={{ border: "0.4px solid black" }}
                      >
                        <DeleteIcon sx={{ color: "#003049" }} />
                      </Button>
                    </Box>
                  </>
                )}
                {edit && (
                  <Button
                    onClick={handleUpdate}
                    sx={{
                      "&:hover": {
                        background: "none",
                      },
                    }}
                  >
                    <Chip
                      icon={
                        <TaskAltIcon
                          sx={{ color: "#FFFFFF", fontSize: "27px" }}
                        />
                      }
                      label="Done"
                      variant="filled"
                      sx={{
                        fontSize: "15px",
                        fontWeight: 700,
                        px: 1.5,
                        py: 2.3,
                        bgcolor: "#bcc2d522",
                        color: "#0c0725bc",
                        border: "0.5px solid black",
                      }}
                    />
                  </Button>
                )}
              </>
            ) : (
              <Button
                onClick={handleUpdate}
                sx={{
                  "&:hover": {
                    background: "none",
                  },
                }}
              >
                <Chip
                  icon={
                    <TaskAltIcon sx={{ color: "#FFFFFF", fontSize: "27px" }} />
                  }
                  label="Submit"
                  variant="filled"
                  sx={{
                    fontSize: "15px",
                    fontWeight: 700,
                    px: 1.5,
                    py: 2.3,
                    bgcolor: "#a3c08f22",
                    color: "#268924ae",
                    border: "0.5px solid black",
                  }}
                />
              </Button>
            )}
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
    </>
  );
}
