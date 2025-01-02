import {startTimer, stopTimer} from "./ui";

let responseInterval;

export async function handleUserRecognition(canvasDisplay) {

    // Konvertiere das Canvas in ein Blob-Objekt
    canvasDisplay.toBlob(blob => {

        const formData = new FormData();
        formData.append('file', blob, "frame.jpg");
        // Sende das Bild an den CompreFace-Server
        fetch('http://localhost:8000/api/v1/recognition/recognize', {
            method: "POST",
            headers: {"x-api-key": "8ae55877-1be4-4be4-8d86-3f72340023dc"},
            body: formData
        })
            .then((response) => {
                if (response.status !== 200)
                    throw new Error(`Error: ${response.status} ${response.statusText}`);

                console.log("Recognition success")

                startTimer()

                clearInterval(responseInterval);
                responseInterval = setInterval(function () {
                    handleUserRecognition(canvasDisplay)
                }, 5000);
            })
            .catch(error => {
                stopTimer();

                clearInterval(responseInterval);
                responseInterval = setInterval(function () {
                    handleUserRecognition(canvasDisplay)
                }, 2000);

                console.log("Recognition failed:", error)
            })
    }, 'image/jpeg', 0.95);
}