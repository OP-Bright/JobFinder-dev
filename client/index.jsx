import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./src/styles.css";

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./components/App.jsx";

import { CssBaseline } from "@mui/material";

const root = createRoot(document.getElementById("app"));
root.render(
  <BrowserRouter>
    <CssBaseline />
    <App />
  </BrowserRouter>
);
