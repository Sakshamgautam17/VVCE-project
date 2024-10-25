import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [csvMessage, setCsvMessage] = useState("");
  const [docMessage, setDocMessage] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [docFile, setDocFile] = useState(null);
  const [mcqData, setMcqData] = useState(null);

  const navigate = useNavigate(); // Initialize navigate function

  const handleCsvFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleDocFileChange = (e) => {
    setDocFile(e.target.files[0]);
  };

  const handleCsvUpload = () => {
    if (!csvFile) {
      alert("Please upload a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", csvFile);

    fetch("http://127.0.0.1:5001/upload-csv", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => setCsvMessage(data.message))
      .catch((error) => {
        console.error("Error:", error);
        setCsvMessage("Error uploading file");
      });
  };

  const handleDocUpload = () => {
    if (!docFile) {
      alert("Please upload a document file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", docFile);

    fetch("http://127.0.0.1:5001/upload-document", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => setDocMessage(data.message))
      .catch((error) => {
        console.error("Error:", error);
        setDocMessage("Error uploading document");
      });
  };

  const handleFetchMcq = () => {
    fetch("http://127.0.0.1:5001/fetch-mcq", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.mcq_data) {
          setMcqData(data.mcq_data);
          setDocMessage("MCQs fetched successfully");
        } else {
          setDocMessage(data.error || "Failed to fetch MCQs");
          setMcqData(null);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setDocMessage("Error fetching MCQs");
        setMcqData(null);
      });
  };

  const handleManualEntryRedirect = () => {
    navigate("/manual-entry"); // Redirect to /manual-entry route
  };

  return (
    <div className="flex min-h-screen items-center justify-center flex-col p-8">
      <h1 className="text-3xl font-bold mb-8">File Upload System</h1>

      {/* CSV Upload Section */}
      <div className="mb-8 p-6 border rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Upload CSV</h2>
        <input
          type="file"
          accept=".csv"
          onChange={handleCsvFileChange}
          className="mb-4"
        />
        <button
          onClick={handleCsvUpload}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Upload CSV
        </button>
        {csvMessage && <p className="mt-4 text-green-600">{csvMessage}</p>}
      </div>

      {/* Document Upload Section */}
      <div className="p-6 border rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Upload Question Paper</h2>
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleDocFileChange}
          className="mb-4"
        />
        <button
          onClick={handleDocUpload}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
        >
          Upload Document
        </button>
        <button
          onClick={handleFetchMcq}
          className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition-colors ml-4"
        >
          Fetch MCQs
        </button>
        {docMessage && <p className="mt-4 text-green-600">{docMessage}</p>}
      </div>

      {/* Manually Add Questions Button */}
      <button
        onClick={handleManualEntryRedirect}
        className="mt-8 bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors"
      >
        Manually Add Questions
      </button>

      {/* MCQ Display Section */}
      {mcqData && (
        <div className="mt-8 p-6 border rounded-lg w-full max-w-2xl">
          <h2 className="text-xl font-semibold mb-4">Generated MCQs</h2>
          <div className="space-y-6">
            {mcqData.map((mcq, index) => (
              <div key={mcq.id} className="p-4 bg-gray-100 rounded-lg">
                <p className="text-lg font-medium">
                  Q{index + 1}. {mcq.question}
                </p>
                <div className="mt-3 space-y-2">
                  {mcq.options.map((option, i) => (
                    <label key={i} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`question-${mcq.id}`}
                        value={option}
                        className="form-radio text-blue-600"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                <p className="mt-3 text-sm text-green-600">
                  Correct Answer: {mcq.correctAnswer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
