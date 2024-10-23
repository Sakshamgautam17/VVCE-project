import React from "react";
import { useNavigate } from "react-router-dom";

const Begin = () => {
  const navigate = useNavigate();

  const handleStartTest = () => {
    // Navigate to the exam page
    navigate("/exam");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-base-200">
      <h1 className="text-4xl font-bold mb-4">Online Exam Instructions</h1>
      <ul className="list-disc text-left text-lg mb-6">
        <li>Make sure you have a stable internet connection.</li>
        <li>Do not refresh the page during the exam.</li>
        <li>
          You are being monitored. Any suspicious activity will result in
          disqualification.
        </li>
        <li>The test will begin once you click the "Start Test" button.</li>
      </ul>
      <button onClick={handleStartTest} className="btn btn-primary text-2xl">
        Start Test
      </button>
    </div>
  );
};

export default Begin;
