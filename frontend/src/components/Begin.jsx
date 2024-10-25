import React from "react";
import { useNavigate } from "react-router-dom";

const Begin = () => {
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate("/exam");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-900 relative">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-opacity-40 bg-black"></div>

      {/* Animated Background Shapes */}
      <div className="absolute top-20 left-10 bg-indigo-400 w-40 h-40 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 bg-blue-400 w-52 h-52 rounded-full opacity-30 animate-pulse"></div>

      {/* Content Container */}
      <div className="relative z-10 text-white text-center p-8 bg-opacity-80 bg-black rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Online Exam Instructions</h1>
        <ul className="list-disc list-inside text-lg mb-6">
          <li>Make sure you have a stable internet connection.</li>
          <li>Do not refresh the page during the exam.</li>
          <li>You are being monitored. Any suspicious activity will result in disqualification.</li>
          <li> Suspe</li>
          <li>The test will begin once you click the "Start Test" button.</li>
        </ul>
        <button
          onClick={handleStartTest}
          className="btn text-xl font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 px-6 rounded-lg hover:from-indigo-600 hover:to-blue-600 transition duration-300 transform hover:scale-105"
        >
          Start Test
        </button>
      </div>
    </div>
  );
};

export default Begin;
