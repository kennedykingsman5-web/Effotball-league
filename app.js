const recordBtn = document.getElementById('recordBtn');
const statusText = document.getElementById('statusText');
const splashScreen = document.getElementById('splash-screen');
const mainApp = document.getElementById('main-app');
const settingsModal = document.getElementById('settings-modal');

let isRecording = false;
let startTime;

// SETTINGS
const toggleFacecam = document.getElementById('toggle-facecam');
const toggleAudio = document.getElementById('toggle-audio');
const toggleSplash = document.getElementById('toggle-splash');

// LOAD SETTINGS
toggleFacecam.checked = localStorage.getItem('setting_facecam') !== 'false';
toggleAudio.checked = localStorage.getItem('setting_audio') !== 'false';
toggleSplash.checked = localStorage.getItem('setting_splash') !== 'false';

// SPLASH SCREEN
if (toggleSplash.checked) {
  setTimeout(() => {
    splashScreen.style.opacity = '0';
    setTimeout(() => {
      splashScreen.style.display = 'none';
      mainApp.style.display = 'flex';
    }, 1000);
  }, 3000);
} else {
  splashScreen.style.display = 'none';
  mainApp.style.display = 'flex';
}

// SETTINGS MENU
document.getElementById('open-settings-btn').addEventListener('click', () => settingsModal.style.display = 'flex');
document.getElementById('close-settings-btn').addEventListener('click', () => settingsModal.style.display = 'none');

toggleFacecam.addEventListener('change', () => localStorage.setItem('setting_facecam', toggleFacecam.checked));
toggleAudio.addEventListener('change', () => localStorage.setItem('setting_audio', toggleAudio.checked));
toggleSplash.addEventListener('change', () => localStorage.setItem('setting_splash', toggleSplash.checked));

// RECORDING LOGIC
recordBtn.addEventListener('click', async () => {
  if (!isRecording) {
    try {
      statusText.innerText = "Starting...";
      
      // 1. Start Screen Recording with Audio
      await Capacitor.Plugins.ScreenRecorder.start({
        notificationTitle: "GameRec Pro",
        notificationText: "Recording screen and audio...",
        recordAudio: toggleAudio.checked,
        isAudio: toggleAudio.checked
      });
      
      // 2. Start Floating Facecam
      if (toggleFacecam.checked && Capacitor.Plugins.FloatingBubble) {
        await Capacitor.Plugins.FloatingBubble.show({
          title: "GameRec Cam",
          description: "Your facecam is active"
        });
        // Note: In a real scenario, we'd initialize the camera preview inside this bubble via native code.
      }

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
      
      if (Capacitor.Plugins.FloatingBubble) {
        await Capacitor.Plugins.FloatingBubble.hide();
      }
      
      isRecording = false;
      statusText.innerText = "Saved to Gallery!";
      alert("Video and Audio saved!");
      
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
