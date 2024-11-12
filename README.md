
# Procx: Automated Online Proctoring System

Procx is a fully automated online proctoring system utilizing OpenCV and YOLO for real-time facial recognition, multi-person detection, cellphone detection, and audio monitoring to ensure a secure testing environment.
Note: We are still working on making it proper full stack version, while it has all the essential proctoring features installed now. We will add the proper login/signup setup in due time.

## Features

- **Facial Recognition**: Ensures only the designated test-taker is present.
- **Multiple/No Person Detection**: Alerts if no person or multiple people appear.
- **Cellphone Detection**: Detects unauthorized phone usage.

## Requirements

- Node.js and npm
- MongoDB
- Python (with necessary dependencies for OpenCV and YOLO)

## Setup Instructions

1. **Frontend**:
    - Navigate to the frontend directory:
      ```bash
      cd frontend
      ```
    - Start the development server:
      ```bash
      npm run dev
      ```

2. **Backend (MongoDB Server)**:
    - Navigate to the backend directory:
      ```bash
      cd backend
      ```
    - Start the MongoDB server:
      ```bash
      npm start
      ```

3. **Python Backend**:
    - For core proctoring functionality:
      ```bash
      cd python-backend
      python main.py
      ```

    - For admin management and uploads:
      ```bash
      cd python-admin-backend
      python main.py
      ```

## Login Information

- **Admin Login**: Use `arsh@g` as the username and `hi` as the password.
  - Upload question papers and student CSV list with usernames and passwords.
  
- **Student Login**: Default credentials are `test@g` with password `hi`.
  - This account can be used to check and test proctoring functionality.

## Notes

- Ensure all servers are running concurrently for full functionality.
- Verify all necessary Python dependencies for OpenCV and YOLO are installed in the Python backend environments.
