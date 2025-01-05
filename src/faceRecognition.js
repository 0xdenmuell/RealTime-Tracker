import * as faceapi from 'face-api.js';

const canvasDisplay = document.getElementById("canvasDisplay");

export async function initRecognition() {
    await loadModels();
    await faceapi.detectSingleFace(canvasDisplay, new faceapi.TinyFaceDetectorOptions())
}

// Lade die Modelle
async function loadModels() {
    const modelPath = '/models'; // Verzeichnis zu den Modellen
    await faceapi.loadTinyFaceDetectorModel(modelPath);
    console.log('Models loaded');
}

export async function isFaceDetected() {
    // Erkennung durchführen
    const detections =
        await faceapi.detectAllFaces(canvasDisplay, new faceapi.TinyFaceDetectorOptions())

    return detections.length > 0;
}


