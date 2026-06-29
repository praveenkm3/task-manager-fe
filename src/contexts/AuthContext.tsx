import { useState,createContext,useContext} from "react";
import { type childProviderProps,type CurrentuserType,type UserContextType } from "../types";

export const AuthContext=createContext<UserContextType | null>(null);


export default function AuthProvider({children}:childProviderProps){
    // const[currentUser,setCurrentUser]=useState(null);
    const[currentUser,setCurrentUser]=useState<null | CurrentuserType>(null)
     
    function removeUser():void{
        setCurrentUser(null);
    }
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