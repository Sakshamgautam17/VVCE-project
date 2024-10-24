import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [questionFile, setQuestionFile] = useState(null);
  const [studentFile, setStudentFile] = useState(null);
  const navigate = useNavigate();

  const handleQuestionFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/vnd.ms-excel") {
      setQuestionFile(file);
    }
  };

  const handleStudentFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/vnd.ms-excel") {
      setStudentFile(file);
    }
  };

  const handleFileUpload = (file, type) => {
    // Simulating file upload for demonstration
    const formData = new FormData();
    formData.append("file", file);
    console.log(`${type} uploaded:`, file);

    // Implement actual upload logic with backend here
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (questionFile) handleFileUpload(questionFile, "Question Paper");
    if (studentFile) handleFileUpload(studentFile, "Student List");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {/* Header */}
      <div className="bg-blue-600 text-white w-full py-4 text-center text-3xl font-bold">
        Admin Dashboard
      </div>

      {/* Button to redirect to login */}
      <div className="mt-6">
        <button
          className="btn btn-primary text-lg"
          onClick={() => navigate("/login")}
        >
          Go to Login Page
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-6xl mt-10 bg-white rounded-lg shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Section - Upload Question Paper */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4">Upload Question Paper</h2>
          <div className="form-control w-full">
            <input
              type="file"
              accept=".csv"
              className="file-input file-input-bordered w-full"
              onChange={handleQuestionFileChange}
            />
          </div>
          {questionFile && (
            <p className="mt-2 text-green-500">
              File selected: {questionFile.name}
            </p>
          )}
        </div>

        {/* Right Section - Upload Student List */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4">Upload Student List</h2>
          <div className="form-control w-full">
            <input
              type="file"
              accept=".csv"
              className="file-input file-input-bordered w-full"
              onChange={handleStudentFileChange}
            />
          </div>
          {studentFile && (
            <p className="mt-2 text-green-500">
              File selected: {studentFile.name}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8">
        <button
          className="btn btn-success text-lg px-8 py-2"
          onClick={handleSubmit}
        >
          Upload Files
        </button>
      </div>
    </div>
  );
};

export default Admin;
