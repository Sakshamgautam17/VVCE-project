import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Home from "./components/Home";
import Begin from "./components/Begin";
import Exam from "./components/Exam"; // Import the Exam component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in using localStorage
  useEffect(() => {
    const storedLoginState = localStorage.getItem("isLoggedIn");
    if (storedLoginState === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <Router>
      <div>
        <Routes>
          {/* Redirect to login if user not logged in */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Login page route */}
          <Route path="/login" element={<Login onLogin={handleLogin} />} />

          {/* Home route protected by authentication */}
          <Route
            path="/home"
            element={
              isLoggedIn ? (
                <Home onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Begin page protected by authentication */}
          <Route
            path="/begin"
            element={isLoggedIn ? <Begin /> : <Navigate to="/login" />}
          />

          {/* Exam page protected by authentication */}
          <Route
            path="/exam"
            element={isLoggedIn ? <Exam /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
