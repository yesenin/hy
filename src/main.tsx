import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { HashRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

const googleClientId =
  "495475285005-pu2p6trl3a8iopnv3qmqrlqdf6ks62f6.apps.googleusercontent.com";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <HashRouter>
        <App />
      </HashRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
);
