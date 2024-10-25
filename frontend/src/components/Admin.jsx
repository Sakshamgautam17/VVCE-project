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

  // Event handlers
  const handleCsvFileChange = (e) => setCsvFile(e.target.files[0]);
  const handleDocFileChange = (e) => setDocFile(e.target.files[0]);

  const handleStudentFormChange = (e) => {
    setStudentFormData({
      ...studentFormData,
      [e.target.name]: e.target.value,
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
        options: newOptions,
      });
    } else {
      setQuestionFormData({
        ...questionFormData,
        [name]: value,
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
        message: data.message,
      });
      if (response.ok) {
        setStudentFormData({ name: '', email: '' });
      }
    } catch (error) {
      setFormMessage({
        type: 'error',
        message: 'Error adding student',
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
        message: data.message,
      });
      if (response.ok) {
        setQuestionFormData({
          question: '',
          options: ['', '', '', ''],
          correctAnswer: '',
        });
      }
    } catch (error) {
      setFormMessage({
        type: 'error',
        message: 'Error adding question',
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
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => setCsvMessage(data.message))
      .catch((error) => {
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
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => setDocMessage(data.message))
      .catch((error) => {
        console.error('Error:', error);
        setDocMessage('Error uploading document');
      });
  };

  const handleFetchMcq = () => {
    fetch('http://127.0.0.1:5001/fetch-mcq', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.mcq_data) {
          setMcqData(data.mcq_data);
          setDocMessage('MCQs fetched successfully');
        } else {
          setDocMessage(data.error || 'Failed to fetch MCQs');
          setMcqData(null);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setDocMessage('Error fetching MCQs');
        setMcqData(null);
      });
  };

  return (
    <div className="flex min-h-screen flex-col p-8 bg-base-200">
      <h1 className="text-4xl font-bold mb-8 text-center text-primary">Admin Dashboard</h1>

      {formMessage.message && (
        <div
          className={`alert ${
            formMessage.type === 'success' ? 'alert-success' : 'alert-error'
          } mb-6 shadow-lg`}
        >
          <div>
            <span>{formMessage.message}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto w-full">
        {/* Student Management Section */}
        <div className="card bg-base-100 shadow-lg p-6 space-y-6">
          <h2 className="card-title text-xl text-secondary">Student Management</h2>

          <div className="p-4 bg-base-200 rounded-lg">
            <h3 className="text-lg font-medium">Upload Student List (CSV)</h3>
            <input
              type="file"
              accept=".csv"
              onChange={handleCsvFileChange}
              className="mb-4 w-full file-input file-input-bordered"
            />
            <button
              onClick={handleCsvUpload}
              className="btn btn-primary w-full"
            >
              Upload CSV
            </button>
            {csvMessage && <p className="mt-2 text-sm text-success">{csvMessage}</p>}
          </div>

          <form onSubmit={handleStudentSubmit} className="space-y-4">
            <h3 className="text-lg font-medium">Add Individual Student</h3>
            <input
              type="text"
              name="name"
              placeholder="Student Name"
              value={studentFormData.name}
              onChange={handleStudentFormChange}
              className="input input-bordered w-full"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Student Email"
              value={studentFormData.email}
              onChange={handleStudentFormChange}
              className="input input-bordered w-full"
              required
            />
            <button type="submit" className="btn btn-primary w-full">
              Add Student
            </button>
          </form>
        </div>

        {/* Question Management Section */}
        <div className="card bg-base-100 shadow-lg p-6 space-y-6">
          <h2 className="card-title text-xl text-secondary">Question Management</h2>

          <div className="p-4 bg-base-200 rounded-lg">
            <h3 className="text-lg font-medium">Upload Question Paper</h3>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleDocFileChange}
              className="mb-4 w-full file-input file-input-bordered"
            />
            <div className="flex gap-2">
              <button
                onClick={handleDocUpload}
                className="btn btn-secondary flex-1"
              >
                Upload Document
              </button>
              <button
                onClick={handleFetchMcq}
                className="btn btn-accent flex-1"
              >
                Fetch MCQs
              </button>
            </div>
            {docMessage && <p className="mt-2 text-sm text-success">{docMessage}</p>}
          </div>

          <form onSubmit={handleQuestionSubmit} className="space-y-4">
            <h3 className="text-lg font-medium">Add Individual Question</h3>
            <textarea
              name="question"
              placeholder="Question Text"
              value={questionFormData.question}
              onChange={handleQuestionFormChange}
              className="textarea textarea-bordered w-full"
              required
              rows="3"
            />
            {questionFormData.options.map((option, index) => (
              <input
                key={index}
                type="text"
                name={`option${index + 1}`}
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={handleQuestionFormChange}
                className="input input-bordered w-full"
                required
              />
            ))}
            <input
              type="text"
              name="correctAnswer"
              placeholder="Correct Answer"
              value={questionFormData.correctAnswer}
              onChange={handleQuestionFormChange}
              className="input input-bordered w-full"
              required
            />
            <button type="submit" className="btn btn-secondary w-full">
              Add Question
            </button>
          </form>
        </div>
      </div>

      {mcqData && (
        <div className="mt-12">
          <h3 className="text-lg font-medium text-center text-primary">Fetched MCQs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {mcqData.map((mcq, index) => (
              <div key={index} className="card bg-base-100 shadow-md p-4">
                <h4 className="font-semibold">{mcq.question}</h4>
                <ul className="list-disc ml-4">
                  {mcq.options.map((option, i) => (
                    <li key={i}>{option}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
