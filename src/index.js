import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { LightProvider } from "./context/lightContext";
import { ErrorProvider } from "./context/errorContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorProvider>
      <LightProvider>
        <RouterProvider router={router}></RouterProvider>
      </LightProvider>
    </ErrorProvider>
  </React.StrictMode>,
);
