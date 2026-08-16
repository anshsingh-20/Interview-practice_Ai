import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Interview from "./pages/Interview";
import History from "./pages/History";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { api } from "./services/api";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const userData = await api.getMe();
        setUser(userData);
      } catch (err) {
        console.error("Failed to load user:", err);
        // Token is invalid/expired
        api.logout();
        setToken("");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const handleLoginSuccess = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
  };

  const handleLogout = () => {
    api.logout();
    setToken("");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading AI Interview platform...</p>
      </div>
    );
  }

  // Helper for Route Protection
  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar user={user} onLogout={handleLogout} />

        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <Interview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              token ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route
            path="/register"
            element={
              token ? (
                <Navigate to="/" replace />
              ) : (
                <Register onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;