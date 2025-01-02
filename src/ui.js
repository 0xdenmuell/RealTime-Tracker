import { handleClickOffCameraEvent, handleClickOnCameraEvent } from "./camera";
import { startTracking, stopTracking, getTimeIntervals, exportTimeIntervalsAsCSV } from "./timeTracker";
import Logo from './logo.png';

const detailsList = document.getElementById("detailsList");
const workedTimeDisplay = document.getElementById("workedTime");
const statusElement = document.getElementById("statusMessage");

const toggleCameraBtn = document.getElementById("toggleCamera");
const exportDetailsBtn = document.getElementById("exportDetails");

let isCameraOn = false;
let isTimerOn = false;

let workedTime = 0;
let timerInterval;

//Webpack Logo import
const element = document.createElement('div');
const logoImage = new Image();
logoImage.src = Logo;
element.appendChild(logoImage);

// Timer logic
export function startTimer() {
    if (isTimerOn) return;

    startTracking();
    timerInterval = setInterval(() => updateTimer(), 1000);
    isTimerOn = true;
}

export function updateTimer() {
    workedTime++;
    const hours = String(Math.floor(workedTime / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((workedTime % 3600) / 60)).padStart(2, "0");
    const seconds = String(workedTime % 60).padStart(2, "0");
    workedTimeDisplay.textContent = `Worked Time: ${hours}:${minutes}:${seconds}`;
}

export function stopTimer() {
    if (!isTimerOn) return;

    stopTracking();
    clearInterval(timerInterval);
    isTimerOn = false;
}

// Update the details list
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


// Toggle webcam
toggleCameraBtn.addEventListener("click", () => {
    if (!isCameraOn) {
        handleClickOnCameraEvent()
            .then(() => {
                isCameraOn = true;
                toggleCameraBtn.textContent = "Turn Off Camera";
                startTimer();
                showStatusMessage("Recognition successful");
            })
            .catch(err => {
                showStatusMessage(err.message, "warning");
            });
    } else {
        handleClickOffCameraEvent()
            .then(() => {
                isCameraOn = false;
                toggleCameraBtn.textContent = "Turn On Camera";
                stopTimer();
                updateDetailsList();
            })
            .catch(err => {
                showStatusMessage(err.message, "warning");
            });
    }
});

// Export details button
exportDetailsBtn.addEventListener("click", () => {
    exportTimeIntervalsAsCSV();
});

// Show a status message
export function showStatusMessage(message, type = "info") {
    console.log(message);
    statusElement.textContent = message;
    statusElement.className = `alert alert-${type}`; // Bootstrap alert type
    statusElement.style.display = "block";
    setTimeout(() => {
        statusElement.style.display = "none";
    }, 5000); // Hide after 5 seconds
}
