import React from "react";
import { useNavigate } from "react-router-dom";

const BeginTrial = () => {
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate("/trial-exam"); // Redirect to the trial exam page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-base-200">
      <div className="card w-full max-w-lg shadow-xl bg-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">
          Trial Test Instructions
        </h1>

        <p className="text-lg mb-4">
          Welcome to the Trial Exam! Please read the following instructions
          carefully before starting.
        </p>

        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>Ensure you have a stable internet connection.</li>
          <li>The trial test will contain multiple-choice questions.</li>
          <li>You will have a limited amount of time to complete the test.</li>
          <li>Each question is mandatory; you cannot skip any.</li>
          <li>
            Your responses will be recorded automatically once you finish.
          </li>
        </ul>

        <div className="flex justify-center">
          <button
            className="btn btn-primary w-full text-xl"
            onClick={handleStartTest}
          >
            Start Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeginTrial;
