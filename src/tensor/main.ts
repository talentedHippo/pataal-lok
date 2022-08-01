import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl'

export var user_camera = document.getElementById("user_camera")!

export async function initUserCamera() {
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
  
  const tracker_canvas = document.getElementById("tracker_canvas")!
  export var tracker_context = tracker_canvas?.getContext("2d")
  
  export async function initPoseDetection() {
    const model = poseDetection.SupportedModels.BlazePose;
    const detector = await poseDetection.createDetector(model, {
      runtime: 'tfjs',
      modelType: 'lite',
      maxPoses: 1,
    } as poseDetection.BlazePoseTfjsModelConfig);
  
    return detector;
  }

  