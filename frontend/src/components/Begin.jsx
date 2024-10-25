import React from "react";
import { useNavigate } from "react-router-dom";

const Begin = () => {
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate("/exam");
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
        <h1 className="text-4xl font-bold mb-4">Online Exam Instructions</h1>
        <ul className="list-disc list-inside text-lg mb-6 text-left space-y-2">
          <li>Ensure a stable and secure internet connection for the duration of the exam.</li>
          <li>Avoid refreshing or navigating away from the exam window, as this will trigger a monitoring alert.</li>
          <li>You are under active surveillance. Any unauthorized individuals, mobile devices, or unapproved audio will result in immediate disqualification.</li>
          <li>Remain in a quiet, isolated environment to maintain focus and abide by examination protocols.</li>
          <li>The test will begin when you click "Start Test."</li>
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

export default Begin;