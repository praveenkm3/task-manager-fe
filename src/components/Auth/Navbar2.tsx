import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import jiraSvg from "../../../public/assets/jira copy.svg"
import { Divider } from "@mui/material";

export default function Navbar2() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: "#fff", p: 1 }}>
        <Toolbar variant="dense">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box sx={{display:"flex"}}>
            <Box
              component="img"
              src={jiraSvg}
              alt="3D Home Icon"
              sx={{
                width: 40,
                height: 40,
              }}
            />
          <Typography
            noWrap
            component="div"
            sx={{ fontWeight: 500, fontSize: 22, color: "#003049",mt:0.3 }}
          >
             
             Jira Work Management
          </Typography>
          </Box>
          </Box>
        </Toolbar>
      </AppBar>
         <Divider />
    </Box>
  );
}
