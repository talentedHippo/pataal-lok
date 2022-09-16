import {fromImage,fromUrl} from './scenes/mars/utils'
import {CannonHelper} from './scenes/mars/cannon-helper'
import {JoyStick} from './scenes/mars/joy-stick'
import * as THREE from 'three'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { HorizontalTiltShiftShader } from 'three/examples/jsm/shaders/HorizontalTiltShiftShader'
import * as CANNON from 'cannon-es';
import GUI from 'lil-gui';



const randnum = (min, max) => Math.round(Math.random() * (max - min) + min);
	
//===================================================== scene
console.log("=================STARTED===============================")
export var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, .01, 100000 );
camera.position.set( 1, 1, -1 );
camera.lookAt( scene.position );

let rendererContainer = document.getElementsByClassName("game")[0];
console.log(rendererContainer)
var renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true; // Shadow
renderer.shadowMap.Type = THREE.PCFShadowMap; //Shadow
//document.body.appendChild( renderer.domElement );


const list = document.getElementById("info");
list?.insertBefore(renderer.domElement, list.children[0]);    


  //===================================================== cannon
var debug = true;
var debugPhysics = true;
var fixedTimeStep = 1.0/60.0;

var helper = new CannonHelper(scene);
var physics = {};


	const world = new CANNON.World();


world.broadphase = new CANNON.SAPBroadphase(world);
world.gravity.set(0, -10, 0);
world.defaultContactMaterial.friction = 0;

const groundMaterial = new CANNON.Material("groundMaterial");
const wheelMaterial = new CANNON.Material("wheelMaterial");
const wheelGroundContactMaterial = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
	friction: 0,
	restitution: 0,
	contactEquationStiffness: 1000
});

// We must add the contact materials to the world
world.addContactMaterial(wheelGroundContactMaterial);






    //===================================================== add front & back lighting
var light = new THREE.DirectionalLight( new THREE.Color("gray"), 1);
light.position.set(1, 1, 1).normalize();
scene.add(light);




    //========================================================== effects
var SCALE = 2;

var hTilt = new ShaderPass(HorizontalTiltShiftShader);
hTilt.enabled = false;
hTilt.uniforms.h.value = 4 / (SCALE * window.innerHeight);

var renderPass = new RenderPass(scene, camera);
var effectCopy = new ShaderPass(CopyShader);
effectCopy.renderToScreen = true;

var composer = new EffectComposer(renderer);
composer.addPass(renderPass);
composer.addPass(hTilt);
composer.addPass(effectCopy);


var controls = new function() {
this.hTilt = false;
this.hTiltR = 0.5;
this.onChange = function() {
	hTilt.enabled = controls.hTilt;
	hTilt.uniforms.r.value = controls.hTiltR;
}
};

var gui = new GUI();
gui.add(controls, 'hTilt').onChange(controls.onChange);
gui.add(controls, 'hTiltR', 0, 1).onChange(controls.onChange);


    //activate tilt effect
    // document.querySelector('.dg .c input[type="checkbox"]').click();
    // gui.toggleHide();

    //=========================================================================================== add tweening
    //https://greensock.com/forums/topic/16993-threejs-properties/
Object.defineProperties(THREE.Object3D.prototype, {
x: {
	get: function() {
	return this.position.x;
	},
	set: function(v) {
	this.position.x = v;
	}
},
y: {
	get: function() {
	return this.position.y;
	},
	set: function(v) {
	this.position.y = v;
	}
},
z: {
	get: function() {
	return this.position.z;
	},
	set: function(v) {
	this.position.z = v;
	}
},
rotationZ: {
	get: function() {
	return this.rotation.x;
	},
	set: function(v) {
	this.rotation.x = v;
	}
},
rotationY: {
	get: function() {
	return this.rotation.y;
	},
	set: function(v) {
	this.rotation.y = v;
	}
},
rotationX: {
	get: function() {
	return this.rotation.z;
	},
	set: function(v) {
	this.rotation.z = v;
	}
}
});


    //===================================================== model
var geometry = new THREE.BoxBufferGeometry( .5, 1, .5 );
/* We change the pivot point to be at the bottom of the cube, instead of its center. So we translate the whole geometry. */
geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
var material = new THREE.MeshNormalMaterial({transparent: true,opacity:0});
var mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );


var light = new THREE.DirectionalLight( new THREE.Color('white'), .5 );
light.position.set( 0, 1, 0 );  
light.castShadow = true; 
light.target = mesh;//shadow will follow mesh          
mesh.add( light );


    //===================================================== add Model
var mixers = [];
var clip1;
var clip2;
var clip3;

var loader = new GLTFLoader();
loader.load( 'https://raw.githubusercontent.com/baronwatts/models/master/astronaut.glb', function ( object ) {

	object.scene.traverse( function( node ) {
		if ( node instanceof THREE.Mesh ) { 
			node.castShadow = true; 
			node.material.side = THREE.DoubleSide;
		}
	});

	var player = object.scene;
	player.position.set(0, -.1, 0 );
	player.scale.set(.25,.25,.25);
	player.rotation.set(0, 0, 0, 'xyz')
	mesh.add(player);

	/*  var lightPlayer = new THREE.PointLight(new THREE.Color('wheat'), 10, .5);
	mesh.add(lightPlayer);*/




	var mixer = new THREE.AnimationMixer(player);
	clip1 = mixer.clipAction(object.animations[0]);
	clip2 = mixer.clipAction(object.animations[1]);
	mixers.push(mixer);

	});
    
    
        //===================================================== add Terrain
	var sizeX = 128, sizeY = 128, minHeight = 0, maxHeight = 60;
	var startPosition = new CANNON.Vec3( 0, maxHeight - 3, sizeY * 0.5 - 10 );
	var img2matrix = function () {

	'use strict';

	return {
		fromImage: fromImage,
		fromUrl  : fromUrl
	}
}(); //loader.load


    //can add an array if things
var check;
Promise.all( [
img2matrix.fromUrl( 'https://upload.wikimedia.org/wikipedia/commons/5/57/Heightmap.png', sizeX, sizeY, minHeight, maxHeight )(),
] ).then( function ( data ) {

	var matrix = data[ 0 ];

	//console.log(matrix);

	//Array(128) [ (128) […], (128) […], (128) […], (128) […], (128) […], (128) […], (128) […], (128) […], (128) […], (128) […], … ]


	const terrainShape = new CANNON.Heightfield(matrix, {elementSize: 10});
	const terrainBody = new CANNON.Body({mass: 0});

	terrainBody.addShape(terrainShape);
	terrainBody.position.set(-sizeX * terrainShape.elementSize / 2, -10, sizeY * terrainShape.elementSize / 2);
	terrainBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
	world.addBody(terrainBody);
	helper.addVisual(terrainBody, 'landscape');



	var raycastHelperGeometry = new THREE.CylinderGeometry( 0, 1, 5, 1.5 );
	raycastHelperGeometry.translate( 0, 0, 0 );
	raycastHelperGeometry.rotateX( Math.PI / 2 );
	var raycastHelperMesh = new THREE.Mesh( raycastHelperGeometry, new THREE.MeshNormalMaterial() );
	scene.add( raycastHelperMesh );



	check = function(){

	var raycaster = new THREE.Raycaster(mesh.position, new THREE.Vector3(0, -1, 0));
	var intersects = raycaster.intersectObject(terrainBody.threemesh.children[0]);
	if ( intersects.length > 0 ) {
		raycastHelperMesh.position.set( 0, 0, 0 );
		raycastHelperMesh.lookAt( intersects[0].face.normal );
		raycastHelperMesh.position.copy( intersects[ 0 ].point );
	}
	//position objects ontop of the terrain
	mesh.position.y = intersects && intersects[0] ? intersects[0].point.y + 0.1 : 30;


		//raycast flag
		var raycaster2 = new THREE.Raycaster(flagLocation.position, new THREE.Vector3(0, -1, 0));
		var intersects2 = raycaster2.intersectObject(terrainBody.threemesh.children[0]);


		//position objects ontop of the terrain
		flagLocation.position.y = intersects2 && intersects2[0] ? intersects2[0].point.y + .5 : 30;
		flagLight.position.y = flagLocation.position.y + 50;
		flagLight.position.x = flagLocation.position.x + 5
		flagLight.position.z = flagLocation.position.z;



	}//end check


});//end Promise of check



    //=========================================================================================== flag
var geometry = new THREE.BoxBufferGeometry( 0.15, 2, 0.15 );
/* We change the pivot point to be at the bottom of the cube, instead of its center. So we translate the whole geometry. */
geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 1, 0));
var material = new THREE.MeshNormalMaterial({transparent: true,opacity:0});
var flagLocation = new THREE.Mesh( geometry, material );
scene.add(flagLocation);
flagLocation.position.x = 10;
flagLocation.position.z = 50;
flagLocation.rotateY(Math.PI);



    //flag pole
var geometry = new THREE.CylinderGeometry(.03, .03, 4, 32);
var material = new THREE.MeshPhongMaterial({color: new THREE.Color('gray')});
var cylinder = new THREE.Mesh(geometry, material);
cylinder.geometry.center();
cylinder.castShadow = true;
flagLocation.add(cylinder);


//flag light
var pointflagLight = new THREE.PointLight(new THREE.Color('red'), 1.5, 5);
pointflagLight.position.set(0, 0, 0);
flagLocation.add(pointflagLight);


var flagLight = new THREE.DirectionalLight( new THREE.Color('white'), 0 );
flagLight.position.set( 0, 0, 0 );  
flagLight.castShadow = true;   
flagLight.target = flagLocation;       
scene.add( flagLight );


    //flag
var texture = new THREE.TextureLoader().load('./flag-texture.png');

var plane = new THREE.Mesh(new THREE.PlaneGeometry(600, 430, 20, 20, true), new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }) );
plane.scale.set(.0025, .0025, .0025);
plane.position.set(0, 1.5, 0);
plane.position.x = .75;
plane.castShadow = true;

flagLocation.add(plane);
    // addModifier(plane);


    // flag wave animation
    // var modifier, cloth;

    //  function addModifier(mesh) {
    //     modifier = new ModifierStack(mesh);
    //     cloth = new Cloth(3, 0);
    //     cloth.setForce(0.2, -0.2, -0.2);
    //   }
    // modifier.addModifier(cloth);
    // cloth.lockXMin(0);
computeNormals: false

//===================================================== add sky particles
var textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = ''; //allow cross origin loading

const imageSrc = textureLoader.load('https://raw.githubusercontent.com/baronwatts/models/master/snowflake.png');
const shaderPoint = THREE.ShaderLib.points;

var uniforms = THREE.UniformsUtils.clone(shaderPoint.uniforms);
uniforms.map.value = imageSrc;

var matts = new THREE.PointsMaterial({
	size: 2,
	color: new THREE.Color("white"),
	map:  uniforms.map.value,
	blending: THREE.AdditiveBlending,
	depthWrite: false,
	transparent: true,
	opacity: 0.75
});

const verticesArr = []
for ( var i = 0; i < 1000; i ++ ) {
	verticesArr.push( new THREE.Vector3(randnum(-500, 500), randnum(-500, 500), randnum(30,40)) );
}

var geo = new THREE.BufferGeometry(new Float32Array([...verticesArr]), 3);
console.log(geo)

var sparks = new THREE.Points(geo, matts );
sparks.scale.set(1,1,1);
scene.add(sparks);

var js = { forward:0, turn:0 };

var joystick = new JoyStick({ 
	onMove: joystickCallback 
});

    
    //===================================================== 3rd person view
var followCam = new THREE.Object3D();
followCam.position.copy(camera.position);
scene.add(followCam);
followCam.parent = mesh;

//////////fundtion here onwards
function updateCamera(){
    if(followCam){
        camera.position.lerp(followCam.getWorldPosition(new THREE.Vector3()), 0.05);
        camera.lookAt(mesh.position.x, mesh.position.y + .5, mesh.position.z);
    }
}

//===================================================== animate
var clock = new THREE.Clock();
var lastTime;

import {initUserCamera, initPoseDetection, user_camera, tracker_context} from './tensor/main'
import {Skeleton} from './tensor/skeleton'

initUserCamera();
const detector = await initPoseDetection();
const skeleton = new Skeleton(tracker_context);

console.log("tracker loaded ", tracker_context);

var nose_position_turn = 0;
var nose_position_move = 0;
var nose_position_start = 0;
var startShoulderWidth = 0;

const animate = async () => {
    requestAnimationFrame( animate );
    updateCamera();
    updateDrive();
    renderer.render( scene, camera );
    //composer.render();

    let delta = clock.getDelta();
    mixers.map(x=>x.update(delta));

    const poses = await detector.estimatePoses(user_camera, {
        maxPoses: 1,
        flipHorizontal: false,
        scoreThreshold: 0.4,
      });

      tracker_context?.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      if (poses[0]) {
        skeleton.draw(poses[0]);
        
        const nose = poses[0].keypoints.find((keypoint) => keypoint.name === 'nose');

        if( !nose_position_turn ){
            nose_position_turn = nose?.x;
        }
        //turns and moves in the increments of 0.025 
        var nose_turn = (nose.x - nose_position_turn)/200
        js.turn = nose_turn;

        if( !nose_position_start ){
            nose_position_start = nose?.y;
        }

        if( !nose_position_move ){
            nose_position_move = nose?.y;
        }
        var move_trigger = 25
        var nose_move = (nose_position_start - nose.y)
        if( nose_position_start - nose.y > move_trigger ){
            js.forward = 0.025;
        }else{
            js.forward = 0
        }
        const leftShoulder = poses[0].keypoints.find((keypoint) => keypoint.name === 'left_shoulder');
        const rightShoulder = poses[0].keypoints.find((keypoint) => keypoint.name === 'right_shoulder');

        if (leftShoulder && rightShoulder) {
            if( !startShoulderWidth ){
                startShoulderWidth = leftShoulder.x - rightShoulder.x;
            }
            var currentShoulderWidth = leftShoulder.x - rightShoulder.x;
            var shoulder_turn = (startShoulderWidth- currentShoulderWidth)/1000
            //if( shoulder_turn > 0.25 || shoulder_turn < -0.25)
            {
                // console.log('Turn ', shoulder_turn);
            //    js.turn = shoulder_turn;
            }

        }

        // console.log('start ', nose_position_start, 'current ', nose?.y, nose_move);
      }

    

        /*cannon*/
    const now = Date.now();
    if (lastTime===undefined) lastTime = now;
    const dt = (Date.now() - lastTime)/1000.0;
    var FPSFactor = dt;
    lastTime = now;

    world.step(fixedTimeStep, dt);
    helper.updateBodies(world);


    if(check) check();


    //display coordinates
    //info.innerHTML = `<span>X: </span>${mesh.position.x.toFixed(2)}, &nbsp;&nbsp;&nbsp; <span>Y: </span>${mesh.position.y.toFixed(2)}, &nbsp;&nbsp;&nbsp; <span>Z: </span>${mesh.position.z.toFixed(2)}`
 
    //flag
    // modifier && modifier.apply();

};

animate();


function joystickCallback( forward, turn ){ 
    js.forward = forward; 
    js.turn = turn; 
}

function updateScene(forward, turn){
    const maxSteerVal = 0.05;
    const steer = maxSteerVal * turn;
    //mesh.rotateY(steer);
    //js.turn = turn
    js.forward = turn;
}

function updateDrive(forward=js.forward, turn=js.turn){ 
    const maxSteerVal = 0.05;
    const maxForce = .15;
    const brakeForce = 10;

    const force = maxForce * forward;
    const steer = maxSteerVal * turn;

    if (forward!=0){
        mesh.translateZ(force);//move cube
        if(clip2) clip2.play();
        if(clip1) clip1.stop();
    }else{
        if(clip2) clip2.stop();
        if(clip1) clip1.play();
    }
    mesh.rotateY(steer);
}