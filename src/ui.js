// Import necessary event handlers from camera.js
import {disableCamera, enableCamera} from "./camera";

// Import time tracking functions from timeTracker.js
import {startTracking, stopTracking, getTimeIntervals, exportTimeIntervalsAsCSV} from "./timeTracker";

// Import the logo image file
import Logo from './logo.png';
import {handleUserRecognition} from "./faceRecognition";

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
let recognitionInterval;


// Webpack-specific handling to display a logo in the UI
const element = document.createElement('div');
const logoImage = new Image();
logoImage.src = Logo;
element.appendChild(logoImage);

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


toggleCameraBtn.addEventListener("click", () => {
    if (!isCameraOn) {
        enableCamera()
            .then(() => {
                isCameraOn = true;
                toggleCameraBtn.textContent = "Turn Off Camera";

                showStatusMessage("Camera started. Recognition ongoing...");
                startRecognitionLoop();
            })
            .catch(err => {
                showStatusMessage(err.message, "danger");
            });
    } else {
        disableCamera()
            .then(() => {
                isCameraOn = false;
                toggleCameraBtn.textContent = "Turn On Camera";

                stopTimer();
                showStatusMessage("Camera stopped.");
            })
            .catch(err => {
                showStatusMessage(err.message, "danger");
            });
    }
});


function startRecognitionLoop() {

    async function recognitionCycle() {
        if (!isCameraOn) return
        try {
            await handleUserRecognition().then(() => {
                if (!isTimerOn)
                    showStatusMessage("Face detected! Timer started.", "success");  // Using a 'success' alert type

                startTimer();
                recognitionInterval = 5000
            })
        } catch (err) {
            stopTimer();
            if (isCameraOn) showStatusMessage(err.message, "warning");
            updateDetailsList();
            recognitionInterval = 2000
        } finally {
            setTimeout(recognitionCycle, recognitionInterval);

        }
    }
    recognitionCycle(); // Start the first cycle immediately
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
    statusElement.className = `alert alert-${type}`; // Bootstrap alert type
    statusElement.style.display = "block";

    // Setzt den Timeout zurück
    statusMessageTimeout = setTimeout(() => {
        statusElement.style.display = "none";
    }, 10000); // Nachricht nach 10 Sekunden ausblenden
}
