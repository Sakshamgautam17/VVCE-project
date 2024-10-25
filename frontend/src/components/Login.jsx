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
          ? "http://localhost:5000/api/auth/admin-login" // Admin login URL
          : "http://localhost:5000/api/auth/login"; // Student login URL

      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (loginMode === "admin") {
        if (response.ok) {
          onLogin();
          navigate("/admin");
        } else {
          setError(data.message || "Login failed");
        }
      } else {
        if (response.ok) {
          onLogin();
          navigate("/home");
        } else {
          setError(data.message || "Login failed");
        }
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="card w-96 bg-white shadow-xl rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
        <div className="card-body p-8">
          <h2 className="text-3xl font-semibold text-center mb-6 text-indigo-600">
            {loginMode === "admin" ? "Admin Login" : "Student Login"}
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {/* Radio buttons for selecting login mode */}
          <div className="flex justify-center mb-6 space-x-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="loginMode"
                className="radio radio-primary"
                checked={loginMode === "student"}
                onChange={() => setLoginMode("student")}
              />
              <span className="ml-2 text-gray-700">Student Login</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="loginMode"
                className="radio radio-primary"
                checked={loginMode === "admin"}
                onChange={() => setLoginMode("admin")}
              />
              <span className="ml-2 text-gray-700">Admin Login</span>
            </label>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-control mb-4">
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-150"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-control mb-6">
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-150"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-control">
              <button
                className="btn btn-primary w-full py-3 rounded-lg hover:bg-blue-600 transition duration-200 transform hover:scale-105"
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
