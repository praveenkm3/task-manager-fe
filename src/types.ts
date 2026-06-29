import { type ReactNode } from "react";

export type flag = boolean;

export interface register {
  username?: string;
  password?: string;
  email?: string;
  adminSecretKey?: number;
}

export type childProviderProps = {
  children: ReactNode;
};
export type CurrentuserType = {
  email?: string;
  exp?: number;
  iat?: number;
  role?: string;
  userId?: number;
};


//using in Addtask.tsx,
export interface UserContextType {
  currentUser: CurrentuserType | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentuserType | null>>;
  removeUser: () => void;
}

export type eventType = React.ChangeEvent<HTMLInputElement>;



export type taskDataType = {
  title?: string;
  description?: string;
  assigned_user_id?: string | undefined | number;
};
 
export type userDataType = {
    userId:number |string,
    userName:string,
    email:string,
    password?:string,
    role:string,
    isActive:boolean
}; 

//specific task

export type createTaskDataType={
    title?:string,
    description?:string,
    status?: string,
    assignedUser?:userDataType,
    
}
 