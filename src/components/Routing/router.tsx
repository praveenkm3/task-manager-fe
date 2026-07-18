import { createBrowserRouter } from "react-router";
import Register from "../Auth/Register";
import HomeLayout from "../Auth/HomeLayout";
import App from "../../App";
import Login from "../Auth/Login";
import { UseAuth } from "../../contexts/AuthContext";
import { Outlet, Navigate } from "react-router";
import Sidebar from "../Sidebar";
import Profile from "../InnerComponents/Profile"; 
import Calender from "../InnerComponents/Calender";
import Reports from "../InnerComponents/Reports";
import Addtask from "../InnerComponents/AddTask";
import SpecificTask from "../InnerComponents/SpecificTask";
import DisplyTasks from "../InnerComponents/DisplayTasks";
import ForgotPassword from "../Auth/ForgotPassword";
import VerifyOtp from "../Auth/VerifyOtp";


export function ProtectedRoute() {
  const { currentUser } = UseAuth()!;
  if (!currentUser) {
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
  const { currentUser } = UseAuth()!;

  if (currentUser) {
    return <Navigate to="/main" replace />;
  } else {
    return <Outlet />;
  }
}
function CheckSession(){
  const email=sessionStorage.getItem('email');
  if(!email){
    return <Navigate to="/forgot" replace />;
  }else{
    return <Outlet/>
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
            index: true, 
            element: <Navigate to="/login" replace />,
          },
          {
            path: "/register",
            Component: Register,
          },
          {
            path: "/login",
            Component: Login,
          },
          {
            path:"/forgot",
            Component:ForgotPassword
          },
          {
            element:<CheckSession/>,
            children:[
              {
            path:'/verify-otp',
            Component:VerifyOtp
          }
            ]
          }
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
        Component: DisplyTasks,
      },
      {
        path: "/profile",
        Component: Profile,
      },
      {
        path: "/addtask",
        Component: Addtask,
      },
      {
        path: "/task/:id",
        Component: SpecificTask,
      },
    ],
  },
]);

