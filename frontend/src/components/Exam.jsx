import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Exam = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isExamOver, setIsExamOver] = useState(false);
  const [isNPressed, setIsNPressed] = useState(false);
  const nKeyRef = useRef(false);



  // Proctoring states
  const [status, setStatus] = useState({ person_count: 0, cellphone_detected: false });
  const [warnings, setWarnings] = useState({
    tabSwitch: 0,
    windowBlur: 0,
    cellphone: 0,
    person: 0,
    noPerson: 0,
    multiplePeople: 0,
  });
  const [alerts, setAlerts] = useState([]);
  const alertIdCounter = useRef(0);
  const monitoringInterval = useRef(null);
  const visibilityTimeout = useRef(null);
  const blurTimeout = useRef(null);

  // Monitoring states
  const [isInitialCheck, setIsInitialCheck] = useState(true);
  const [isCheckPassed, setIsCheckPassed] = useState(false);
  const [checkStatus, setCheckStatus] = useState("Initializing...");

    // Modified N key handler
    useEffect(() => {
      console.log('Setting up N key handler');
      
      const handleKeyPress = (event) => {
        if (event.key === 'n' || event.key === 'N') {
          console.log('N key pressed - updating state');
          nKeyRef.current = true;
          setIsNPressed(true);
        }
      };
  
      window.addEventListener('keydown', handleKeyPress);
      
      return () => {
        console.log('Cleaning up N key handler');
        window.removeEventListener('keydown', handleKeyPress);
      };
    }, []);
    
 // Initialize exam and monitoring
 useEffect(() => {
  if (isInitialCheck) {
    startProctoring();
    checkEnvironment();
    fetchMCQs();
    const cleanup = monitorTabSwitch();
    return () => {
      cleanup();
      stopProctoring();
    };
  }
}, [isInitialCheck]);

  // Initialize exam and monitoring
  useEffect(() => {
    if (isInitialCheck) {
      startProctoring();
      checkEnvironment();  // Initialize the environment check
      fetchMCQs();
      const cleanup = monitorTabSwitch();
      return () => {
        cleanup();
        stopProctoring();
      };
    }
  }, [isInitialCheck]);

  // Start continuous monitoring after exam starts
  useEffect(() => {
    if (isCheckPassed && !isExamOver) {
      monitoringInterval.current = setInterval(() => {
        fetch("http://127.0.0.1:5000/status")
          .then((response) => response.json())
          .then((data) => {
            setStatus(data);
            handleViolations(data);
          })
          .catch((error) => {
            console.error("Monitoring error:", error);
            addAlert("⚠️ Proctoring system connection lost!", "error");
          });
      }, 1000);

      return () => {
        if (monitoringInterval.current) {
          clearInterval(monitoringInterval.current);
        }
      };
    }
  }, [isCheckPassed, isExamOver]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isExamOver && isCheckPassed) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleExamEnd("Time's up!");
    }
  }, [timeLeft, isExamOver, isCheckPassed]);

  // Fetch MCQ questions
  const fetchMCQs = () => {
    fetch("http://127.0.0.1:5001/fetch-mcq")
      .then((response) => response.json())
      .then((data) => {
        if (data.mcq_data) {
          setQuestions(data.mcq_data);
        } else {
          console.error("Failed to load questions:", data.error);
          addAlert("Failed to load questions", "error");
        }
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
        addAlert("Error loading questions", "error");
      });
  };

  // Start proctoring
  const startProctoring = () => {
    fetch("http://127.0.0.1:5000/start")
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error starting proctoring:", error);
        addAlert("Failed to start proctoring system", "error");
      });
  };

  // Stop proctoring
  const stopProctoring = () => {
    fetch("http://127.0.0.1:5000/stop")
      .then((response) => response.json())
      .catch((error) => console.error("Error stopping proctoring:", error));
  };

  // Monitor tab switching and window focus
  const monitorTabSwitch = () => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && !isInitialCheck) {
        clearTimeout(visibilityTimeout.current);
        visibilityTimeout.current = setTimeout(() => {
          setWarnings((prev) => {
            const newCount = prev.tabSwitch + 1;
            if (newCount === 1) {
              addAlert("⚠️ Warning: Tab switch detected!", "warning");
              captureViolationScreenshot();
            } else if (newCount >= 2) {
              handleExamEnd("Test terminated due to multiple tab switches");
            }
            return { ...prev, tabSwitch: newCount };
          });
        }, 200);
      }
    };

    const handleWindowBlur = () => {
      if (!isInitialCheck) {
        clearTimeout(blurTimeout.current);
        blurTimeout.current = setTimeout(() => {
          setWarnings((prev) => {
            const newCount = prev.windowBlur + 1;
            if (newCount === 1) {
              addAlert("⚠️ Warning: Window unfocused!", "warning");
              captureViolationScreenshot();
            } else if (newCount >= 2) {
              handleExamEnd("Test terminated due to multiple window unfocus events");
            }
            return { ...prev, windowBlur: newCount };
          });
        }, 200);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("blur", handleWindowBlur);
      clearTimeout(visibilityTimeout.current);
      clearTimeout(blurTimeout.current);
    };
  };

  // Handle violations
  const handleViolations = (data) => {
    // No person detected
    if (data.person_count === 0) {
      setWarnings((prev) => {
        const newCount = prev.noPerson + 1;
        if (newCount === 1) {
          addAlert("⚠️ Warning: No person detected!", "warning");
          captureViolationScreenshot();
        } else if (newCount >= 2) {
          handleExamEnd("Test terminated: Extended period with no person detected");
        }
        return { ...prev, noPerson: newCount };
      });
    } else {
      setWarnings((prev) => ({ ...prev, noPerson: 0 }));
    }

    // Multiple people
    if (data.person_count > 1) {
      setWarnings((prev) => {
        const newCount = prev.multiplePeople + 1;
        if (newCount === 1) {
          addAlert("⚠️ Warning: Multiple people detected!", "warning");
          captureViolationScreenshot();
        } else if (newCount >= 2) {
          handleExamEnd("Test terminated: Multiple people detected repeatedly");
        }
        return { ...prev, multiplePeople: newCount };
      });
    } else {
      setWarnings((prev) => ({ ...prev, multiplePeople: 0 }));
    }

    // Cellphone detection
    if (data.cellphone_detected) {
      setWarnings((prev) => {
        const newCount = prev.cellphone + 1;
        if (newCount === 1) {
          addAlert("⚠️ Warning: Cell phone detected!", "warning");
          captureViolationScreenshot();
        } else if (newCount >= 1) {
          handleExamEnd("Test terminated: Cell phone detected multiple times");
        }
        return { ...prev, cellphone: newCount };
      });
    } else {
      setWarnings((prev) => ({ ...prev, cellphone: 0 }));
    }
  };

  // Initial environment check
  const checkEnvironment = () => {
    console.log('Starting environment check');
    
    const checkInterval = setInterval(() => {
      console.log('Checking environment...', { isNPressed: nKeyRef.current });
      
      fetch("http://127.0.0.1:5000/status")
        .then((response) => response.json())
        .then((data) => {
          console.log('Status data:', data);
          setStatus(data);
          
          if (data.cellphone_detected) {
            setCheckStatus("⚠️ Please remove any phones from the camera view");
          } else if (data.person_count === 0) {
            setCheckStatus("👤 Please position yourself in front of the camera");
          } else if (data.person_count > 1) {
            setCheckStatus("⚠️ Only one person should be visible");
          } else if (data.person_count === 1 && !data.cellphone_detected) {
            if (!nKeyRef.current) {
              setCheckStatus("Authorizing person...");
            } else {
              console.log('All conditions met, transitioning to exam');
              setCheckStatus("✅ Environment check passed! Starting exam in 3 seconds...");
              
              // Clear the interval immediately
              clearInterval(checkInterval);
              
              // Set a 3-second delay before setting the final states
              setTimeout(() => {
                setIsInitialCheck(false);
                setIsCheckPassed(true);
              }, 3000);
            }
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setCheckStatus("⚠️ Error connecting to proctoring system");
        });
    }, 1000);

    return () => {
      console.log('Cleaning up interval');
      clearInterval(checkInterval);
    };
  };



  // Capture violation screenshot
  const captureViolationScreenshot = () => {
    fetch("http://127.0.0.1:5000/screenshot")
      .then((response) => response.json())
      .then((data) => {
        console.log("Violation screenshot captured:", data.filename);
      })
      .catch((error) => console.error("Error capturing screenshot:", error));
  };

  // Add alert
  const addAlert = (message, type = "warning") => {
    const id = alertIdCounter.current++;
    setAlerts((prev) => [...prev, { id, message, type }]);
    if (type === "warning") {
      setTimeout(() => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
      }, 5000);
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));
  };

  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Handle previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Handle exam end
  const handleExamEnd = (reason) => {
    setIsExamOver(true);
    stopProctoring();
    // Store answers and reason in sessionStorage
    sessionStorage.setItem("examAnswers", JSON.stringify(selectedAnswers));
    sessionStorage.setItem("examEndReason", reason);
    navigate("/response");
  };

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
                  {(status.person_count === 1 && isNPressed) ? "✅" : "❌"}
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

  // Render main exam screen
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Online Exam</h1>
          <div className="text-xl font-semibold">
            Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
          </div>
        </div>

        {/* Proctoring Status */}
        <div className="mb-6 p-3 bg-gray-50 rounded-lg flex justify-between items-center">
          <span>Proctoring Status:</span>
          <span className={`font-bold ${status.person_count === 1 && !status.cellphone_detected ? "text-green-600" : "text-red-600"}`}>
            {status.person_count === 1 && !status.cellphone_detected ? "✅ Active" : "⚠️ Check Camera"}
          </span>
        </div>

        {/* Question Section */}
        <div className="mb-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h2>
            <span className="text-gray-600">
              {selectedAnswers[currentQuestionIndex] ? "Answered" : "Not answered"}
            </span>
          </div>
          
          <div className="mb-6">
            <p className="text-lg mb-4">{questions[currentQuestionIndex]?.question}</p>
            <div className="space-y-3">
              {questions[currentQuestionIndex]?.options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors
                    ${
                      selectedAnswers[currentQuestionIndex] === option
                        ? "bg-blue-100 border-blue-500"
                        : "hover:bg-gray-50"
                    }`}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded-lg ${
              currentQuestionIndex === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Previous
          </button>

          <div className="flex space-x-4">
            <button
              onClick={() => handleExamEnd("Exam submitted by user")}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
            >
              Submit Exam
            </button>
            
            <button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className={`px-4 py-2 rounded-lg ${
                currentQuestionIndex === questions.length - 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Next
            </button>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="mt-8 border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">Question Navigator</h3>
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center
                  ${
                    currentQuestionIndex === index
                      ? "bg-blue-500 text-white"
                      : selectedAnswers[index]
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100"
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="fixed top-4 right-4 w-80 space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg shadow-lg ${
              alert.type === "error"
                ? "bg-red-500 text-white"
                : alert.type === "warning"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {alert.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exam;