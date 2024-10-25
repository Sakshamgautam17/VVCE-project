import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginMode, setLoginMode] = useState("student"); // Default to Student login
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const loginUrl =
        loginMode === "admin"
          ? "http://localhost:5000/api/auth/admin-login"
          : "http://localhost:5000/api/auth/login";

      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin();
        navigate(loginMode === "admin" ? "/admin" : "/home");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-opacity-40 bg-black"></div>

      {/* Animated Background Shapes */}
      <div className="absolute top-20 left-10 bg-indigo-400 w-40 h-40 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 bg-blue-400 w-52 h-52 rounded-full opacity-30 animate-pulse"></div>

      {/* Card Container */}
      <div className="relative z-10 card w-96 bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-500 hover:scale-105">
        <div className="card-body p-8">
          <h2 className="text-3xl font-semibold text-center mb-6 text-indigo-700">
            {loginMode === "admin" ? "Admin Login" : "Student Login"}
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {/* Login Mode Selector */}
          <div className="flex justify-center mb-6 space-x-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="loginMode"
                className="radio radio-primary"
                checked={loginMode === "student"}
                onChange={() => setLoginMode("student")}
              />
              <span className="ml-2 text-gray-700 font-medium">Student</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="loginMode"
                className="radio radio-primary"
                checked={loginMode === "admin"}
                onChange={() => setLoginMode("admin")}
              />
              <span className="ml-2 text-gray-700 font-medium">Admin</span>
            </label>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-control mb-4">
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-control mb-6">
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-control">
              <button
                className="btn btn-primary w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 transition duration-300 transform hover:scale-105"
                type="submit"
              >
                {loginMode === "admin" ? "Login as Admin" : "Login as Student"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
