import React from "react";
import ReactDOM from "react-dom/client";
import 'react-quill/dist/quill.snow.css';
import "jsvectormap/dist/css/jsvectormap.css";
import 'react-toastify/dist/ReactToastify.css';
import 'react-modal-video/css/modal-video.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ClerkProvider } from "@clerk/clerk-react";

const root = ReactDOM.createRoot(document.getElementById("root"));
const clerkKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
root.render(
  <>
    <ClerkProvider publishableKey={clerkKey}>
    <App />
  </ClerkProvider>
  </>
);

reportWebVitals();
