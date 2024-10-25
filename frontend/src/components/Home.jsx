import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRocket, FaClipboardList, FaSignOutAlt } from "react-icons/fa";

const Home = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in effect after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // Delay for fade-in effect
    return () => clearTimeout(timer);
  }, []);

  const handleStartTest = () => {
    navigate("/begin"); // Navigate to the Begin page
  };

  const handleTrialTest = () => {
    navigate("/begin-trial"); // Navigate to the Begin Trial page
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-900 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-opacity-40 bg-black"></div>

      {/* Animated Background Shapes */}
      <div className="absolute top-20 left-10 bg-indigo-400 w-40 h-40 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 bg-blue-400 w-52 h-52 rounded-full opacity-30 animate-pulse"></div>

      <h1 className="text-5xl font-bold text-white mb-4 animate-fadeIn">
        Welcome back!
      </h1>
      <p className="text-lg text-white mb-8 text-center max-w-md animate-fadeIn">
        Choose an option to get started with your testing journey:
      </p>

      {/* Flex container for buttons */}
      <div className="flex flex-col space-y-4 mb-8 w-full max-w-sm">
        <button
          className="btn btn-primary text-xl flex items-center justify-center h-12 rounded-md transition duration-300 hover:bg-blue-700 shadow-lg transform transition-transform duration-300 hover:scale-105"
          onClick={handleStartTest}
        >
          <FaRocket className="mr-2" /> Start Test
        </button>
        <button
          className="btn btn-primary text-xl flex items-center justify-center h-12 rounded-md transition duration-300 hover:bg-blue-700 shadow-lg transform transition-transform duration-300 hover:scale-105"
          onClick={handleTrialTest}
        >
          <FaClipboardList className="mr-2" /> Trial Test
        </button>
        <button
          className="btn btn-primary text-xl flex items-center justify-center h-12 rounded-md transition duration-300 hover:bg-blue-700 shadow-lg transform transition-transform duration-300 hover:scale-105"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>

      {/* Additional Information Section */}
      <div className="bg-white text-gray-800 p-6 rounded-lg shadow-md w-full max-w-md text-center mb-6 animate-fadeIn">
        <h2 className="text-2xl font-semibold mb-2">Test Guidelines</h2>
        <p className="mb-4">
          Each test contains multiple-choice questions that assess your
          knowledge.
        </p>
        <p className="mb-4">
          Read each question carefully and choose the best answer.
        </p>
        <p className="mb-4">Prepare well and good luck!</p>
      </div>

      {/* Optional Footer */}
      <footer className="absolute bottom-4 text-white text-sm">
        <p>&copy; 2024 Your Company Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
