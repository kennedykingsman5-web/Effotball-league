const recordBtn = document.getElementById('recordBtn');
const statusText = document.getElementById('statusText');

let isRecording = false;
let startTime;

recordBtn.addEventListener('click', async () => {
  if (!isRecording) {
    try {
      statusText.innerText = "Requesting permission...";
      
      // We check if the plugin is actually loaded
      if (!Capacitor.Plugins.ScreenRecorder) {
        throw new Error("Screen Recorder plugin not found!");
      }

      // Try starting with basic options
      await Capacitor.Plugins.ScreenRecorder.start({
        notificationTitle: "GameRec",
        notificationText: "Recording your screen..."
      });
      
      isRecording = true;
      recordBtn.classList.add('recording');
      startTime = Date.now();
      updateTimer();
      
    } catch (e) {
      statusText.innerText = "Error: " + e.message;
      alert("Error: " + e.message);
    }
  } else {
    try {
      statusText.innerText = "Saving...";
      recordBtn.classList.remove('recording');
      
      await Capacitor.Plugins.ScreenRecorder.stop();
      
      isRecording = false;
      statusText.innerText = "Saved to Gallery!";
      alert("Video saved to your phone gallery!");
      
    } catch (e) {
      statusText.innerText = "Error: " + e.message;
      alert("Error: " + e.message);
    }
  }
});

function updateTimer() {
  if (!isRecording) return;
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  statusText.innerText = `Recording... ${seconds}s`;
  setTimeout(updateTimer, 1000);
    }
