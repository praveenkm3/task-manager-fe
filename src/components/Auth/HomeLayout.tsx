import { Outlet } from "react-router";
import Navbar2 from "./Navbar2"; 

export default function HomeLayout(){
    return(
        <>
        <Navbar2/>
        <Outlet/>
        </>
    )
}

