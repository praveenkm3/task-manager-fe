import { UseAuth } from "../../contexts/AuthContext";



export default function Profile(){
const{currentUser}=UseAuth();
    return(
        <h1>Welcome {currentUser.email}</h1>
    )
}