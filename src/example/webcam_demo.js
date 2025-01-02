const video = document.getElementById("webcam");
const canvas = document.getElementById("snapshot");
const result = document.getElementById("result");
const captureButton = document.getElementById("capture");

// API Config
const API_URL = "http://localhost:8000/api/v1/recognition/faces";
const API_KEY = "8ae55877-1be4-4be4-8d86-3f72340023dc";

// Start the webcam feed
async function startWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        console.error("Error accessing webcam: ", err);
        alert("Could not access the webcam. Please allow camera permissions.");
    }
}

// Capture the image from the video stream
function captureImage() {
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg");
}

// Send the image to CompreFace for analysis
async function analyzeImage(base64Image) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "x-api-key": API_KEY,
            },
            body: JSON.stringify({
                image_base64: base64Image.split(",")[1],
                subject: "test"// Remove the data URL prefix
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (data.result.length > 0) {
            result.textContent = `Faces detected: ${data.result.length}`;
        } else {
            result.textContent = "No faces detected.";
        }
    } catch (error) {
        console.error("Error analyzing image: ", error);
        result.textContent = "Error analyzing image.";
    }
}

// Event Listeners
captureButton.addEventListener("click", () => {
    const imageData = captureImage();
    analyzeImage(imageData);
});

// Initialize
startWebcam();
