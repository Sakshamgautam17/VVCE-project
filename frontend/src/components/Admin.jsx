import React, { useEffect, useState } from "react";
import Papa from "papaparse"; // Library for parsing CSV files

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Function to fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle CSV file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    // Parse the CSV file
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data;
        // Validate data if necessary
        uploadUsers(parsedData);
      },
      error: (error) => {
        setError("Failed to parse CSV file: " + error.message);
      },
    });
  };

  // Function to upload user data to the backend
  const uploadUsers = async (data) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/upload-students",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload users");
      }

      const result = await response.json();
      setSuccessMessage(result.message || "Users uploaded successfully!");
      setError("");
      fetchUsers(); // Refresh the user list after upload
    } catch (err) {
      setError(err.message);
      setSuccessMessage("");
    }
  };

  // Function to delete a user
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/users/${userId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }

        setSuccessMessage("User deleted successfully!");
        fetchUsers(); // Refresh the user list after deletion
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Function to handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="admin-dashboard p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Admin Dashboard
      </h1>
      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
      {successMessage && (
        <p className="text-green-600 mb-4 text-center">{successMessage}</p>
      )}

      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={handleSearch}
          className="input input-bordered w-full border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
        />
      </div>

      {/* File upload section */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Upload Students CSV:
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="input input-bordered w-full border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
        />
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">User List</h2>
      {users.length === 0 ? (
        <p className="text-center text-gray-600">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 border-b">
                <th className="p-3 text-left text-gray-700">ID</th>
                <th className="p-3 text-left text-gray-700">Name</th>
                <th className="p-3 text-left text-gray-700">Email</th>
                <th className="p-3 text-left text-gray-700">Role</th>
                <th className="p-3 text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter(
                  (user) =>
                    user.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((user, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="p-3">{user.id || index + 1}</td>{" "}
                    {/* Display index if ID is not available */}
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="btn btn-danger text-white bg-red-600 hover:bg-red-700 rounded-lg transition duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
