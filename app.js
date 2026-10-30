const recordBtn = document.getElementById('recordBtn');
const statusText = document.getElementById('statusText');

let isRecording = false;
let startTime;

// Request Storage Permission on Startup
document.addEventListener('DOMContentLoaded', async () => {
  try {
    if (Capacitor.Plugins.Filesystem) {
      // Request permission to save files
      await Capacitor.Plugins.Filesystem.requestPermissions();
    }
  } catch (e) {
    console.log("Permission request error:", e);
  }
});

recordBtn.addEventListener('click', async () => {
  if (!isRecording) {
    try {
      statusText.innerText = "Starting...";
      
      // Check permission again just in case
      if (Capacitor.Plugins.Filesystem) {
        const status = await Capacitor.Plugins.Filesystem.checkPermissions();
        if (status.publicStorage !== 'granted') {
          await Capacitor.Plugins.Filesystem.requestPermissions();
        }
      }

      await Capacitor.Plugins.ScreenRecorder.start({
        notificationTitle: "GameRec is running",
        notificationText: "Recording your screen..."
      });
      
      isRecording = true;
      recordBtn.classList.add('recording');
      startTime = Date.now();
      
      updateTimer();
      
    } catch (e) {
      statusText.innerText = "Error: " + e.message;
      alert("Error: " + e.message);
      console.error(e);
    }
  } else {
    try {
      statusText.innerText = "Saving...";
      recordBtn.classList.remove('recording');
      
      const result = await Capacitor.Plugins.ScreenRecorder.stop();
      
      isRecording = false;
      statusText.innerText = "Saved to Gallery!";
      alert("Video saved to your phone gallery!");
      
    } catch (e) {
      statusText.innerText = "Error: " + e.message;
      alert("Error: " + e.message);
      console.error(e);
    }
  }
});

function updateTimer() {
  if (!isRecording) return;
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  statusText.innerText = `Recording... ${seconds}s`;
  setTimeout(updateTimer, 1000);
}
