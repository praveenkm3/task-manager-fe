import Snackbar from '@mui/material/Snackbar';
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import CloseIcon from '@mui/icons-material/Close';


import { Box, Button, IconButton, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
export default function SpecificTask() {
  const [message, setMessage] = useState("");
  const [flag,setFlag]=useState(false);
  const [radio, setRadio] = useState("pending");
  const [data, setData] = useState(null);
  const { id } = useParams();
  const taskId = parseInt(id as string);
  useEffect(() => {
    async function getOneTask() {
      const response = await axios.get(
        `http://localhost:5000/user/fetch-tasks/${taskId}`,
        { withCredentials: true },
      );
      setData(response.data[0]);
      console.log(response.data);
    }
    getOneTask();
  }, [taskId]);
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
        if(response.status){
          setMessage("✅ Task status changed successfully ")
          setFlag(true);
        }else{
          setMessage("❌ Task status changed Unsuccessfully")
          setFlag(true);
        }
      }
      
      updateTask();
    }
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
        />
        <FormControl>
          <FormLabel id={`${id}-label`}>Change Status</FormLabel>
          <RadioGroup
            aria-labelledby={`${id}-label`}
            defaultValue="TO DO"
            name="radio-buttons-group"
            onChange={(event) => setRadio(event.target.value)}
          >
            <FormControlLabel value="TO DO" control={<Radio />} label="TO DO" />
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
        <Box>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
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
    </>
  );
}
