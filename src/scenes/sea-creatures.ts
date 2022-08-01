import { fruitsModels } from "./fruit-models";
import MTLLoader from 'three-mtl-loader';

export function loadFruitsModels(scene) {
    return fruitsModels.map((fruit) => {
      var mtlLoader = new THREE.MTLLoader();
      mtlLoader.setPath("../../assets/");
      mtlLoader.load(`${fruit.material}.mtl`, function (materials) {
        materials.preload();
  
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath("../../assets/");
        objLoader.load(`${fruit.model}.obj`, function (object) {
          object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
              var mesh = new THREE.Mesh(child.geometry, child.material);
              fruitModel = mesh;
              fruitModel.name = fruit.name;
              fruits.push(fruitModel);
            }
          });
  
          if (fruits.length === fruitsModels.length) {
            generateFruits(1,scene);
          }
        });
      });
  
      return fruits;
    });
  };
  
  export const generateFruits = (numFruits, scene) => {
    for (var i = 0; i < numFruits; i++) {
      const randomFruit = fruits[generateRandomPosition(0, 2)];
      let newFruit = randomFruit.clone(); // Why are we cloning?
  
      switch (newFruit.name) {
        case "apple":
          randomXPosition = generateRandomPosition(
            -120 * camera.aspect,
            120 * camera.aspect
          );
          randomYPosition = generateRandomPosition(-290, -190);
          newFruit.position.set(randomXPosition, randomYPosition, 100);
          newFruit.thresholdBottomY = randomYPosition;
          break;
        case "banana":
          randomXPosition = generateRandomPosition(
            -200 * camera.aspect,
            200 * camera.aspect
          );
          randomYPosition = generateRandomPosition(-370, -270);
          newFruit.position.set(randomXPosition, randomYPosition, 0);
          newFruit.thresholdBottomY = randomYPosition;
          break;
        case "bomb":
          randomXPosition = generateRandomPosition(
            -110 * camera.aspect,
            110 * camera.aspect
          );
          randomYPosition = generateRandomPosition(-290, -190);
          newFruit.position.set(randomXPosition, randomYPosition, 100);
          newFruit.scale.set(20, 20, 20);
          newFruit.thresholdBottomY = randomYPosition;
          break;
        default:
          break;
      }
  
      newFruit.index = fruitsObjects.length;
      newFruit.thresholdTopY = commonFruitProperties[newFruit.name].thresholdTopY;
      newFruit.soundPlayed = commonFruitProperties.soundPlayed;
      newFruit.direction = commonFruitProperties.direction;
      newFruit.hit = commonFruitProperties.hit;
      newFruit.speed = commonFruitProperties.speed;
  
      fruitsObjects.push(newFruit);
  
      scene.add(newFruit);
      render();
    }
  };
  