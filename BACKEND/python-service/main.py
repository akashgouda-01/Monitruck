# python-service/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import base64
import cv2
import numpy as np
import mediapipe as mp

app = FastAPI()

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, refine_landmarks=True)

# EAR: Eye Aspect Ratio
def eye_aspect_ratio(eye):
    A = np.linalg.norm(eye[1] - eye[5])
    B = np.linalg.norm(eye[2] - eye[4])
    C = np.linalg.norm(eye[0] - eye[3])
    return (A + B) / (2.0 * C)

# MAR: Mouth Aspect Ratio
def mouth_aspect_ratio(mouth):
    A = np.linalg.norm(mouth[13] - mouth[19])
    B = np.linalg.norm(mouth[14] - mouth[18])
    C = np.linalg.norm(mouth[15] - mouth[17])
    D = np.linalg.norm(mouth[12] - mouth[16])  # Width
    return (A + B + C) / (3.0 * D)

class ImageRequest(BaseModel):
    image: str  # base64 string
    driverId: str

@app.post("/analyze")
async def analyze_image(request: ImageRequest):
    try:
        # Decode base64 image
        img_data = base64.b64decode(request.image.split(",")[1])  # remove data:image/...;base64,
        np_arr = np.frombuffer(img_data, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(rgb_frame)

        if not results.multi_face_landmarks:
            return {"driverId": request.driverId, "status": "awake", "confidence": 0.0}

        h, w, _ = frame.shape
        landmarks = results.multi_face_landmarks[0].landmark

        # Extract eye and mouth points
        left_eye = np.array([(landmarks[i].x * w, landmarks[i].y * h) for i in [33, 160, 158, 133, 153, 144]])
        right_eye = np.array([(landmarks[i].x * w, landmarks[i].y * h) for i in [362, 385, 387, 263, 373, 380]])
        mouth = np.array([(landmarks[i].x * w, landmarks[i].y * h) for i in [61, 82, 13, 311, 402, 14, 317, 95, 88, 178, 87, 146, 314, 405, 321, 375]])

        ear_left = eye_aspect_ratio(left_eye)
        ear_right = eye_aspect_ratio(right_eye)
        ear = (ear_left + ear_right) / 2.0

        mar = mouth_aspect_ratio(mouth)

        # Drowsiness logic
        if ear < 0.25 or mar > 0.55:
            status = "drowsy"
            confidence = max(1.0 - ear * 3, mar - 0.4)
        else:
            status = "awake"
            confidence = ear

        return {
            "driverId": request.driverId,
            "status": status,
            "confidence": round(float(confidence), 2)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))