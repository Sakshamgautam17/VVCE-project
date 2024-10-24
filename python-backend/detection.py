import cv2
import torch
from PIL import Image
import threading
import time

class ProctorDetector:
    def __init__(self):
        self.model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
        self.cap = None
        self.running = False
        self.person_count = 0
        self.cellphone_detected = False
        self.lock = threading.Lock()

    def start_detection(self):
        if not self.running:
            self.cap = cv2.VideoCapture(0)
            self.running = True
            self.detection_thread = threading.Thread(target=self._detection_loop)
            self.detection_thread.start()

    def stop_detection(self):
        self.running = False
        if self.cap:
            self.cap.release()

    def get_status(self):
        with self.lock:
            return {
                "person_count": self.person_count,
                "cellphone_detected": self.cellphone_detected
            }

    def _detection_loop(self):
        while self.running:
            ret, frame = self.cap.read()
            if not ret:
                continue

            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.model(rgb_frame)

            current_person_count = 0
            current_cellphone_detected = False

            for *box, conf, cls in results.xyxy[0]:
                if conf > 0.5:
                    label = self.model.names[int(cls)]
                    if label == 'person':
                        current_person_count += 1
                    elif label == 'cell phone':
                        current_cellphone_detected = True

            with self.lock:
                self.person_count = current_person_count
                self.cellphone_detected = current_cellphone_detected

            time.sleep(0.1)  # Small delay to prevent excessive CPU usage
    
    def capture_screenshot(self):
        if self.cap and self.cap.isOpened():
            ret, frame = self.cap.read()
            if ret:
                timestamp = time.strftime("%Y%m%d-%H%M%S")
                filename = f"violation_{timestamp}.jpg"
                cv2.imwrite(f"violations/{filename}", frame)
                return filename
        return None