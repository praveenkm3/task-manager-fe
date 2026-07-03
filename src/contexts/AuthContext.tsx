import { useState,createContext,useContext,useEffect} from "react";
import { type childProviderProps,type CurrentuserType,type UserContextType } from "../types";
import axios from "axios";
export const AuthContext=createContext<UserContextType | null>(null);


export default function AuthProvider({children}:childProviderProps){
    // const[currentUser,setCurrentUser]=useState(null);
    const[currentUser,setCurrentUser]=useState<null | CurrentuserType>(null)
     
    function removeUser():void{
        setCurrentUser(null);
    }
    useEffect(() => {
    async function makeRefresh() {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/refresh",
        {},
        { withCredentials: true },
      );
      // console.log(response);
      setCurrentUser(response.data);
    } catch (err) {
      console.log(err);
    }
  }
    makeRefresh();
  }, []);

    return(
        <>
        <AuthContext.Provider value={{currentUser,setCurrentUser,removeUser}}>
            {children}
        </AuthContext.Provider>
        </>
    )

}
export function UseAuth() {
  return useContext(AuthContext);
}