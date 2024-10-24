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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="card w-96 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="card-body p-6">
          <h2 className="text-2xl font-bold text-center mb-4">
            {loginMode === "admin" ? "Admin Login" : "Student Login"}
          </h2>
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Radio buttons for selecting login mode */}
          <div className="flex justify-center mb-4">
            <label className="mr-4 cursor-pointer">
              <input
                type="radio"
                name="loginMode"
                className="radio"
                checked={loginMode === "student"}
                onChange={() => setLoginMode("student")}
              />
              <span className="ml-2 text-gray-700">Student Login</span>
            </label>
            <label className="cursor-pointer">
              <input
                type="radio"
                name="loginMode"
                className="radio"
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
                className="input input-bordered w-full py-2 px-4 border rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-control mb-4">
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full py-2 px-4 border rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-control">
              <button
                className="btn btn-primary w-full py-2 rounded-lg text- hover:bg-blue-700 transition duration-200"
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
