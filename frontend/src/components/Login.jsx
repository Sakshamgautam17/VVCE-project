import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importing useNavigate

const Login = ({ onLogin }) => {
  // Receive onLogin as a prop
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Initializing useNavigate for navigation

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Make a POST request to the backend for login
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful, call the onLogin function to update state
        onLogin(); // Call onLogin prop
        navigate("/home");
      } else {
        // Handle login failure
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <p style={styles.error}>{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw", // Full viewport width
    backgroundColor: "#f0f0f0",
  },
  formContainer: {
    width: "100%", // Full width
    maxWidth: "600px", // Max width to make it responsive on large screens
    padding: "40px", // Padding to give some space around the form
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    marginBottom: "20px",
    fontSize: "28px", // Larger heading font size
    textAlign: "center", // Center the heading
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    marginBottom: "15px",
    padding: "15px", // Larger padding for input fields
    fontSize: "18px", // Larger font size for input fields
    border: "1px solid #ccc",
    borderRadius: "5px",
    width: "100%",
    boxSizing: "border-box", // Ensures padding is included in the element’s width
  },
  button: {
    padding: "15px", // Larger padding for button
    fontSize: "18px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    width: "100%",
  },
  error: {
    color: "red",
    marginBottom: "10px",
    textAlign: "center", // Center the error message
  },
};

export default Login;
