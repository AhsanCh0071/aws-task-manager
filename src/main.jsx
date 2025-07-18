import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { Amplify } from "aws-amplify";
import awsConfig from "./awsexports.js";
import { createRoot } from "react-dom/client";

Amplify.configure(awsConfig);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <App />
    </StrictMode>
  </BrowserRouter>
);
