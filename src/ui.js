// Import necessary event handlers from camera.js
import {disableCamera, enableCamera} from "./camera";

// Import time tracking functions from timeTracker.js
import {startTracking, stopTracking, getTimeIntervals, exportTimeIntervalsAsCSV} from "./timeTracker";

// Import the logo image file
import Logo from '../public/assets/logo.png';
import {initRecognition, isFaceDetected} from "./faceRecognition";


// Select DOM elements for UI interaction
const detailsList = document.getElementById("detailsList");
const workedTimeDisplay = document.getElementById("workedTime");
const statusElement = document.getElementById("statusMessage");

const toggleCameraBtn = document.getElementById("toggleCamera");
const exportDetailsBtn = document.getElementById("exportDetails");

// State variables to track camera and timer status
let isCameraOn = false;
let isTimerOn = false;

let workedTime = 0; // Timer counter in seconds
let timerInterval; // Reference to the timer interval

// Webpack-specific handling to display a logo in the UI
const element = document.createElement('div');
const logoImage = new Image();
logoImage.src = Logo;
element.appendChild(logoImage);

document.addEventListener('DOMContentLoaded', async () => {
    showStatusMessage("Loading App..");

    toggleCameraBtn.disabled = true;
    toggleCameraBtn.textContent = "Loading...";

    await initRecognition();

    // Enable button and remove spinner after loading is done
    toggleCameraBtn.disabled = false;
    toggleCameraBtn.textContent = "Turn On Camera";

    showStatusMessage("App ready!");
})

/**
 * Starts the work timer and begins time tracking if it is not already running.
 * Uses `setInterval` to update the time every second.
 */
export function startTimer() {
    if (isTimerOn) return;

    startTracking();
    timerInterval = setInterval(() => updateTimer(), 1000);
    isTimerOn = true;
}

/**
 * Updates the display showing the worked time in HH:MM:SS format.
 * This function is called every second when the timer is active.
 */
export function updateTimer() {
    workedTime++;
    const hours = String(Math.floor(workedTime / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((workedTime % 3600) / 60)).padStart(2, "0");
    const seconds = String(workedTime % 60).padStart(2, "0");
    workedTimeDisplay.textContent = `Worked Time: ${hours}:${minutes}:${seconds}`;
}

/**
 * Stops the timer and stops time tracking.
 * Clears the interval set by `startTimer` to halt time updates.
 */
export function stopTimer() {
    if (!isTimerOn) return;

    stopTracking();
    updateDetailsList()
    clearInterval(timerInterval);
    isTimerOn = false;
}

/**
 * Updates the details list in the UI with all recorded time intervals.
 * Each interval includes the start and end time, and the total duration formatted in hours, minutes, and seconds.
 */
export function updateDetailsList() {
    detailsList.innerHTML = ""; // Clear the list
    const intervals = getTimeIntervals();
    intervals.forEach((interval, index) => {
        const durationInSeconds = Math.round((interval.end - interval.start) / 1000); // Duration in seconds
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);
        const seconds = durationInSeconds % 60;

        // Format duration
        const durationFormatted = `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m ` : ''}${seconds}s`;

        const listItem = document.createElement("li");
        listItem.className = "list-group-item";
        listItem.textContent = `Interval ${index + 1}: ${interval.start.toLocaleTimeString()} - ${interval.end.toLocaleTimeString()}, Duration: ${durationFormatted}`;
        detailsList.appendChild(listItem);
    });
}

toggleCameraBtn.addEventListener("click", (event) => {
    if (!isCameraOn) {
        enableCamera()
            .then(() => {
                isCameraOn = true;
                toggleCameraBtn.textContent = "Turn Off Camera";

                showStatusMessage("Camera started. Recognition ongoing...");
                startRecognition();
            })
            .catch(err => {
                showStatusMessage(err.message, "danger");
            });
    } else {
        disableCamera()
            .then(() => {
                isCameraOn = false;
                toggleCameraBtn.textContent = "Turn On Camera";

                showStatusMessage("Camera stopped.");
                stopRecognition();
            })
            .catch(err => {
                    showStatusMessage(err.message, "danger");
                }
            );
    }
    event.stopImmediatePropagation()
})


let recognitionInterval;

export async function startRecognition() {
    async function startRecognitionLoop() {
        if (!isCameraOn) return

        if (await isFaceDetected()) {
            if (!isTimerOn)
                showStatusMessage("Face detected! Timer started.", "success");  // Using a 'success' alert type

            startTimer();
            recognitionInterval = 5000
        } else {
            stopTimer();
            if (isCameraOn) showStatusMessage("No face detected. Timer stopped.", "warning");

            updateDetailsList();
            recognitionInterval = 2000
        }
        setTimeout(startRecognitionLoop, recognitionInterval);
    }

    await startRecognitionLoop(); // Start the first cycle immediately
}

function stopRecognition() {
    stopTimer();
    clearTimeout(recognitionInterval)
}


/**
 * Triggers the export of time interval data as a CSV file when the export button is clicked.
 */
exportDetailsBtn.addEventListener("click", () => {
    exportTimeIntervalsAsCSV();
});

let statusMessageTimeout;

export function showStatusMessage(message, type = "info") {
    // Verhindert, dass mehrere Nachrichten gleichzeitig angezeigt werden
    clearTimeout(statusMessageTimeout);

    console.log(message);
    statusElement.textContent = message;
    statusElement.className = `alert alert-${type} text-center mx-2 my-3`; // Bootstrap alert type
    statusElement.style.display = "block";

    // Setzt den Timeout zurück
    statusMessageTimeout = setTimeout(() => {
        statusElement.style.display = "none";
    }, 10000); // Nachricht nach 10 Sekunden ausblenden
}