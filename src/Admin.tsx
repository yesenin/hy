type AdminProps = {
  userName: string;
  userEmail: string;
  onLogout: () => void;
};

function Admin({ userName, userEmail, onLogout }: AdminProps) {
  return (
    <main className="admin-page">
      <section className="admin-panel">
        <p className="eyebrow">Protected Area</p>
        <h1>Admin Console</h1>
        <p className="admin-copy">
          Access is granted through Google Sign-In. This route stays locked
          until a valid Google credential is present in the current session.
        </p>

        <div className="admin-meta">
          <div>
            <span>Name</span>
            <strong>{userName}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>{userEmail}</strong>
          </div>
        </div>

        <div className="admin-actions">
          <a className="ghost-button" href="#/">
            Back to home
          </a>
          <button type="button" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </section>
    </main>
  );
}

export default Admin;
