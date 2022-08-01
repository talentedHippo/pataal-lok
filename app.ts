import {initUserCamera, initPoseDetection, tracker_context, user_camera} from './src/tensor/main'
import {initializeOceanScene, initializeSceneCamera, initializeSceneRenderer, createCube} from './src/three/main'
import {Skeleton} from './src/tensor/skeleton'

  window.onload = async () => {
    console.log('in the window.onload callback  function')

    // var ocean_scene1 = initializeOceanScene()
    // var scene_camera1 = initializeSceneCamera();
    // var scene_renderer1 = initializeSceneRenderer();
    // var local_cube = createCube();

    // let rendererContainer = document.getElementsByClassName("game")[0];
    //rendererContainer.appendChild(scene_renderer1.domElement);  
    //ocean_scene1.add( local_cube );

    await initUserCamera();
    const detector = await initPoseDetection();
    const skeleton = new Skeleton(tracker_context);
    

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.position.z = 4;
    

    // Create a renderer with Antialiasing
    var renderer = new THREE.WebGLRenderer({
      antialias:true,
      alpha: true,
    });
  
    // Configure renderer clear color
    //renderer.setClearColor("#000000");
  
    // Configure renderer size
    renderer.setSize( window.innerWidth, window.innerHeight );
  
    const list = document.getElementById("info");
    list?.insertBefore(renderer.domElement, list.children[0]);    
    renderer.domElement.style.left="0px";
    renderer.domElement.style.top="0px";

    console.log("appened the renderer");
  

    console.log("tracker loaded ", tracker_context);

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: "#433F81" } );
    var cube = new THREE.Mesh( geometry, material );
    
    // Add cube to Scene
    scene.add( cube );
    
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

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
      
        // Render the scene
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    render();
  }