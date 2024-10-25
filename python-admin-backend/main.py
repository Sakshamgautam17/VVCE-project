from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import pandas as pd
import random
import string
import os
import json
from docx import Document
import fitz  # PyMuPDF
import google.generativeai as genai
from werkzeug.utils import secure_filename

# Initialize Flask app and CORS
app = Flask(__name__)
CORS(app)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Configure Gemini
genai.configure(api_key="AIzaSyBUMe2-XC6k-z0Y2C0vPy1ySu7mTVqH7Fc")
model = genai.GenerativeModel("gemini-1.5-flash")

# Direct MongoDB connection
client = MongoClient("mongodb+srv://gautamsaksham17:DqdrBPdjzQ6NpREU@cluster0.byhmz.mongodb.net/")
db = client['test']
users_collection = db['users']

def generate_random_password(length=8):
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

def extract_text_from_docx(file_path):
    doc = Document(file_path)
    return "\n".join([para.text for para in doc.paragraphs if para.text.strip()])

def extract_text_from_pdf(file_path):
    pdf_text = ""
    with fitz.open(file_path) as pdf:
        for page in pdf:
            pdf_text += page.get_text()
    return pdf_text

def extract_text_from_txt(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

def get_mcq_json_from_text(input_text):
    prompt = f"Extract the following text into MCQs in JSON format, with each question's structure as:\n" \
             f"[{{'id': <id>, 'question': <question>, 'options': <options>, 'correctAnswer': <correctAnswer>}}]\n\n" \
             f"Text:\n{input_text}\n" \
             f"JUST GIVE THE JSON TEXT.. no need of formatting by using tripe quotes json and using slash n and stuff.. just json text so that i can be used and parsed"

    response = model.generate_content(prompt)
    return response.text

@app.route('/')
def hello_world():
    return {"message": "Hello World"}

@app.route('/upload-csv', methods=['POST'])
def upload_csv():
    file = request.files.get('file')
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    df = pd.read_csv(file)
    users = []

    for _, row in df.iterrows():
        password = generate_random_password()
        user = {
            "name": row['name'],
            "email": row['mail'],
            "password": password
        }
        users.append(user)

    if users:
        users_collection.insert_many(users)

    return jsonify({"message": "Users added successfully"}), 201

@app.route('/upload-document', methods=['POST'])
def upload_document():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    # Extract the file extension
    file_extension = os.path.splitext(file.filename)[1]
    # Set the constant filename with the original extension
    filename = f"exam{file_extension}"
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    return jsonify({"message": "Document uploaded successfully"}), 201


@app.route('/fetch-mcq', methods=['GET'])
def fetch_mcq():
    try:
        uploaded_files = os.listdir(UPLOAD_FOLDER)
        if not uploaded_files:
            return jsonify({"error": "No file found"}), 404

        file_path = os.path.join(UPLOAD_FOLDER, uploaded_files[0])
        
        if file_path.endswith('.docx'):
            text = extract_text_from_docx(file_path)
        elif file_path.endswith('.pdf'):
            text = extract_text_from_pdf(file_path)
        elif file_path.endswith('.txt'):
            text = extract_text_from_txt(file_path)
        else:
            return jsonify({"error": "Unsupported file format"}), 400

        mcq_json = get_mcq_json_from_text(text)

        return jsonify({
            "message": "MCQs fetched successfully",
            "mcq_data": json.loads(mcq_json)
        }), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/add-student', methods=['POST'])
def add_student():
    try:
        data = request.json
        password = generate_random_password()
        user = {
            "name": data['name'],
            "email": data['email'],
            "password": password
        }
        users_collection.insert_one(user)
        return jsonify({
            "message": f"Student added successfully. Password: {password}"
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/add-question', methods=['POST'])
def add_question():
    try:
        data = request.json
        
        # Create the file if it doesn't exist
        file_path = os.path.join(UPLOAD_FOLDER, 'exam.txt')
        
        # Format the question
        question_text = (
            f"\n {data['question']}\n"
            f"Options:\n"
            f"1. {data['options'][0]}\n"
            f"2. {data['options'][1]}\n"
            f"3. {data['options'][2]}\n"
            f"4. {data['options'][3]}\n"
            f"Correct Answer: {data['correctAnswer']}\n"
        )
        
        # Append the question to the file
        with open(file_path, 'a', encoding='utf-8') as file:
            file.write(question_text)
        
        return jsonify({
            "message": "Question added successfully"
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
