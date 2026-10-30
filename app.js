const recordBtn = document.getElementById('recordBtn');
const statusText = document.getElementById('statusText');

let isRecording = false;
let startTime;

recordBtn.addEventListener('click', async () => {
  if (!isRecording) {
    // Start Recording
    try {
      statusText.innerText = "Starting...";
      
      // Using the Capgo Screen Recorder plugin
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
      console.error(e);
    }
  } else {
    // Stop Recording
    try {
      statusText.innerText = "Saving...";
      recordBtn.classList.remove('recording');
      
      const result = await Capacitor.Plugins.ScreenRecorder.stop();
      
      isRecording = false;
      statusText.innerText = "Saved to Gallery!";
      alert("Video saved to your phone gallery!");
      
    } catch (e) {
      statusText.innerText = "Error: " + e.message;
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
