import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl'


export var user_camera = document.getElementById("user_camera")
export async function initUserCamera() {
	try{
		var box = user_camera.getBoundingClientRect()
		const stream = await navigator.mediaDevices.getUserMedia({
			video: {
			  facingMode: 'user'
			},
			audio: false,
		  });
		
		  let onVideoReady = (ready) => {};
		  const videoReadyPromise = new Promise((resolve) => onVideoReady = resolve);
		  user_camera.onloadedmetadata = () => onVideoReady(true);
		
		  user_camera.srcObject = stream;
		  
		  return videoReadyPromise;
	}
    catch(e){
		console.log(e)
	}
  }
  
  const tracker_canvas = document.getElementById("tracker_canvas")
  export var tracker_context = tracker_canvas?.getContext("2d")
  //export var tracker_context

  export async function initPoseDetection() {
    const model = poseDetection.SupportedModels.BlazePose;
    const detector = await poseDetection.createDetector(model, {
      runtime: 'tfjs',
      modelType: 'full'
    });
  
    return detector;
  }

  