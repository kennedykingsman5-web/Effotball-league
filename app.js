alert("App.js successfully loaded!");

const recordBtn = document.getElementById('recordBtn');
const statusText = document.getElementById('statusText');
const facecam = document.getElementById('facecam');
const settingsModal = document.getElementById('settings-modal');

let isRecording = false;
let startTime;
let cameraStream = null;

// SETTINGS
const toggleFacecam = document.getElementById('toggle-facecam');
const toggleAudio = document.getElementById('toggle-audio');
const toggleSplash = document.getElementById('toggle-splash');

toggleFacecam.checked = localStorage.getItem('setting_facecam') !== 'false';
toggleAudio.checked = localStorage.getItem('setting_audio') !== 'false';
toggleSplash.checked = localStorage.getItem('setting_splash') !== 'false';

// MENU
document.getElementById('open-settings-btn').addEventListener('click', () => {
  settingsModal.style.display = 'flex';
});
document.getElementById('close-settings-btn').addEventListener('click', () => {
  settingsModal.style.display = 'none';
});

toggleFacecam.addEventListener('change', () => {
  localStorage.setItem('setting_facecam', toggleFacecam.checked);
  if (toggleFacecam.checked) startFacecam();
  else stopFacecam();
});
toggleAudio.addEventListener('change', () => localStorage.setItem('setting_audio', toggleAudio.checked));
toggleSplash.addEventListener('change', () => localStorage.setItem('setting_splash', toggleSplash.checked));

// CAMERA
async function startFacecam() {
  if (cameraStream) return;
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
    facecam.srcObject = cameraStream;
    facecam.style.display = 'block';
  } catch (e) {
    alert("Camera Error: " + e.message);
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

// Start camera after splash screen
setTimeout(() => {
  if (toggleFacecam.checked) startFacecam();
}, 4000);

// RECORDING
recordBtn.addEventListener('click', async () => {
  if (!isRecording) {
    try {
      statusText.innerText = "Starting...";
      
      await Capacitor.Plugins.ScreenRecorder.start({
        notificationTitle: "GameRec Pro",
        notificationText: "Recording screen and audio...",
        recordAudio: toggleAudio.checked,
        isAudio: toggleAudio.checked
      });
      
      if (toggleFacecam.checked && Capacitor.Plugins.FloatingBubble) {
        await Capacitor.Plugins.FloatingBubble.show({
          title: "GameRec Cam",
          description: "Facecam active"
        });
      }

      isRecording = true;
      recordBtn.style.background = '#555';
      startTime = Date.now();
      updateTimer();
      
    } catch (e) {
      alert("Recorder Error: " + e.message);
      statusText.innerText = "Error";
    }
  } else {
    try {
      statusText.innerText = "Saving...";
      recordBtn.style.background = '#ff4d67';
      
      await Capacitor.Plugins.ScreenRecorder.stop();
      
      if (Capacitor.Plugins.FloatingBubble) {
        await Capacitor.Plugins.FloatingBubble.hide();
      }
      
      isRecording = false;
      statusText.innerText = "Saved to Gallery!";
      alert("Video and Audio saved!");
      
    } catch (e) {
      alert("Stop Error: " + e.message);
    }
  }
});

function updateTimer() {
  if (!isRecording) return;
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  statusText.innerText = `🔴 Recording... ${seconds}s`;
  setTimeout(updateTimer, 1000);
}
