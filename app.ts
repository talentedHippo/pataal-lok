import {initUserCamera, initPoseDetection, tracker_context, user_camera} from './src/tensor/main'
import {initializeOceanScene, initializeSceneCamera, initializeSceneRenderer, createCube} from './src/three/main'
import {Skeleton} from './src/tensor/skeleton'

  window.onload = async () => {
    console.log('in the window.onload callback  function')

    var ocean_scene1 = initializeOceanScene()
    var scene_camera1 = initializeSceneCamera();
    var scene_renderer1 = initializeSceneRenderer();
    var local_cube = createCube();

    let rendererContainer = document.getElementsByClassName("game")[0];
    rendererContainer.appendChild(scene_renderer1.domElement);  
    ocean_scene1.add( local_cube );

    await initUserCamera();
    const detector = await initPoseDetection();
    const skeleton = new Skeleton(tracker_context);

    console.log("tracker loaded ", tracker_context);


    async function render() {

        const poses = await detector.estimatePoses(user_camera!, {
            maxPoses: 1,
            flipHorizontal: false,
            scoreThreshold: 0.4,
          });

          tracker_context.clearRect(0, 0, window.innerWidth, window.innerHeight);
          
          if (poses[0]) {
            skeleton.draw(poses[0]);
          }

        local_cube.rotation.x += 0.01;
        local_cube.rotation.y += 0.01;
      
        // Render the scene
        scene_renderer1.render(ocean_scene1, scene_camera1);
        requestAnimationFrame(render);
    }
    render();
  }