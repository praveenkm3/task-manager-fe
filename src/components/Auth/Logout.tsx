import axios from "axios";
import { useEffect } from "react";
import { UseAuth } from "../../contexts/AuthContext";
export default function Logout(){
    const {removeUser}=UseAuth();
    useEffect(()=>{
        async function run(){
            const response=await axios.post('http://localhost:5000/api/logout',{},{withCredentials:true});
            console.log(response);
        }
        run()
        console.log("logout success");
        removeUser();
        
    },[])
    return(
        <>
        </>
    )
}