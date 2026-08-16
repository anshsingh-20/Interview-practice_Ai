import { NavLink } from "react-router-dom";

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <span className="brand-icon">AI</span>
        <div className="brand-copy">
          <strong>AI Interview</strong>
          <span>Practice with confidence</span>
        </div>
      </NavLink>

      <div className="nav-links">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/interview">
          Interview
        </NavLink>
        <NavLink to="/history">
          History
        </NavLink>

        {user ? (
          <div className="nav-user">
            <span className="welcome-tag">Hello, {user.username}</span>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <NavLink to="/login" className="login-link">
              Login
            </NavLink>
            <NavLink to="/register" className="register-link">
              Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;