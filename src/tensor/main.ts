

const user_camera = document.getElementById("user_camera")!
const tracker_canvas = document.getElementById("tracker_canvas")!

const tracker_context = tracker_canvas?.getContext("2d")

async function initUserCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: window.innerWidth },
        height: { ideal: window.innerHeight },
      },
      audio: false,
    });
  
    let onVideoReady: (ready: boolean) => void;
    const videoReadyPromise = new Promise((resolve) => onVideoReady = resolve);
    user_camera.onloadedmetadata = () => onVideoReady(true);
  
    user_camera.srcObject = stream;
    
    return videoReadyPromise;
  }
  
  async function main() {
      await initUserCamera();
  }
  
  main();