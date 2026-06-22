import { UseAuth } from "../../contexts/AuthContext"
export default function Profile(){
const{currentUser}=UseAuth();
    return(
        <h1>Welcmoe {currentUser.email}</h1>
    )
}