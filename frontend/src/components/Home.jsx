import React from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate("/begin"); // Navigate to the Begin page
  };

  const handleTrialTest = () => {
    alert("Trial Test Clicked");
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-base-200">
      <h1 className="text-4xl font-bold mb-4">Let's get started!</h1>
      <p className="text-lg mb-6">Please choose an option:</p>
      <div className="space-x-4">
        <button className="btn btn-primary text-2xl" onClick={handleStartTest}>
          Start Test
        </button>
        <button className="btn btn-primary text-2xl" onClick={handleTrialTest}>
          Trial Test
        </button>
        <button className="btn btn-primary text-2xl" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;
