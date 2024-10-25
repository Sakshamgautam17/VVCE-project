import React from "react";
import { useNavigate } from "react-router-dom";

const BeginTrial = () => {
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate("/trial-exam"); // Redirect to the trial exam page
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-900">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Animated Background Shapes */}
      <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-indigo-400 opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-52 h-52 rounded-full bg-blue-400 opacity-30 animate-pulse"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-2xl mx-4 text-white text-center p-8 bg-black bg-opacity-80 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Trial Test Instructions</h1>
        <p className="text-lg mb-4">
          Welcome to the Trial Exam! Please read the following instructions
          carefully before starting.
        </p>
        <ul className="list-disc list-inside text-lg mb-6 text-left space-y-2">
          <li>Ensure you have a stable internet connection.</li>
          <li>The trial test will contain multiple-choice questions.</li>
          <li>You will have a limited amount of time to complete the test.</li>
          <li>Each question is mandatory; you cannot skip any.</li>
          <li>
            Your responses will be recorded automatically once you finish.
          </li>
        </ul>
        <button
          onClick={handleStartTest}
          className="text-xl font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 px-6 rounded-lg hover:from-indigo-600 hover:to-blue-600 transition duration-300 transform hover:scale-105"
        >
          Start Test
        </button>
      </div>
    </div>
  );
};

export default BeginTrial;
