import { useState } from 'react';

function Admin() {
  // Existing state
  const [csvMessage, setCsvMessage] = useState('');
  const [docMessage, setDocMessage] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [docFile, setDocFile] = useState(null);
  const [mcqData, setMcqData] = useState(null);
  
  // Form state
  const [studentFormData, setStudentFormData] = useState({
    name: '',
    email: '',
  });
  
  const [questionFormData, setQuestionFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
  });
  
  const [formMessage, setFormMessage] = useState({ type: '', message: '' });

  // Event handlers (same as before)
  const handleCsvFileChange = (e) => setCsvFile(e.target.files[0]);
  const handleDocFileChange = (e) => setDocFile(e.target.files[0]);

  const handleStudentFormChange = (e) => {
    setStudentFormData({
      ...studentFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuestionFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('option')) {
      const optionIndex = parseInt(name.slice(-1)) - 1;
      const newOptions = [...questionFormData.options];
      newOptions[optionIndex] = value;
      setQuestionFormData({
        ...questionFormData,
        options: newOptions
      });
    } else {
      setQuestionFormData({
        ...questionFormData,
        [name]: value
      });
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5001/add-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentFormData),
      });
      const data = await response.json();
      setFormMessage({
        type: response.ok ? 'success' : 'error',
        message: data.message
      });
      if (response.ok) {
        setStudentFormData({ name: '', email: '' });
      }
    } catch (error) {
      setFormMessage({
        type: 'error',
        message: 'Error adding student'
      });
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5001/add-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionFormData),
      });
      const data = await response.json();
      setFormMessage({
        type: response.ok ? 'success' : 'error',
        message: data.message
      });
      if (response.ok) {
        setQuestionFormData({
          question: '',
          options: ['', '', '', ''],
          correctAnswer: ''
        });
      }
    } catch (error) {
      setFormMessage({
        type: 'error',
        message: 'Error adding question'
      });
    }
  };

  const handleCsvUpload = () => {
    if (!csvFile) {
      alert('Please upload a CSV file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);

    fetch('http://127.0.0.1:5001/upload-csv', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => setCsvMessage(data.message))
      .catch(error => {
        console.error('Error:', error);
        setCsvMessage('Error uploading file');
      });
  };

  const handleDocUpload = () => {
    if (!docFile) {
      alert('Please upload a document file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', docFile);

    fetch('http://127.0.0.1:5001/upload-document', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => setDocMessage(data.message))
      .catch(error => {
        console.error('Error:', error);
        setDocMessage('Error uploading document');
      });
  };

  const handleFetchMcq = () => {
    fetch('http://127.0.0.1:5001/fetch-mcq', {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        if (data.mcq_data) {
          setMcqData(data.mcq_data);
          setDocMessage("MCQs fetched successfully");
        } else {
          setDocMessage(data.error || 'Failed to fetch MCQs');
          setMcqData(null);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setDocMessage('Error fetching MCQs');
        setMcqData(null);
      });
  };

  return (
    <div className="flex min-h-screen flex-col p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>

      {formMessage.message && (
        <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
          formMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          <span className="text-2xl">
            {formMessage.type === 'success' ? '✓' : '⚠'}
          </span>
          <p>{formMessage.message}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto w-full">
        {/* Student Management Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Student Management</h2>
            
            {/* CSV Upload */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Upload Student List (CSV)</h3>
              <input 
                type="file" 
                accept=".csv" 
                onChange={handleCsvFileChange}
                className="mb-4 w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600" 
              />
              <button 
                onClick={handleCsvUpload} 
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
              >
                Upload CSV
              </button>
              {csvMessage && <p className="mt-2 text-sm text-green-600">{csvMessage}</p>}
            </div>

            {/* Manual Student Form */}
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <h3 className="text-lg font-medium">Add Individual Student</h3>
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Student Name"
                  value={studentFormData.name}
                  onChange={handleStudentFormChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Student Email"
                  value={studentFormData.email}
                  onChange={handleStudentFormChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
              >
                Add Student
              </button>
            </form>
          </div>
        </div>

        {/* Question Management Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Question Management</h2>
            
            {/* Document Upload */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Upload Question Paper</h3>
              <input 
                type="file" 
                accept=".pdf,.docx,.txt" 
                onChange={handleDocFileChange}
                className="mb-4 w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-500 file:text-white hover:file:bg-green-600" 
              />
              <div className="flex gap-2">
                <button 
                  onClick={handleDocUpload} 
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
                >
                  Upload Document
                </button>
                <button 
                  onClick={handleFetchMcq} 
                  className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition-colors"
                >
                  Fetch MCQs
                </button>
              </div>
              {docMessage && <p className="mt-2 text-sm text-green-600">{docMessage}</p>}
            </div>

            {/* Manual Question Form */}
            <form onSubmit={handleQuestionSubmit} className="space-y-4">
              <h3 className="text-lg font-medium">Add Individual Question</h3>
              <div>
                <textarea
                  name="question"
                  placeholder="Question Text"
                  value={questionFormData.question}
                  onChange={handleQuestionFormChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
                  required
                  rows="3"
                />
              </div>
              {questionFormData.options.map((option, index) => (
                <div key={index}>
                  <input
                    type="text"
                    name={`option${index + 1}`}
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={handleQuestionFormChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
                    required
                  />
                </div>
              ))}
              <select
                name="correctAnswer"
                value={questionFormData.correctAnswer}
                onChange={handleQuestionFormChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              >
                <option value="">Select correct answer</option>
                {questionFormData.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option || `Option ${index + 1}`}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
              >
                Add Question
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* MCQ Display Section */}
      {mcqData && (
        <div className="mt-8 max-w-6xl mx-auto w-full">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Generated MCQs</h2>
            <div className="space-y-6">
              {mcqData.map((mcq, index) => (
                <div key={mcq.id} className="p-4 bg-gray-50 rounded-lg">
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
        </div>
      )}
    </div>
  );
}

export default Admin;