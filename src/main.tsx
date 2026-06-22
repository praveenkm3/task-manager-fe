import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router/dom";
import { router } from "../src/components/Routing/router.tsx";
import AuthProvider from "./contexts/AuthContext.tsx"; 

const root = createRoot(document.getElementById("root")!);


root.render(
  <> 
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </>,
);
