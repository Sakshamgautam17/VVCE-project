import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login'; // Importing the Login component
import Home from './components/Home';   // Importing the Home component

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Default route redirects to the login page */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Define the route for the login page */}
          <Route path="/login" element={<Login />} />

          {/* Define the route for the home page */}
          <Route path="/home" element={<Home />} />

          {/* You can add more routes here as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
