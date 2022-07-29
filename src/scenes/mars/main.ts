import {fromImage,fromUrl} from './src/scenes/mars/utils'
import {CannonHelper} from './src/scenes/mars/cannon-helper'
import {JoyStick} from './src/scenes/mars/joy-stick'



    const randnum = (min, max) => Math.round(Math.random() * (max - min) + min);
        
    //===================================================== scene
    console.log("=================STARTED===============================")
    export var mars_camera = new THREE.Scene();

    export var mars_camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, .01, 100000 );
    mars_camera.position.set( 1, 1, -1 );
    mars_camera.lookAt( mars_scene.position );

    export var mars_renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    mars_renderer.setSize( window.innerWidth, window.innerHeight );
    mars_renderer.shadowMap.enabled = true;
    mars_renderer.shadowMapSoft = true; // Shadow
    mars_renderer.shadowMap.Type = THREE.PCFShadowMap; //Shadow
    document.body.appendChild( mars_renderer.domElement );


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
    mars_scene.add(light);




    //========================================================== effects
    var SCALE = 2;

    var hTilt = new THREE.ShaderPass(THREE.HorizontalTiltShiftShader);
    hTilt.enabled = false;
    hTilt.uniforms.h.value = 4 / (SCALE * window.innerHeight);

    var renderPass = new THREE.RenderPass(scene, camera);
    var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
    effectCopy.renderToScreen = true;

    var composer = new THREE.EffectComposer(renderer);
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

    var gui = new dat.GUI();
    gui.add(controls, 'hTilt').onChange(controls.onChange);
    gui.add(controls, 'hTiltR', 0, 1).onChange(controls.onChange);


    //activate tilt effect
    document.querySelector('.dg .c input[type="checkbox"]').click();
    dat.GUI.toggleHide();

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
    mars_scene.add( mesh );


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

    var loader = new THREE.GLTFLoader();
    loader.load( 'https://raw.githubusercontent.com/baronwatts/models/master/astronaut.glb', function ( object ) {
   
        object.mars_scene.traverse( function( node ) {
            if ( node instanceof THREE.Mesh ) { 
                node.castShadow = true; 
                node.material.side = THREE.DoubleSide;
            }
        });
    
        var player = object.scene;
        player.position.set(0, -.1, 0 );
        player.scale.set(.25,.25,.25);
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
        world.add(terrainBody);
        helper.addVisual(terrainBody, 'landscape');



        var raycastHelperGeometry = new THREE.CylinderGeometry( 0, 1, 5, 1.5 );
        raycastHelperGeometry.translate( 0, 0, 0 );
        raycastHelperGeometry.rotateX( Math.PI / 2 );
        var raycastHelperMesh = new THREE.Mesh( raycastHelperGeometry, new THREE.MeshNormalMaterial() );
        mars_scene.add( raycastHelperMesh );



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
    mars_scene.add(flagLocation);
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
    mars_scene.add( flagLight );


    //flag
    var texture = new THREE.TextureLoader().load('./src/assets/flag-texture.webp');
    
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(600, 430, 20, 20, true), new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }) );
    plane.scale.set(.0025, .0025, .0025);
    plane.position.set(0, 1.5, 0);
    plane.position.x = .75;
    plane.castShadow = true;

    flagLocation.add(plane);
    addModifier(plane);


    //flag wave animation
    var modifier, cloth;

     function addModifier(mesh) {
        modifier = new ModifierStack(mesh);
        cloth = new Cloth(3, 0);
        cloth.setForce(0.2, -0.2, -0.2);
      }
    modifier.addModifier(cloth);
    cloth.lockXMin(0);
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

    var geo = new THREE.Geometry();
    for ( var i = 0; i < 1000; i ++ ) {
        var star = new THREE.Vector3();
        geo.vertices.push( star );
    }

    var sparks = new THREE.Points(geo, matts );
    sparks.scale.set(1,1,1);
    mars_scene.add(sparks);

    sparks.geometry.vertices.map((d,i)=>{
        d.y = randnum(30,40);
        d.x = randnum(-500, 500);
        d.z = randnum(-500, 500);
    });


    var js = { forward:0, turn:0 };

    var joystick = new JoyStick({ 
        onMove: joystickCallback 
    });

    
    //===================================================== 3rd person view
    var followCam = new THREE.Object3D();
    followCam.position.copy(mars_camera.position);
    mars_scene.add(followCam);
    followCam.parent = mesh;

//////////fundtion here onwards
function updateCamera(){
    if(followCam){
        mars_camera.position.lerp(followCam.getWorldPosition(new THREE.Vector3()), 0.05);
        mars_camera.lookAt(mesh.position.x, mesh.position.y + .5, mesh.position.z);
    }
}

//===================================================== animate
var clock = new THREE.Clock();
var lastTime;

(function animate() {
    requestAnimationFrame( animate );
    updateCamera();
    updateDrive();
    mars_renderer.render( scene, camera );
    //composer.render();

    let delta = clock.getDelta();
    mixers.map(x=>x.update(delta));


    

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
    info.innerHTML = `<span>X: </span>${mesh.position.x.toFixed(2)}, &nbsp;&nbsp;&nbsp; <span>Y: </span>${mesh.position.y.toFixed(2)}, &nbsp;&nbsp;&nbsp; <span>Z: </span>${mesh.position.z.toFixed(2)}`
 
    //flag
    modifier && modifier.apply();

})();


function joystickCallback( forward, turn ){ 
    js.forward = forward; 
    js.turn = -turn; 
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