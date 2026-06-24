import Chip from "@mui/material/Chip";
import { Random } from "random-js";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
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
export default function SpecificTask() {
  const random = new Random();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const { currentUser } = UseAuth();
  const [flag, setFlag] = useState(false);
  const [radio, setRadio] = useState("TO DO");
  const [data, setData] = useState(null);
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
  const [personName, setPersonName] = useState("");
  const handleSelection = (event) => {
    const { value } = event.target;
    setPersonName(value);
    setData((prev) => ({ ...prev, assigned_user_id: value }));
  };
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
  function handleChange(event) {
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
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 5,
          width: "70ch",
          ml: 10,
        }}
      >
        <TextField
          id="filled-basic"
          label="Title"
          variant="filled"
          placeholder="Enter Task Title"
          name="title"
          value={data?.title || ""}
          onChange={currentUser.role === "admin" && handleChange}
          disabled={!edit}
        />
        <TextField
          id="filled-multiline-static"
          label="Description"
          name="description"
          value={data?.description || ""}
          multiline
          rows={5}
          variant="filled"
          placeholder="Enter Task Description"
          onChange={currentUser.role === "admin" && handleChange}
          disabled={!edit}
        />
        {currentUser.role === "admin" && edit && (
          <FormControl fullWidth variant="filled">
            <InputLabel size="medium" id="demo-multiple-checkbox-label">
              Select Users
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              value={personName}
              onChange={handleSelection}
              MenuProps={MenuProps}
              label="Select Users"
              // defaultValue={data?.assignedUser?.email}
            >
              {users?.map((user) => {
                return (
                  <MenuItem key={user.email} value={user.userId}>
                    <Avatar
                      sx={{
                        mx: 4,
                        bgcolor: `${colorArray[random.integer(0, colorArray.length - 1)]}`,
                      }}
                    >
                      {user.email[0].toUpperCase()}
                    </Avatar>
                    <ListItemText primary={user.email} />
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}
        {currentUser?.role === "user" && (
          <FormControl>
            <FormLabel id={`${id}-label`}>Change Status</FormLabel>
            <RadioGroup
              aria-labelledby={`${id}-label`}
              defaultValue="TO DO"
              name="radio-buttons-group"
              onChange={(event) => setRadio(event.target.value)}
            >
              <FormControlLabel
                value="TO DO"
                control={<Radio />}
                label="TO DO"
              />
              <FormControlLabel
                value="Completed"
                control={<Radio />}
                label="Completed"
              />
              <FormControlLabel
                value="In Progress"
                control={<Radio />}
                label="In Progress"
              />
            </RadioGroup>
          </FormControl>
        )}
        <Box sx={{ display: "flex", gap: 1 }}>
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
                  <Button onClick={handleEdit}>
                    <Chip
                      icon={<EditIcon />}
                      label="Edit"
                      variant="outlined"
                      sx={{ px: 3 }}
                    />
                  </Button>
                  <Button onClick={handleClickOpen}>
                    <Chip
                      icon={<DeleteIcon />}
                      label="Delete"
                      variant="outlined"
                      sx={{ px: 3 }}
                    />
                  </Button>
                </>
              )}
              {edit && (
                <Button onClick={handleAdminSubmit}>
                  <Chip
                    icon={<CheckIcon />}
                    label="Done"
                    sx={{ bgcolor: "#1c1818", px: 4, color: "white" }}
                  />
                </Button>
              )}
            </>
          ) : (
            <Button variant="contained" onClick={handleSubmit}>
              Submit
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
    </>
  );
}
