const recordBtn = document.getElementById('recordBtn');
const statusText = document.getElementById('statusText');
const facecam = document.getElementById('facecam');
const splashScreen = document.getElementById('splash-screen');
const mainApp = document.getElementById('main-app');
const settingsModal = document.getElementById('settings-modal');

// Settings Elements
const toggleFacecam = document.getElementById('toggle-facecam');
const toggleAudio = document.getElementById('toggle-audio');
const toggleSplash = document.getElementById('toggle-splash');
const openSettingsBtn = document.getElementById('open-settings-btn');
const closeSettingsBtn = document.getElementById('close-settings-btn');

let isRecording = false;
let startTime;
let cameraStream = null;

// --- 1. LOAD SAVED SETTINGS ---
toggleFacecam.checked = localStorage.getItem('setting_facecam') !== 'false';
toggleAudio.checked = localStorage.getItem('setting_audio') !== 'false';
toggleSplash.checked = localStorage.getItem('setting_splash') !== 'false';

// --- 2. SPLASH SCREEN LOGIC ---
const showSplash = toggleSplash.checked;
if (showSplash) {
  setTimeout(() => {
    splashScreen.style.opacity = '0';
    setTimeout(() => {
      splashScreen.style.display = 'none';
      mainApp.style.display = 'flex';
      if (toggleFacecam.checked) startFacecam();
    }, 1000);
  }, 3000);
} else {
  // Skip splash if disabled
  splashScreen.style.display = 'none';
  mainApp.style.display = 'flex';
  if (toggleFacecam.checked) startFacecam();
}

// --- 3. SETTINGS MENU LOGIC ---
openSettingsBtn.addEventListener('click', () => settingsModal.style.display = 'flex');
closeSettingsBtn.addEventListener('click', () => settingsModal.style.display = 'none');

toggleFacecam.addEventListener('change', () => {
  localStorage.setItem('setting_facecam', toggleFacecam.checked);
  if (toggleFacecam.checked) {
    startFacecam();
  } else {
    stopFacecam();
  }
});

toggleAudio.addEventListener('change', () => {
  localStorage.setItem('setting_audio', toggleAudio.checked);
});

toggleSplash.addEventListener('change', () => {
  localStorage.setItem('setting_splash', toggleSplash.checked);
});

// --- 4. CAMERA LOGIC ---
async function startFacecam() {
  if (cameraStream) return; // Already running
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
    facecam.srcObject = cameraStream;
    facecam.style.display = 'block';
  } catch (e) {
    console.log("Camera error:", e);
  }
}

function stopFacecam() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
    facecam.srcObject = null;
    facecam.style.display = 'none';
  }
}

// --- 5. RECORDING LOGIC ---
recordBtn.addEventListener('click', async () => {
  if (!isRecording) {
    try {
      statusText.innerText = "Starting...";
      
      const recordAudio = toggleAudio.checked; // Check setting
      
      await Capacitor.Plugins.ScreenRecorder.start({
        notificationTitle: "GameRec Pro",
        notificationText: "Recording your screen...",
        recordAudio: recordAudio,
        isAudio: recordAudio
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
      alert("Video saved!");
      
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
