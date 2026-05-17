import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import type { ReactNode } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Admin from "./Admin";
import AdminWordDetails from "./AdminWordDetails";
import "./App.css";
import {
  clearStoredUser,
  decodeGoogleCredential,
  isAllowedAdminUser,
  loadStoredUser,
  persistUser,
  type AuthUser,
} from "./auth";
import Home from "./Home";
import WordDetails from "./WordDetails";

function ProtectedAdmin({
  user,
  onLogin,
  onLogout,
  children,
}: {
  user: AuthUser | null;
  onLogin: (user: AuthUser) => void;
  onLogout: () => void;
  children?: ReactNode;
}) {
  const navigate = useNavigate();
  const isAllowedUser = isAllowedAdminUser(user);

  if (!user) {
    return (
      <main className="admin-page">
        <section className="admin-panel admin-login-panel">
          <h1>CMS</h1>
          <p className="admin-copy">
            Антон, войди уже через Google, чтобы продолжить.
          </p>
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

                if (!isAllowedAdminUser(nextUser)) {
                  window.alert(
                    "Для этого Google-аккаунта доступ в CMS не разрешен.",
                  );
                  return;
                }

                onLogin(nextUser);
                navigate("/admin", { replace: true });
              }}
              onError={() => {
                window.alert(
                  "Не удалось пройти аутентификацию через Google. Пожалуйста, попробуйте снова.",
                );
              }}
              useOneTap
            />
            <Link className="footer-admin-link" to="/">
              Назад на заглавную
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (!isAllowedUser) {
    return (
      <main className="admin-page">
        <section className="admin-panel admin-login-panel">
          <h1>Не получится увидеть.</h1>
          <h4>Да и не стоит оно того.</h4>
          <p className="admin-copy">
            Для этого Google-аккаунта доступ в CMS не разрешен.
          </p>
          <div className="admin-actions">
            <Link className="ghost-button" to="/">
              Назад на заглавную
            </Link>
            <button type="button" onClick={onLogout}>
              Выйти
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    children ?? (
      <Admin userName={user.name} userEmail={user.email} onLogout={onLogout} />
    )
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
      <Route path="/words" element={<WordDetails />} />
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
      <Route
        path="/admin/words/:wordId"
        element={
          <ProtectedAdmin
            user={user}
            onLogin={handleLogin}
            onLogout={handleLogout}
          >
            <AdminWordDetails />
          </ProtectedAdmin>
        }
      />
      <Route path="*" element={<Home user={user} />} />
    </Routes>
  );
}

export default App;
