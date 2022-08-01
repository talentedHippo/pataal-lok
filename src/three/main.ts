// ------------------------------------------------
// BASIC SETUP

  
export function createCube(){
  // Create a Cube Mesh with basic material
  var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  var material = new THREE.MeshBasicMaterial( { color: "#433F81" } );
  var cube = new THREE.Mesh( geometry, material );
  return cube;
}

// ------------------------------------------------
export function initializeOceanScene() {
  // Create an empty scene
    return new THREE.Scene();
  }
  
  export function initializeSceneCamera() {
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.position.z = 4;
    return camera
  }
  
  
   export function initializeSceneRenderer() {
    
    // Create a renderer with Antialiasing
    var renderer = new THREE.WebGLRenderer({
      antialias:true,
      alpha: true,
    });
  
    // Configure renderer clear color
    renderer.setClearColor("#000000");
  
    // Configure renderer size
    renderer.setSize( window.innerWidth, window.innerHeight );
  
    // Append Renderer to DOM
    document.body.appendChild(renderer.domElement );
    console.log("appened the renderer");
  
    return renderer;
  
  }
  
  
  
  // ------------------------------------------------
  // FUN STARTS HERE
  // ------------------------------------------------
  
