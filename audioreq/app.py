from flask import Flask, render_template, request, jsonify
import pathlib
import google.generativeai as genai

app = Flask(__name__)

# Initialize the Gemini model
genai.configure(api_key="AIzaSyBUMe2-XC6k-z0Y2C0vPy1ySu7mTVqH7Fc")  # Replace with your API key
model = genai.GenerativeModel('models/gemini-1.5-flash')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file'}), 400
    
    # Save the audio file
    audio = request.files['audio']
    audio_path = 'recorded_audio.mp3'
    audio.save(audio_path)
    
    # Transcribe the audio
    transcription_prompt = "Please transcribe the following audio input:"
    transcription_response = model.generate_content([
        transcription_prompt,
        {
            "mime_type": "audio/mp3",
            "data": pathlib.Path(audio_path).read_bytes()
        }
    ])
    
    transcribed_text = transcription_response.text.strip()
    return jsonify({'text': transcribed_text})

if __name__ == '__main__':
    app.run(debug=True,port=5003)