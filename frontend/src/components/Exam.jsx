import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import data from "../data/examQ.json"; // Importing questions from the JSON file

const Exam = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes timer
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isExamOver, setIsExamOver] = useState(false);

  // Load questions from JSON file on mount
  useEffect(() => {
    setQuestions(data);
  }, []);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsExamOver(true); // End exam when time runs out
    }
  }, [timeLeft]);

  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
    } else {
      setIsExamOver(true); // End exam if no more questions
    }
  };

  // Handle exam submission
  const handleSubmitExam = () => {
    setIsExamOver(true); // End exam when submitted
  };

  // Redirect to result or any other page after exam ends
  useEffect(() => {
    if (isExamOver) {
      alert("Exam Over!");
      navigate("/results");
    }
  }, [isExamOver, navigate]);

  if (isExamOver) {
    return <div>The exam has ended!</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl mb-4">Online Exam</h1>
      <div className="p-4 bg-white shadow-lg rounded-lg w-3/4">
        <div className="text-lg mb-2">
          Time Left: {Math.floor(timeLeft / 60)}:
          {timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
        </div>
        <div className="mb-4">
          <h2 className="text-2xl">
            {questions[currentQuestionIndex]?.question}
          </h2>
          <ul className="mt-2">
            {questions[currentQuestionIndex]?.options.map((option, index) => (
              <li
                key={index}
                className={`cursor-pointer p-2 mt-2 border rounded-lg ${
                  selectedAnswer === option ? "bg-blue-200" : "bg-white"
                }`}
                onClick={() => handleAnswerSelect(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleNextQuestion}
          >
            Next
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={handleSubmitExam}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Exam;
