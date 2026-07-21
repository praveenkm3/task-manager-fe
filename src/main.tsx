import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router/dom";
import { router } from "../src/components/Routing/router.tsx";
import AuthProvider from "./contexts/AuthContext.tsx"; 
import { ApolloProvider } from "@apollo/client/react";
import client from "./Apollo/Client.ts";
import queryClient from "./reactQuery/query.ts";
import { QueryClientProvider } from "@tanstack/react-query";
  


const root = createRoot(document.getElementById("root")!);

root.render(
  <>
  <QueryClientProvider client={queryClient}> 
    <ApolloProvider client={client}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ApolloProvider>
    </QueryClientProvider>
  </>,
);
