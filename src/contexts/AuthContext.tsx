import { useState,createContext,useContext } from "react";


export const AuthContext=createContext(null);

export default function AuthProvider({children}){
    const[currentUser,setCurrentUser]=useState(null);
     
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