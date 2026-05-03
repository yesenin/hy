import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Admin from "./Admin";
import "./App.css";
import {
  clearStoredUser,
  decodeGoogleCredential,
  loadStoredUser,
  persistUser,
  type AuthUser,
} from "./auth";
import Home from "./Home";

function ProtectedAdmin({
  user,
  onLogin,
  onLogout,
}: {
  user: AuthUser | null;
  onLogin: (user: AuthUser) => void;
  onLogout: () => void;
}) {
  const navigate = useNavigate();

  if (!user) {
    return (
      <main className="admin-page">
        <section className="admin-panel admin-login-panel">
          <p className="eyebrow">Protected Area</p>
          <h1>Admin</h1>
          <p className="admin-copy">Sign in with Google to continue.</p>
          <div className="admin-actions">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (!credentialResponse.credential) {
                  return;
                }

                const nextUser = decodeGoogleCredential(
                  credentialResponse.credential,
                );

                if (!nextUser) {
                  return;
                }

                onLogin(nextUser);
                navigate("/admin", { replace: true });
              }}
              onError={() => {
                window.alert("Google authentication failed. Please try again.");
              }}
              useOneTap
            />
            <Link className="footer-admin-link" to="/">
              back
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <Admin userName={user.name} userEmail={user.email} onLogout={onLogout} />
  );
}

function App() {
  const [user, setUser] = useState<AuthUser | null>(() => loadStoredUser());

  const handleLogin = (nextUser: AuthUser) => {
    persistUser(nextUser);
    setUser(nextUser);
  };

  const handleLogout = () => {
    clearStoredUser();
    setUser(null);
  };

  return (
    <Routes>
      <Route path="/" element={<Home user={user} />} />
      <Route
        path="/admin"
        element={
          <ProtectedAdmin
            user={user}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        }
      />
      <Route path="*" element={<Home user={user} />} />
    </Routes>
  );
}

export default App;
