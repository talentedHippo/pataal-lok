import {initUserCamera, initPoseDetection, user_camera, tracker_context} from './src/tensor/main'
import {initializeOceanScene, initializeSceneCamera, initializeSceneRenderer, createCube} from './src/three/main'
import {Skeleton} from './src/tensor/skeleton'

import {marse_scene, marse_camera, marse_renderer,createCube, updateCamera, updateDrive, mixers, marse_world, helper} from './src/scenes/mars/temp'

  window.onload = async () => {
    console.log('in the window.onload callback  function')

    var marse_scene = initializeOceanScene()
    var marse_camera = initializeSceneCamera();
    var marse_renderer = initializeSceneRenderer();
    var local_cube = createCube();

    let rendererContainer = document.getElementsByClassName("game")[0];
    const list = document.getElementById("info");
    list?.insertBefore(marse_renderer.domElement, list.children[0]);    
    
  
    marse_scene.add( local_cube );

    await initUserCamera();
    const detector = await initPoseDetection();
    const skeleton = new Skeleton(tracker_context);

    console.log("tracker loaded ", tracker_context);
    var clock = new THREE.Clock();
    var lastTime;
    

    var fixedTimeStep = 1.0/60.0;

    async function render() {

        updateCamera();
        updateDrive();
        marse_renderer.render( marse_scene, marse_camera );
        //composer.render();
    
        let delta = clock.getDelta();
        mixers.map(x=>x.update(delta));
    
        const now = Date.now();
        if (lastTime===undefined) lastTime = now;
        const dt = (Date.now() - lastTime)/1000.0;
        var FPSFactor = dt;
        lastTime = now;
    
        marse_world.step(fixedTimeStep, dt);
        helper.updateBodies(marse_world);
    
        //if(check) check();
    
    
        //display coordinates
        //info.innerHTML = `<span>X: </span>${mesh.position.x.toFixed(2)}, &nbsp;&nbsp;&nbsp; <span>Y: </span>${mesh.position.y.toFixed(2)}, &nbsp;&nbsp;&nbsp; <span>Z: </span>${mesh.position.z.toFixed(2)}`
     
        //flag
        //modifier && modifier.apply();




        const poses = await detector.estimatePoses(user_camera!, {
            maxPoses: 1,
            flipHorizontal: false,
            scoreThreshold: 0.4,
          });

          tracker_context.clearRect(0, 0, window.innerWidth, window.innerHeight);
          
          if (poses[0]) {
            skeleton.draw(poses[0]);
          }

          //tracker_context.scale(0.5,0.5)

        local_cube.rotation.x += 0.01;
        local_cube.rotation.y += 0.01;
      
        // Render the scene
        marse_renderer.render(marse_scene, marse_camera);
        requestAnimationFrame(render);
    }
    render();
  }


window.addEventListener("resize", function() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    mars_renderer.setSize(width, height);
    mars_camera.aspect = width / height;
    mars_camera.updateProjectionMatrix();
  });

  
