let timeIntervals = [];
let startTime = null;

// Start tracking time
export function startTracking() {
    startTime = new Date();
}

// Stop tracking time and record the interval
export function stopTracking() {
    if (startTime) {
        const endTime = new Date();
        timeIntervals.push({ start: startTime, end: endTime });
        startTime = null;
    }
}

// Get all tracked intervals
export function getTimeIntervals() {
    return timeIntervals;
}

// Export intervals as CSV
export function exportTimeIntervalsAsCSV() {
    if (timeIntervals.length === 0) {
        alert("No time intervals to export!");
        return;
    }

    const csvContent = "data:text/csv;charset=utf-8," +
        "Start Time,End Time,Duration (seconds)\n" +
        timeIntervals.map(interval => {
            const duration = Math.round((interval.end - interval.start) / 1000); // Calculate duration in seconds
            return `${interval.start.toISOString()},${interval.end.toISOString()},${duration}`;
        }).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "time_intervals.csv");
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
}
