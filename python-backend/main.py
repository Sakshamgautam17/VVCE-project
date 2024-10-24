
from flask import Flask, jsonify
from flask_cors import CORS
from detection import ProctorDetector
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

detector = ProctorDetector()

if not os.path.exists('violations'):
    os.makedirs('violations')

@app.route('/start')
def start_detection():
    detector.start_detection()
    return {"status": "Detection started"}

@app.route('/stop')
def stop_detection():
    detector.stop_detection()
    return {"status": "Detection stopped"}

@app.route('/status')
def get_status():
    return jsonify(detector.get_status())

@app.route('/screenshot')
def take_screenshot():
    filename = detector.capture_screenshot()
    if filename:
        return {"status": "Screenshot saved", "filename": filename}
    return {"status": "Failed to capture screenshot"}, 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)