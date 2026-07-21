import { Box, CircularProgress } from "@mui/material";

export default function Spinner(){
    return(
        <>
        <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center", 
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          p: 3,
          borderRadius: 2, 
          backgroundColor: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    </Box></>
    )
}