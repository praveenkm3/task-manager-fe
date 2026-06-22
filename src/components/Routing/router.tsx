"use client";
import { createBrowserRouter, redirect, replace } from "react-router";

import Register from "../Auth/Register";
import HomeLayout from "../Auth/HomeLayout";
import App from "../../App";
import Login from "../Auth/Login";
import Logout from "../Auth/Logout";
import { UseAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import { Outlet, Navigate } from "react-router";
import axios from "axios";
import { useEffect } from "react";
import Sidebar from "../Sidebar";
import Profile from "../InnerComponents/Profile";
import Tasks from "../InnerComponents/Tasks";
import Calender from "../InnerComponents/Calender";
import Reports from "../InnerComponents/reports";
import Addtask from "../InnerComponents/AddTask";
import SpecificTask from "../InnerComponents/SpecificTask";




export function ProtectedRoute() {
  const navigate = useNavigate();
  const { currentUser,removeUser } = UseAuth();
  if (!currentUser) {
    removeUser();
    return <Navigate to="/login" replace />;
  } else {
    return (
      <Sidebar>
        <Outlet />
      </Sidebar>
    );
  }
}
export function AuthProtectedRoute() {
  const auth = UseAuth();
  async function makeRefresh() {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/refresh",
        {},
        { withCredentials: true },
      );
      console.log(response);
      auth?.setCurrentUser(response.data);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    makeRefresh();
  }, []);

  const { currentUser } = UseAuth();
  if (currentUser) {
    return <Navigate to="/main" replace />;
  } else {
    return <Outlet />;
  }
}

export const router = createBrowserRouter([
  {
    element: <AuthProtectedRoute />,
    children: [
      {
        path: "/",
        Component: HomeLayout,
        children: [
          {
            path: "/register",
            Component: Register,
          },
          {
            path: "/login",
            Component: Login,
          },
        ],
      },
    ],
  },

  {
    Component: ProtectedRoute,
    children: [
      {
        path: "/main",
        Component: App,
      },
      {
        path: "/calender",
        Component: Calender,
      },
      {
        path: "/reports",
        Component: Reports,
      },
      {
        path: "/tasks",
        Component: Tasks,
      },
      {
        path: "/profile",
        Component: Profile,
      },
      {
        path: "/logout",
        Component: Logout,
      },
      {
        path:'/addtask',
        Component:Addtask
      },
      {
        path:"/task/:id",
        Component:SpecificTask
      }
    ],
  },
]);
