import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import data from "../data/examQ.json"; // Importing questions from the JSON file

const Exam = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isExamOver, setIsExamOver] = useState(false);
  
  // Proctoring states
  const [status, setStatus] = useState({ person_count: 0, cellphone_detected: false });
  const [warnings, setWarnings] = useState({
    cellphone: 0,
    person: 0,
    noPerson: 0
  });
  const [alerts, setAlerts] = useState([]);
  const alertIdCounter = useRef(0);

  // Initial check states
  const [isInitialCheck, setIsInitialCheck] = useState(true);
  const [isCheckPassed, setIsCheckPassed] = useState(false);
  const [checkStatus, setCheckStatus] = useState("Initializing...");
  
  // Start initial check when component mounts
  useEffect(() => {
    if (isInitialCheck) {
      startProctoring();
      checkEnvironment();
      // Load questions from JSON file on mount
      setQuestions(data);
    }
    return () => {
      if (!isCheckPassed) {
        stopProctoring();
      }
    };
  }, []);

  const startProctoring = () => {
    fetch('http://127.0.0.1:5000/start')
      .then(response => response.json())
      .catch(error => console.error('Error starting proctoring:', error));
  };

  const stopProctoring = () => {
    fetch('http://127.0.0.1:5000/stop')
      .then(response => response.json())
      .catch(error => console.error('Error stopping proctoring:', error));
  };

  const checkEnvironment = () => {
    let checkInterval = setInterval(() => {
      fetch('http://127.0.0.1:5000/status')
        .then(response => response.json())
        .then(data => {
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
        .catch(error => {
          console.error('Error:', error);
          setCheckStatus("⚠️ Error connecting to proctoring system");
        });
    }, 1000);

    return () => clearInterval(checkInterval);
  };

  const addAlert = (message, type = 'warning') => {
    const id = alertIdCounter.current++;
    setAlerts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 5000);
  };

  const captureScreenshot = () => {
    fetch('http://127.0.0.1:5000/screenshot')
      .then(response => response.json())
      .then(data => {
        if (data.status === 'Screenshot saved') {
          addAlert(`Screenshot saved as ${data.filename}`, 'info');
        } else {
          addAlert('Failed to capture screenshot', 'error');
        }
      })
      .catch(error => console.error('Screenshot capture error:', error));
  };

  // Proctoring monitoring effect - only starts after initial check passes
  useEffect(() => {
    let intervalId;
    let noPersonTimer;

    if (!isExamOver && isCheckPassed) {
      intervalId = setInterval(() => {
        fetch('http://127.0.0.1:5000/status')
          .then(response => response.json())
          .then(data => {
            setStatus(data);

            // Handle cellphone detection
            if (data.cellphone_detected) {
              setWarnings(prev => {
                const newCount = prev.cellphone + 1;
                if (newCount === 1) {
                  addAlert('⚠ Warning: Cellphone detected!');
                } else if (newCount === 2) {
                  addAlert('❌ Test terminated due to cellphone usage', 'error');
                  captureScreenshot();
                  setIsExamOver(true);
                }
                return { ...prev, cellphone: newCount };
              });
            }

            // Handle multiple persons
            if (data.person_count > 1) {
              setWarnings(prev => {
                const newCount = prev.person + 1;
                if (newCount === 1) {
                  addAlert('⚠ Warning: Multiple persons detected!');
                } else if (newCount === 2) {
                  addAlert('⚠ Final warning: Multiple persons detected!');
                } else if (newCount === 3) {
                  addAlert('❌ Test terminated due to multiple persons', 'error');
                  captureScreenshot();
                  setIsExamOver(true);
                }
                return { ...prev, person: newCount };
              });
            }

            // Handle no person detection
            if (data.person_count === 0) {
              if (!noPersonTimer) {
                noPersonTimer = setTimeout(() => {
                  setWarnings(prev => {
                    const newCount = prev.noPerson + 1;
                    if (newCount === 1) {
                      addAlert('⚠ Warning: No person detected!');
                    } else if (newCount === 2) {
                      addAlert('⚠ Final warning: No person detected!');
                    } else if (newCount === 3) {
                      addAlert('❌ Test terminated due to no person detected', 'error');
                      captureScreenshot();
                      setIsExamOver(true);
                    }
                    return { ...prev, noPerson: newCount };
                  });
                }, 3000);
              }
            } else {
              if (noPersonTimer) {
                clearTimeout(noPersonTimer);
                noPersonTimer = null;
              }
            }
          })
          .catch(error => console.error('Error:', error));
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (noPersonTimer) clearTimeout(noPersonTimer);
    };
  }, [isExamOver, isCheckPassed]);

  // Timer effect - only starts after initial check passes
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

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
    } else {
      setIsExamOver(true);
    }
  };

  const handleSubmitExam = () => {
    setIsExamOver(true);
  };

  useEffect(() => {
    if (isExamOver) {
      stopProctoring();
      alert("Exam Over!");
      navigate("/results");
    }
  }, [isExamOver, navigate]);

  // Initial check screen
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
                <span className={`font-bold ${status.person_count === 1 ? 'text-green-600' : 'text-red-600'}`}>
                  {status.person_count === 1 ? '✅' : '❌'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>No Phone Detected:</span>
                <span className={`font-bold ${!status.cellphone_detected ? 'text-green-600' : 'text-red-600'}`}>
                  {!status.cellphone_detected ? '✅' : '❌'}
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

  // Main Exam Content
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
      {alerts.map(alert => (
        <div key={alert.id} className={`alert ${alert.type}`}>
          {alert.message}
        </div>
      ))}
    </div>
  );
};

export default Exam;
