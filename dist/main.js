/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/logo.png":
/*!**********************!*\
  !*** ./src/logo.png ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + \"/logo.png\");\n\n//# sourceURL=webpack://Realtime_Tracker/./src/logo.png?");

/***/ }),

/***/ "./src/camera.js":
/*!***********************!*\
  !*** ./src/camera.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   handleClickOffCameraEvent: () => (/* binding */ handleClickOffCameraEvent),\n/* harmony export */   handleClickOnCameraEvent: () => (/* binding */ handleClickOnCameraEvent)\n/* harmony export */ });\n/* harmony import */ var _faceRecognition__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./faceRecognition */ \"./src/faceRecognition.js\");\n\r\n\r\nconst video = document.getElementById(\"live\");\r\nconst canvasDisplay = document.getElementById(\"canvasDisplay\");\r\nlet animationFrameId;\r\n\r\nasync function handleClickOnCameraEvent() {\r\n    try {\r\n        // Request access to the camera\r\n        video.srcObject = await navigator.mediaDevices.getUserMedia({video: true});\r\n\r\n        // Start the video stream once it is available\r\n        await new Promise((resolve) => {\r\n            video.onloadedmetadata = () => {\r\n                // Adjust the canvas size to match the video resolution\r\n                canvasDisplay.width = video.videoWidth;\r\n                canvasDisplay.height = video.videoHeight;\r\n\r\n                // Start the video\r\n                video.play();\r\n                resolve();\r\n            };\r\n        });\r\n\r\n        const ctx = canvasDisplay.getContext(\"2d\");\r\n\r\n        // Function to continuously draw the video frame on the canvas\r\n        const drawCameraFrame = () => {\r\n            ctx.drawImage(video, 0, 0, canvasDisplay.width, canvasDisplay.height);\r\n            animationFrameId = requestAnimationFrame(drawCameraFrame);\r\n        };\r\n\r\n        // Start rendering the video frames\r\n        drawCameraFrame();\r\n\r\n        // Start user recognition\r\n        await (0,_faceRecognition__WEBPACK_IMPORTED_MODULE_0__.handleUserRecognition)(canvasDisplay);\r\n    } catch (err) {\r\n        console.error(\"Camera error:\", err.message);\r\n    }\r\n}\r\n\r\nasync function handleClickOffCameraEvent() {\r\n    try {\r\n        // Stop the camera stream\r\n        const stream = video.srcObject;\r\n        if (stream) {\r\n            const tracks = stream.getTracks();\r\n            tracks.forEach(track => track.stop());\r\n        }\r\n        video.srcObject = null;\r\n\r\n        // Clear the canvas\r\n        const ctx = canvasDisplay.getContext(\"2d\");\r\n        ctx.clearRect(0, 0, canvasDisplay.width, canvasDisplay.height);\r\n\r\n        // Stop the animation\r\n        if (animationFrameId) {\r\n            cancelAnimationFrame(animationFrameId);\r\n        }\r\n    } catch (err) {\r\n        console.error(\"Error disabling the camera:\", err.message);\r\n    }\r\n}\r\n\n\n//# sourceURL=webpack://Realtime_Tracker/./src/camera.js?");

/***/ }),

/***/ "./src/faceRecognition.js":
/*!********************************!*\
  !*** ./src/faceRecognition.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   handleUserRecognition: () => (/* binding */ handleUserRecognition)\n/* harmony export */ });\n/* harmony import */ var _ui__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui */ \"./src/ui.js\");\n\r\n\r\nlet responseInterval;\r\n\r\nasync function handleUserRecognition(canvasDisplay) {\r\n\r\n    // Konvertiere das Canvas in ein Blob-Objekt\r\n    canvasDisplay.toBlob(blob => {\r\n\r\n        const formData = new FormData();\r\n        formData.append('file', blob, \"frame.jpg\");\r\n        // Sende das Bild an den CompreFace-Server\r\n        fetch('http://localhost:8000/api/v1/recognition/recognize', {\r\n            method: \"POST\",\r\n            headers: {\"x-api-key\": \"8ae55877-1be4-4be4-8d86-3f72340023dc\"},\r\n            body: formData\r\n        })\r\n            .then((response) => {\r\n                if (response.status !== 200)\r\n                    throw new Error(`Error: ${response.status} ${response.statusText}`);\r\n\r\n                console.log(\"Recognition success\")\r\n\r\n                ;(0,_ui__WEBPACK_IMPORTED_MODULE_0__.startTimer)()\r\n\r\n                clearInterval(responseInterval);\r\n                responseInterval = setInterval(function () {\r\n                    handleUserRecognition(canvasDisplay)\r\n                }, 5000);\r\n            })\r\n            .catch(error => {\r\n                (0,_ui__WEBPACK_IMPORTED_MODULE_0__.stopTimer)();\r\n\r\n                clearInterval(responseInterval);\r\n                responseInterval = setInterval(function () {\r\n                    handleUserRecognition(canvasDisplay)\r\n                }, 2000);\r\n\r\n                console.log(\"Recognition failed:\", error)\r\n            })\r\n    }, 'image/jpeg', 0.95);\r\n}\n\n//# sourceURL=webpack://Realtime_Tracker/./src/faceRecognition.js?");

/***/ }),

/***/ "./src/timeTracker.js":
/*!****************************!*\
  !*** ./src/timeTracker.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   exportTimeIntervalsAsCSV: () => (/* binding */ exportTimeIntervalsAsCSV),\n/* harmony export */   getTimeIntervals: () => (/* binding */ getTimeIntervals),\n/* harmony export */   startTracking: () => (/* binding */ startTracking),\n/* harmony export */   stopTracking: () => (/* binding */ stopTracking)\n/* harmony export */ });\nlet timeIntervals = [];\r\nlet startTime = null;\r\n\r\n// Start tracking time\r\nfunction startTracking() {\r\n    startTime = new Date();\r\n}\r\n\r\n// Stop tracking time and record the interval\r\nfunction stopTracking() {\r\n    if (startTime) {\r\n        const endTime = new Date();\r\n        timeIntervals.push({ start: startTime, end: endTime });\r\n        startTime = null;\r\n    }\r\n}\r\n\r\n// Get all tracked intervals\r\nfunction getTimeIntervals() {\r\n    return timeIntervals;\r\n}\r\n\r\n// Export intervals as CSV\r\nfunction exportTimeIntervalsAsCSV() {\r\n    if (timeIntervals.length === 0) {\r\n        alert(\"No time intervals to export!\");\r\n        return;\r\n    }\r\n\r\n    const csvContent = \"data:text/csv;charset=utf-8,\" +\r\n        \"Start Time,End Time,Duration (seconds)\\n\" +\r\n        timeIntervals.map(interval => {\r\n            const duration = Math.round((interval.end - interval.start) / 1000); // Calculate duration in seconds\r\n            return `${interval.start.toISOString()},${interval.end.toISOString()},${duration}`;\r\n        }).join(\"\\n\");\r\n\r\n    const encodedUri = encodeURI(csvContent);\r\n    const link = document.createElement(\"a\");\r\n    link.setAttribute(\"href\", encodedUri);\r\n    link.setAttribute(\"download\", \"time_intervals.csv\");\r\n    document.body.appendChild(link);\r\n\r\n    link.click();\r\n    document.body.removeChild(link);\r\n}\r\n\n\n//# sourceURL=webpack://Realtime_Tracker/./src/timeTracker.js?");

/***/ }),

/***/ "./src/ui.js":
/*!*******************!*\
  !*** ./src/ui.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   showStatusMessage: () => (/* binding */ showStatusMessage),\n/* harmony export */   startTimer: () => (/* binding */ startTimer),\n/* harmony export */   stopTimer: () => (/* binding */ stopTimer),\n/* harmony export */   updateDetailsList: () => (/* binding */ updateDetailsList),\n/* harmony export */   updateTimer: () => (/* binding */ updateTimer)\n/* harmony export */ });\n/* harmony import */ var _camera__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./camera */ \"./src/camera.js\");\n/* harmony import */ var _timeTracker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./timeTracker */ \"./src/timeTracker.js\");\n/* harmony import */ var _logo_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./logo.png */ \"./src/logo.png\");\n\r\n\r\n\r\n\r\nconst detailsList = document.getElementById(\"detailsList\");\r\nconst workedTimeDisplay = document.getElementById(\"workedTime\");\r\nconst statusElement = document.getElementById(\"statusMessage\");\r\n\r\nconst toggleCameraBtn = document.getElementById(\"toggleCamera\");\r\nconst exportDetailsBtn = document.getElementById(\"exportDetails\");\r\n\r\nlet isCameraOn = false;\r\nlet isTimerOn = false;\r\n\r\nlet workedTime = 0;\r\nlet timerInterval;\r\n\r\n//Webpack Logo import\r\nconst element = document.createElement('div');\r\nconst logoImage = new Image();\r\nlogoImage.src = _logo_png__WEBPACK_IMPORTED_MODULE_2__[\"default\"];\r\nelement.appendChild(logoImage);\r\n\r\n// Timer logic\r\nfunction startTimer() {\r\n    if (isTimerOn) return;\r\n\r\n    (0,_timeTracker__WEBPACK_IMPORTED_MODULE_1__.startTracking)();\r\n    timerInterval = setInterval(() => updateTimer(), 1000);\r\n    isTimerOn = true;\r\n}\r\n\r\nfunction updateTimer() {\r\n    workedTime++;\r\n    const hours = String(Math.floor(workedTime / 3600)).padStart(2, \"0\");\r\n    const minutes = String(Math.floor((workedTime % 3600) / 60)).padStart(2, \"0\");\r\n    const seconds = String(workedTime % 60).padStart(2, \"0\");\r\n    workedTimeDisplay.textContent = `Worked Time: ${hours}:${minutes}:${seconds}`;\r\n}\r\n\r\nfunction stopTimer() {\r\n    if (!isTimerOn) return;\r\n\r\n    (0,_timeTracker__WEBPACK_IMPORTED_MODULE_1__.stopTracking)();\r\n    clearInterval(timerInterval);\r\n    isTimerOn = false;\r\n}\r\n\r\n// Update the details list\r\nfunction updateDetailsList() {\r\n    detailsList.innerHTML = \"\"; // Clear the list\r\n    const intervals = (0,_timeTracker__WEBPACK_IMPORTED_MODULE_1__.getTimeIntervals)();\r\n    intervals.forEach((interval, index) => {\r\n        const durationInSeconds = Math.round((interval.end - interval.start) / 1000); // Duration in seconds\r\n        const hours = Math.floor(durationInSeconds / 3600);\r\n        const minutes = Math.floor((durationInSeconds % 3600) / 60);\r\n        const seconds = durationInSeconds % 60;\r\n\r\n        // Format duration\r\n        const durationFormatted = `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m ` : ''}${seconds}s`;\r\n\r\n        const listItem = document.createElement(\"li\");\r\n        listItem.className = \"list-group-item\";\r\n        listItem.textContent = `Interval ${index + 1}: ${interval.start.toLocaleTimeString()} - ${interval.end.toLocaleTimeString()}, Duration: ${durationFormatted}`;\r\n        detailsList.appendChild(listItem);\r\n    });\r\n}\r\n\r\n\r\n// Toggle webcam\r\ntoggleCameraBtn.addEventListener(\"click\", () => {\r\n    if (!isCameraOn) {\r\n        (0,_camera__WEBPACK_IMPORTED_MODULE_0__.handleClickOnCameraEvent)()\r\n            .then(() => {\r\n                isCameraOn = true;\r\n                toggleCameraBtn.textContent = \"Turn Off Camera\";\r\n                startTimer();\r\n                showStatusMessage(\"Recognition successful\");\r\n            })\r\n            .catch(err => {\r\n                showStatusMessage(err.message, \"warning\");\r\n            });\r\n    } else {\r\n        (0,_camera__WEBPACK_IMPORTED_MODULE_0__.handleClickOffCameraEvent)()\r\n            .then(() => {\r\n                isCameraOn = false;\r\n                toggleCameraBtn.textContent = \"Turn On Camera\";\r\n                stopTimer();\r\n                updateDetailsList();\r\n            })\r\n            .catch(err => {\r\n                showStatusMessage(err.message, \"warning\");\r\n            });\r\n    }\r\n});\r\n\r\n// Export details button\r\nexportDetailsBtn.addEventListener(\"click\", () => {\r\n    (0,_timeTracker__WEBPACK_IMPORTED_MODULE_1__.exportTimeIntervalsAsCSV)();\r\n});\r\n\r\n// Show a status message\r\nfunction showStatusMessage(message, type = \"info\") {\r\n    console.log(message);\r\n    statusElement.textContent = message;\r\n    statusElement.className = `alert alert-${type}`; // Bootstrap alert type\r\n    statusElement.style.display = \"block\";\r\n    setTimeout(() => {\r\n        statusElement.style.display = \"none\";\r\n    }, 5000); // Hide after 5 seconds\r\n}\r\n\n\n//# sourceURL=webpack://Realtime_Tracker/./src/ui.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT')
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/ui.js");
/******/ 	
/******/ })()
;