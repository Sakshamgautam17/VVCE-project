import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Begin from "./components/Begin";
import Exam from "./components/Exam";
import Admin from "./components/Admin";
import BeginTrial from "./components/BeginTrial";
import TrialTest from "./components/TrialTest";
import Response from "./components/Response";
import LandingPage from "./components/Landing"; // Import LandingPage component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* Set LandingPage as default */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/home" element={isLoggedIn ? <Home onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/begin" element={isLoggedIn ? <Begin /> : <Navigate to="/login" />} />
        <Route path="/begin-trial" element={isLoggedIn ? <BeginTrial /> : <Navigate to="/login" />} />
        <Route path="/exam" element={isLoggedIn ? <Exam /> : <Navigate to="/login" />} />
        <Route path="/admin" element={isLoggedIn ? <Admin /> : <Navigate to="/login" />} />
        <Route path="/trial-exam" element={isLoggedIn ? <TrialTest /> : <Navigate to="/login" />} />
        <Route path="/response" element={<Response />} />
      </Routes>
    </Router>
  );
}

export default App;
