const recordBtn = document.getElementById('recordBtn');
const statusText = document.getElementById('statusText');
const facecam = document.getElementById('facecam');
const splashScreen = document.getElementById('splash-screen');
const mainApp = document.getElementById('main-app');

let isRecording = false;
let startTime;

// 1. SHOW SPLASH SCREEN FOR 3 SECONDS, THEN OPEN THE APP
setTimeout(() => {
  splashScreen.style.opacity = '0'; // Start fade out
  
  setTimeout(() => {
    splashScreen.style.display = 'none'; // Remove splash screen completely
    mainApp.style.display = 'flex'; // Show the recorder app
    startFacecam(); // Turn on the camera
  }, 1000); // Wait 1 second for the fade to finish
  
}, 3000); // Wait 3 seconds before starting the fade


// 2. TURN ON SELFIE CAMERA
async function startFacecam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
    facecam.srcObject = stream;
    facecam.style.display = 'block';
  } catch (e) {
    console.log("Camera error:", e);
    alert("Please allow camera permission to use the selfie feature.");
  }
}

// 3. RECORDING LOGIC WITH AUDIO
recordBtn.addEventListener('click', async () => {
  if (!isRecording) {
    try {
      statusText.innerText = "Starting...";
      
      await Capacitor.Plugins.ScreenRecorder.start({
        notificationTitle: "GameRec Pro",
        notificationText: "Recording your screen...",
        recordAudio: true,
        isAudio: true
      });
      
      isRecording = true;
      recordBtn.style.background = '#555';
      startTime = Date.now();
      updateTimer();
      
    } catch (e) {
      statusText.innerText = "Error: " + e.message;
      alert("Error: " + e.message);
    }
  } else {
    try {
      statusText.innerText = "Saving...";
      recordBtn.style.background = '#ff4d67';
      
      await Capacitor.Plugins.ScreenRecorder.stop();
      
      isRecording = false;
      statusText.innerText = "Saved to Gallery!";
      alert("Video saved with Audio + Facecam!");
      
    } catch (e) {
      statusText.innerText = "Error: " + e.message;
    }
  }
});

function updateTimer() {
  if (!isRecording) return;
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  statusText.innerText = `🔴 Recording... ${seconds}s`;
  setTimeout(updateTimer, 1000);
  }
