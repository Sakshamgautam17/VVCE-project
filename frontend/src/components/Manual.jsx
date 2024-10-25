import React, { useState } from "react";
import { FiCheckCircle, FiPlusCircle } from "react-icons/fi";

function Manual() {
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addQuestion = () => {
    const newQuestion = {
      question: questionText,
      options: options,
      correctAnswer: options[correctAnswer],
    };
    setQuestions([...questions, newQuestion]);
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(null);
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-blue-600 mb-6">
        Manual Question Entry
      </h2>

      {/* Question Input Section */}
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 mb-6">
        <input
          type="text"
          placeholder="Enter your question here..."
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-500"
        />

        {/* Options Section */}
        {options.map((option, index) => (
          <div key={index} className="flex items-center mb-3">
            <input
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              type="radio"
              name="correctAnswer"
              value={index}
              checked={correctAnswer === index}
              onChange={() => setCorrectAnswer(index)}
              className="ml-3 cursor-pointer"
            />
          </div>
        ))}

        {/* Add Question Button */}
        <button
          onClick={addQuestion}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-700 transition"
        >
          <FiPlusCircle className="mr-2" />
          Add Question
        </button>
      </div>

      {/* Display Questions List */}
      {questions.length > 0 && (
        <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 mt-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Questions List
          </h3>
          {questions.map((q, i) => (
            <div
              key={i}
              className="p-4 border-b border-gray-200 last:border-none"
            >
              <p className="text-lg font-medium text-gray-700">{`Q${i + 1}: ${
                q.question
              }`}</p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                {q.options.map((opt, j) => (
                  <li
                    key={j}
                    className={`${
                      q.correctAnswer === opt
                        ? "text-green-600 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    {opt}{" "}
                    {q.correctAnswer === opt && (
                      <FiCheckCircle className="inline ml-1 text-green-600" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Manual;
