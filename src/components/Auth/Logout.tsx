// import axios from "axios";
// import { useEffect } from "react";
// import { UseAuth } from "../../contexts/AuthContext";
// import { useNavigate } from "react-router";
// export default function Logout(){
//     const {removeUser}=UseAuth();
//     const navigate=useNavigate();
//     useEffect(()=>{
//         async function run(){
//             await axios.post('http://localhost:5000/api/logout',{},{withCredentials:true});

//         }
//         run()
//         console.log("logout success");
//         removeUser();
//         navigate('/login');
        
//     },[removeUser,navigate])
//     return(
//         <>
//         </>
//     )
// }