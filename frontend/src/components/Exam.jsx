import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import data from "../data/examQ.json"; // Importing questions from the JSON file

const Exam = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isExamOver, setIsExamOver] = useState(false);

  // Proctoring states
  const [status, setStatus] = useState({
    person_count: 0,
    cellphone_detected: false,
  });
  const [warnings, setWarnings] = useState({
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

  // Initial check states
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
      };
    }
  }, []);

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
      .catch((error) => {
        console.error("Error starting proctoring:", error);
        addAlert("Failed to start proctoring system", "error");
      });
  };

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
    const checkInterval = setInterval(() => {
      fetch("http://127.0.0.1:5000/status")
        .then((response) => response.json())
        .then((data) => {
          setStatus(data);

          if (data.cellphone_detected) {
            setCheckStatus("⚠️ Please remove any phones from the camera view");
          } else if (data.person_count === 0) {
            setCheckStatus(
              "👤 Please position yourself in front of the camera"
            );
          } else if (data.person_count > 1) {
            setCheckStatus("⚠️ Only one person should be visible");
          } else if (data.person_count === 1 && !data.cellphone_detected) {
            setCheckStatus(
              "✅ Environment check passed! Starting exam in 3 seconds..."
            );
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

  const addAlert = (message, type = "warning") => {
    const id = alertIdCounter.current++;
    setAlerts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 5000);
  };

  const captureScreenshot = () => {
    fetch("http://127.0.0.1:5000/screenshot")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "Screenshot saved") {
          addAlert(`Screenshot saved as ${data.filename}`, "info");
        } else {
          addAlert("Failed to capture screenshot", "error");
        }
      })
      .catch((error) => console.error("Screenshot capture error:", error));
  };

  // Proctoring monitoring effect - only starts after initial check passes
  useEffect(() => {
    let intervalId;
    let noPersonTimer;

    if (!isExamOver && isCheckPassed) {
      intervalId = setInterval(() => {
        fetch("http://127.0.0.1:5000/status")
          .then((response) => response.json())
          .then((data) => {
            setStatus(data);

            // Handle cellphone detection
            if (data.cellphone_detected) {
              setWarnings((prev) => {
                const newCount = prev.cellphone + 1;
                if (newCount === 1) {
                  addAlert("⚠ Warning: Cellphone detected!");
                } else if (newCount === 2) {
                  addAlert(
                    "❌ Test terminated due to cellphone usage",
                    "error"
                  );
                  captureScreenshot();
                  setIsExamOver(true);
                }
                return { ...prev, cellphone: newCount };
              });
            }

            // Handle multiple persons
            if (data.person_count > 1) {
              setWarnings((prev) => {
                const newCount = prev.person + 1;
                if (newCount === 1) {
                  addAlert("⚠ Warning: Multiple persons detected!");
                } else if (newCount === 2) {
                  addAlert("⚠ Final warning: Multiple persons detected!");
                } else if (newCount === 3) {
                  addAlert(
                    "❌ Test terminated due to multiple persons",
                    "error"
                  );
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
                  setWarnings((prev) => {
                    const newCount = prev.noPerson + 1;
                    if (newCount === 1) {
                      addAlert("⚠ Warning: No person detected!");
                    } else if (newCount === 2) {
                      addAlert("⚠ Final warning: No person detected!");
                    } else if (newCount === 3) {
                      addAlert(
                        "❌ Test terminated due to no person detected",
                        "error"
                      );
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
          .catch((error) => console.error("Error:", error));
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
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
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
                <span
                  className={`font-bold ${
                    status.person_count === 1
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {status.person_count === 1 ? "✅" : "❌"}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>No Phone Detected:</span>
                <span
                  className={`font-bold ${
                    !status.cellphone_detected
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
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