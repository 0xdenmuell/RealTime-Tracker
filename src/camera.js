import {handleUserRecognition} from "./faceRecognition";

const video = document.getElementById("live");
const canvasDisplay = document.getElementById("canvasDisplay");
let animationFrameId;

export async function handleClickOnCameraEvent() {
    try {
        // Request access to the camera
        video.srcObject = await navigator.mediaDevices.getUserMedia({video: true});

        // Start the video stream once it is available
        await new Promise((resolve) => {
            video.onloadedmetadata = () => {
                // Adjust the canvas size to match the video resolution
                canvasDisplay.width = video.videoWidth;
                canvasDisplay.height = video.videoHeight;

                // Start the video
                video.play();
                resolve();
            };
        });

        const ctx = canvasDisplay.getContext("2d");

        // Function to continuously draw the video frame on the canvas
        const drawCameraFrame = () => {
            ctx.drawImage(video, 0, 0, canvasDisplay.width, canvasDisplay.height);
            animationFrameId = requestAnimationFrame(drawCameraFrame);
        };

        // Start rendering the video frames
        drawCameraFrame();

        // Start user recognition
        await handleUserRecognition(canvasDisplay);
    } catch (err) {
        console.error("Camera error:", err.message);
    }
}

export async function handleClickOffCameraEvent() {
    try {
        // Stop the camera stream
        const stream = video.srcObject;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }
        video.srcObject = null;

        // Clear the canvas
        const ctx = canvasDisplay.getContext("2d");
        ctx.clearRect(0, 0, canvasDisplay.width, canvasDisplay.height);

        // Stop the animation
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    } catch (err) {
        console.error("Error disabling the camera:", err.message);
    }
}
