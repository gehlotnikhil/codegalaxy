// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import React from 'react'

import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./store/index.tsx";
import { Bounce, ToastContainer } from "react-toastify";
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
      <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/login">
      <App /> 
      </ClerkProvider>
        </React.StrictMode>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
        />{" "}
    </Provider>
);
