import { useMutation } from "@tanstack/react-query";
import {
  login,
  register,
  forgot,
  verifyOtp,
  verifyPassword,
  logout
} from "../../api/authAPI";

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};
export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  });
};
export const useForgot = () => {
  return useMutation({
    mutationFn: forgot,
  });
};
export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: verifyOtp,
  });
};
export const useVerifyPassword = () => {
  return useMutation({
    mutationFn: verifyPassword,
  });
};
export const useLogout = () => {
  return useMutation({ 
    mutationFn:logout
  });
};
