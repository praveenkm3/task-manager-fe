import { api } from "./axios";

export async function login(data: { email: string; password: string }) {
  const response = await api.post("/api/login", data);
  return response?.data;
}
export async function register(data: {
  username: string;
  email: string;
  password: string;
  adminSecretKey: string;
}) {
  const response = await api.post("/api/register", data);
  return response?.data;
}

export async function forgot(email:string){
    const response=await api.post("/api/forgot",{email},{withCredentials:true});
    return response?.data;
}

export async function verifyOtp(data:{uemail:string,otp:string}){
    const response=await api.post("/api/verify-otp",data,{withCredentials:true});
    return response?.data;
}

export async function verifyPassword(data:{uemail:string,password:string}){
    const response=await api.post("/api/change-password",data,{withCredentials:true});
    return response?.data;
}
