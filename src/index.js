import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { LightProvider } from "./context/lightContext";
import { ErrorProvider } from "./context/errorContext";
import { AchieveProvider } from "./context/achiveContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorProvider>
      <LightProvider>
        <AchieveProvider>
          <RouterProvider router={router}></RouterProvider>
        </AchieveProvider>
      </LightProvider>
    </ErrorProvider>
  </React.StrictMode>,
);
