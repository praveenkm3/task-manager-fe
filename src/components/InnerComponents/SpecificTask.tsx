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
      const response = await axios.get(
        `http://localhost:5000/${currentUser.role}/fetch-tasks/${taskId}`,
        { withCredentials: true },
      );
      setData(response.data[0]);
      console.log(response.data);
    }
    getOneTask();
  }, [taskId, currentUser.role]);
  function handleSubmit() {
    if (radio) {
      async function updateTask() {
        const response = await axios.patch(
          "http://localhost:5000/user/update-task",
          {
            id: taskId,
            status: radio,
          },
          { withCredentials: true },
        );
        // console.log(response.data);
        if (response.status) {
          setMessage("✅ Task status changed successfully ");
          setFlag(true);
        } else {
          setMessage("❌ Task status changed Unsuccessfully");
          setFlag(true);
        }
      }

      updateTask();
    }
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
  const [personName, setPersonName] =
    useState<React.SetStateAction<string | number | undefined>>("");
  const handleSelection = (event: SelectChangeEvent<string>) => {
    const { value } = event.target;
    setPersonName(value);
    setData((prev) => ({ ...prev, assigned_user_id: value }));
  };
  const [users, setUsers] = useState<userDataType | null>(null);
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
  const [edit, setEdit] = useState<boolean>(false);
  function handleEdit() {
    setEdit(true);
    setPersonName(data?.assignedUser?.userId);
  }
  function handleDelete() {
    async function deleteTaskByAdmin() {
      const response = await axios.delete(
        `http://localhost:5000/admin/delete-task`,
        {
          withCredentials: true,
          data: {
            taskId: data?.taskId,
          },
        },
      );
      // console.log(response);
      if (response.status === 200) {
        console.log("added");
        setMessage("✅ Task deleted successfully");
        navigate("/tasks");
        setFlag(true);
      } else {
        setMessage("❌ Task deleted Unsuccessfully");
        setFlag(true);
        console.log("not added");
      }
    }
    deleteTaskByAdmin();
  }
  function handleAdminSubmit() {
    async function updateTaskByAdmin() {
      console.log(data);
      console.log(personName);
      const response = await axios.put(
        "http://localhost:5000/admin/update-task",
        {
          taskId: data?.taskId,
          title: data?.title,
          description: data?.description,
          assigned_user_id: personName,
        },
        { withCredentials: true },
      );
      if (response.status === 201) {
        console.log("added");
        setMessage("✅ Task Updated successfully");
        setFlag(true);
      } else {
        setMessage("❌ Task Updated Unsuccessfully");
        setFlag(true);
        console.log("not added");
      }
      //  console.log(response);
    }
    updateTaskByAdmin();
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
            gap: 3,
            width: "70ch",
          }}
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
            value={data?.title || ""}
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
            htmlFor="description"
            sx={{ fontWeight: 700, fontSize: "20px", color: "black" }}
          >
            <Typography variant="h5" color="initial">
              Description
            </Typography>
          </FormLabel>
          <TextField
            id="description"
            name="description"
            value={data?.description || ""}
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
          {currentUser.role === "admin" && edit && (
            <>
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
            <FormControl sx={{width:"30%",mt:0}}>
              <Typography sx={{color:"black",fontSize:"21px",pb:2}}>Change Status</Typography>
              <RadioGroup 
                // aria-labelledby={`${id}-label`}
                defaultValue="TO DO"
                name="radio-buttons-group"
                onChange={(event) => setRadio(event.target.value)}
                >
                <FormControlLabel
                  value="TO DO"
                  control={<Radio color="secondary"/>}
                  label="TO DO" 
                  />
                <FormControlLabel
                  value="Completed"
                  control={<Radio color="success"/>}
                  label="Completed"
                  />
                <FormControlLabel
                  value="In Progress"
                  control={<Radio color="warning" />}
                  label="In Progress"
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
                          {data?.description}
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
                    onClick={handleAdminSubmit}
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
                        bgcolor: "#a3c08f22",
                        color: "#268924ae",
                        border:"0.5px solid black"
                      }}
                    />
                  </Button>
                )}
              </>
            ) : (
              <Button 
               onClick={handleSubmit}
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
                      label="Submit"
                      variant="filled"
                      sx={{
                        fontSize: "15px",
                        fontWeight: 700,
                        px: 1.5,
                        py: 2.3,
                        bgcolor: "#a3c08f22",
                        color: "#268924ae",
                        border:"0.5px solid black"
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
