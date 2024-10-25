import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TrialTest = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [selectedAnswers, setSelectedAnswers] = useState(
    Array(questions.length).fill(null)
  ); // Store selected answers
  const navigate = useNavigate();

  // Fetch questions from the JSON file
  useEffect(() => {
    fetch("../src/data/examQ.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading questions:", error);
        setLoading(false);
      });
  }, []);

  // Timer to count down
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          handleSubmit(); // Auto-submit when time runs out
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, []);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleAnswerSelect = (answer) => {
    // Store the selected answer for the current question
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    // Calculate the score based on selected answers
    let score = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        score++;
      }
    });

    alert(`Exam submitted! Your score: ${score} out of ${questions.length}`); // Display score
    navigate("/home"); // Redirect to home or any other page after submission
  };

  if (loading) {
    return <div>Loading questions...</div>;
  }

  if (questions.length === 0) {
    return <div>No questions found</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-base-200 p-4">
      <div className="card w-full max-w-lg shadow-xl bg-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-4">Trial Test</h1>
        <div className="text-xl mb-2">
          Time Left: {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold">{currentQuestion.question}</h2>
          <ul className="list-disc list-inside space-y-2">
            {currentQuestion.options.map((option, index) => (
              <li key={index} className="flex items-center">
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value={option}
                  checked={selectedAnswers[currentQuestionIndex] === option} // Check if this option is selected
                  onChange={() => handleAnswerSelect(option)} // Update selected answer
                  className="mr-2"
                />
                {option}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-between">
          <button
            className="btn btn-secondary"
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            Next
          </button>

          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrialTest;
