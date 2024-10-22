import React from "react";
import { useNavigate } from "react-router-dom"; // To handle navigation

const Home = ({ onLogout }) => {
  // Receive onLogout as a prop
  const navigate = useNavigate();

  // Handlers for buttons
  const handleStartTest = () => {
    alert("Start Test Clicked");
    // Add routing to the start test page if needed
    // Example: navigate('/start-test');
  };

  const handleTrialTest = () => {
    alert("Trial Test Clicked");
    // Add routing to the trial test page if needed
    // Example: navigate('/trial-test');
  };

  const handleLogout = () => {
    onLogout(); // Call the logout handler
    navigate("/login"); // Redirect to login page
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome to the Home Page</h1>
      <p style={styles.subHeading}>Please choose an option:</p>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={handleStartTest}>
          Start Test
        </button>
        <button style={styles.button} onClick={handleTrialTest}>
          Trial Test
        </button>
        <button style={styles.button} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

// Styles for the Home page remain the same
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh", // Full height of viewport
    width: "100vw", // Full width of viewport
    backgroundColor: "rgb(200, 220, 240)", // RGB background color
    textAlign: "center", // Center the text horizontally
  },
  heading: {
    fontSize: "36px",
    marginBottom: "20px",
    color: "black", // Heading text color
  },
  subHeading: {
    fontSize: "18px",
    marginBottom: "30px",
  },
  buttonContainer: {
    display: "flex",
    gap: "20px", // Space between the buttons
  },
  button: {
    padding: "15px 30px",
    fontSize: "18px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default Home;
