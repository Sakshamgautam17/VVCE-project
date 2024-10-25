import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Exam = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isExamOver, setIsExamOver] = useState(false);

  // Proctoring states
  const [status, setStatus] = useState({ person_count: 0, cellphone_detected: false });
  const [warnings, setWarnings] = useState({
    tabSwitch: 0,
    windowBlur: 0,
    cellphone: 0,
    person: 0,
    noPerson: 0,
  });
  const [alerts, setAlerts] = useState([]);
  const alertIdCounter = useRef(0);

  // Monitoring states
  const [isInitialCheck, setIsInitialCheck] = useState(true);
  const [isCheckPassed, setIsCheckPassed] = useState(false);
  const [checkStatus, setCheckStatus] = useState("Initializing...");

  // Fetch questions and start initial checks
  useEffect(() => {
    if (isInitialCheck) {
      startProctoring();
      checkEnvironment();
      fetchMCQs();
      monitorTabSwitch();
    }
    return () => {
      if (!isCheckPassed) {
        stopProctoring();
      }
    };
  }, []);

  // Fetch MCQ questions
  const fetchMCQs = () => {
    fetch("http://127.0.0.1:5001/fetch-mcq")
      .then((response) => response.json())
      .then((data) => {
        if (data.mcq_data) {
          setQuestions(data.mcq_data);
        } else {
          console.error("Failed to load questions:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  };

  // Start proctoring
  const startProctoring = () => {
    fetch("http://127.0.0.1:5000/start")
      .then((response) => response.json())
      .catch((error) => console.error("Error starting proctoring:", error));
  };

  // Stop proctoring
  const stopProctoring = () => {
    fetch("http://127.0.0.1:5000/stop")
      .then((response) => response.json())
      .catch((error) => console.error("Error stopping proctoring:", error));
  };

  // Monitor tab switch and window focus changes
  const monitorTabSwitch = () => {
    let visibilityTimeout = null;
    let blurTimeout = null;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        clearTimeout(visibilityTimeout);
        visibilityTimeout = setTimeout(() => {
          setWarnings((prev) => {
            const newCount = prev.tabSwitch + 1;
            if (newCount === 1) {
              addAlert("⚠ Warning: Tab switch detected!");
            } else if (newCount === 2) {
              addAlert("❌ Test terminated due to multiple tab switches", "error");
              setIsExamOver(true);
            }
            return { ...prev, tabSwitch: newCount };
          });
        }, 200); // Small debounce to prevent quick double triggers
      }
    };

    const handleWindowBlur = () => {
      clearTimeout(blurTimeout);
      blurTimeout = setTimeout(() => {
        setWarnings((prev) => {
          const newCount = prev.windowBlur + 1;
          if (newCount === 1) {
            addAlert("⚠ Warning: Window unfocused!");
          } else if (newCount === 2) {
            addAlert("❌ Test terminated due to multiple window unfocus events", "error");
            setIsExamOver(true);
          }
          return { ...prev, windowBlur: newCount };
        });
      }, 200); // Small debounce to prevent quick double triggers
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      clearTimeout(visibilityTimeout);
      clearTimeout(blurTimeout);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  };

  // Add alert
  const addAlert = (message, type = "warning") => {
    const id = alertIdCounter.current++;
    setAlerts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 5000);
  };

  // Timer effect for exam duration
  useEffect(() => {
    if (timeLeft > 0 && !isExamOver && isCheckPassed) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsExamOver(true);
    }
  }, [timeLeft, isExamOver, isCheckPassed]);

  // Environment check function
  const checkEnvironment = () => {
    let checkInterval = setInterval(() => {
      fetch("http://127.0.0.1:5000/status")
        .then((response) => response.json())
        .then((data) => {
          setStatus(data);
          if (data.cellphone_detected) {
            setCheckStatus("⚠️ Please remove any phones from the camera view");
          } else if (data.person_count === 0) {
            setCheckStatus("👤 Please position yourself in front of the camera");
          } else if (data.person_count > 1) {
            setCheckStatus("⚠️ Only one person should be visible");
          } else if (data.person_count === 1 && !data.cellphone_detected) {
            setCheckStatus("✅ Environment check passed! Starting exam in 3 seconds...");
            setTimeout(() => {
              clearInterval(checkInterval);
              setIsInitialCheck(false);
              setIsCheckPassed(true);
            }, 3000);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setCheckStatus("⚠️ Error connecting to proctoring system");
        });
    }, 1000);

    return () => clearInterval(checkInterval);
  };

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
      setIsExamOver(true);
    }
  };

  // Submit exam
  const handleSubmitExam = () => {
    setIsExamOver(true);
  };

  // Handle exam end
  useEffect(() => {
    if (isExamOver) {
      stopProctoring();
      alert("Exam Over!");
      navigate("/response");
    }
  }, [isExamOver, navigate]);

  // Render initial check screen
  if (isInitialCheck) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-6">Environment Check</h1>
          <div className="mb-6">
            <div className="text-lg mb-4">{checkStatus}</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>Camera Connected:</span>
                <span className="font-bold">✅</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>Person Detected:</span>
                <span className={`font-bold ${status.person_count === 1 ? "text-green-600" : "text-red-600"}`}>
                  {status.person_count === 1 ? "✅" : "❌"}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>No Phone Detected:</span>
                <span className={`font-bold ${!status.cellphone_detected ? "text-green-600" : "text-red-600"}`}>
                  {!status.cellphone_detected ? "✅" : "❌"}
                </span>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Please ensure:
            <ul className="list-disc text-left pl-5 mt-2">
              <li>You are clearly visible in the camera</li>
              <li>No phones or other devices are visible</li>
              <li>You are in a well-lit environment</li>
              <li>You are the only person visible in the frame</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Render main exam content
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
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleNextQuestion}
          >
            Next
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={handleSubmitExam}
          >
            Submit
          </button>
        </div>
      </div>
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`alert ${
            alert.type === "error" ? "bg-red-500 text-white" : "bg-yellow-200 text-black"
          } p-3 rounded-md mt-4 w-3/4 text-center`}
        >
          {alert.message}
        </div>
      ))}
    </div>
  );
};

export default Exam;
