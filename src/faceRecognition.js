const canvasDisplay = document.getElementById("canvasDisplay");

export async function handleUserRecognition() {
    try {
        const blob = await new Promise(resolve => {
            canvasDisplay.toBlob(resolve, 'image/jpeg', 0.95);
        });

        const formData = new FormData();
        formData.append('file', blob, "frame.jpg");

        const response = await fetchRecognitionResult(formData);
        if (!response.ok) {
            const body = await response.json();
            throw new Error(body.message);
        }

    } catch (error) {
        throw new Error(error);
    }
}

async function fetchRecognitionResult(formData) {
    try {
        const response = await fetch('http://localhost:8000/api/v1/recognition/recognize', {
            method: "POST",
            headers: { "x-api-key": "8ae55877-1be4-4be4-8d86-3f72340023dc" },
            body: formData
        });
        return response;
    } catch (error) {
        throw new Error("Network error: " + error.message);
    }
}
