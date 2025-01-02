import {handleClickOffCameraEvent, handleClickOnCameraEvent} from "./camera";
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

// Timer to calculate worked time
export function startTimer() {
    if (isTimerOn) return
    timerInterval = setInterval(() => {
        updateTimer()
    }, 1000);
    isTimerOn = true;
}

export function updateTimer() {
    workedTime++;
    const hours = String(Math.floor(workedTime / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((workedTime % 3600) / 60)).padStart(2, '0');
    const seconds = String(workedTime % 60).padStart(2, '0');
    workedTimeDisplay.textContent = `Worked Time: ${hours}:${minutes}:${seconds}`;
}

export function stopTimer() {
    if (!isTimerOn) return
    clearInterval(timerInterval);
    isTimerOn = false;
}

// Toggle Webcam
toggleCameraBtn.addEventListener("click", () => {
    if (!isCameraOn) {
        clickOnCameraEvent()
    } else if (isCameraOn) {
        clickOffCameraEvent()
    }
});

export function clickOnCameraEvent() {
    handleClickOnCameraEvent().then(() => {
            isCameraOn = true
            isTimerOn = true
            toggleCameraBtn.textContent = "Turn Off Camera";
            startTimer()

        }
    ).catch(
        (err) => {
            showStatusMessage(err, 'warning')
            isCameraOn = true
            isTimerOn = false
            toggleCameraBtn.textContent = "Turn On Camera";
            stopTimer()
        }
    )
}

export function clickOffCameraEvent() {
    handleClickOffCameraEvent().then(() => {
            isCameraOn = false
            isTimerOn = false
            toggleCameraBtn.textContent = "Turn On Camera";
        }
    ).catch(
        (err) => {
            showStatusMessage(err, 'warning')
            isCameraOn = true
            isTimerOn = true
            toggleCameraBtn.textContent = "Turn Off Camera";
        }
    );
}

// Example: Show a status message dynamically
function showStatusMessage(message, type = "info") {
    console.log(message);

    statusElement.textContent = message;
    statusElement.className = `alert alert-${type}`; // Bootstrap alert type
    statusElement.style.display = "block";
    setTimeout(() => {
        statusElement.style.display = "none";
    }, 5000); // Hide after 5 seconds
}

/*
// Add Interval Details
export function addDetail() {
    const now = new Date();
    const detail = document.createElement("li");
    detail.classList.add("list-group-item");
    detail.textContent = `Date: ${now.toLocaleDateString()}, Time: ${now.toLocaleTimeString()}, Worked: ${workedTimeDisplay.textContent}`;
    detailsList.appendChild(detail);
}

// Export Details
exportDetailsBtn.addEventListener("click", () => {
    let details = "Date,Time,Worked Time\n";
    Array.from(detailsList.children).forEach(item => {
        details += item.textContent.replace(/, /g, ",") + "\n";
    });
    const blob = new Blob([details], {type: "text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "work_details.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});
*/
