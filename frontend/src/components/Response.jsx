import React from "react";

const Response = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-900">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content Container using DaisyUI Card */}
      <div className="relative z-10 w-full max-w-md p-6">
        <div className="card bg-black bg-opacity-80 shadow-lg p-6 rounded-lg">
          <h1 className="text-3xl font-bold text-white text-center mb-4">
            Thank You!
          </h1>
          <p className="text-lg text-white text-center mb-4">
            Thank you for taking the test. Your responses have been recorded.
          </p>
          <p className="text-lg text-white text-center">
            We appreciate your effort and wish you the best in your results!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Response;
