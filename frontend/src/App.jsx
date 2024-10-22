import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./components/Login"; // Importing the Login component
import Home from "./components/Home"; // Importing the Home component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  // Effect to retrieve the login state from local storage on initial render
  useEffect(() => {
    const storedLoginState = localStorage.getItem("isLoggedIn");
    if (storedLoginState === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  // Function to handle successful login
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true"); // Save login state to local storage
  };

  // Function to handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn"); // Remove login state from local storage
  };

  return (
    <Router>
      <div>
        <Routes>
          {/* Default route redirects to the login page */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Define the route for the login page */}
          <Route path="/login" element={<Login onLogin={handleLogin} />} />

          {/* Define the route for the home page; redirect to login if not logged in */}
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

          {/* You can add more routes here as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
