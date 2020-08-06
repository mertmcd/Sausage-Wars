import {Object3D, Vector3, Box3, Euler, AnimationUtils, LoopRepeat} from "three";
import assetManager from "./assetManager";
import Globals from "./globals";
import {Body, Box, Vec3} from "cannon";
import AnimManager from "../utils/animManager";
// import Player from "./player";
// import PlayerController from "./playercontroller";
// import Ai from "./ai";
// import AiController from "./aicontroller";

export default class Sausage extends Object3D {
  constructor(pos, rot) {
    //  console.log("dem");

    super();

    this.controls = app.controls;
    this.isClicked = false;
    this.isAi = true;

    // Add circle

    let geometry = new THREE.CircleGeometry(2, 16);
    let material = new THREE.MeshBasicMaterial({
      color: 0x787878,
      side: THREE.DoubleSide,
    });
    this.circle = new THREE.Mesh(geometry, material);
    this.circle.scale.multiplyScalar(0.3);
    this.circle.position.copy(this.position);
    this.circle.position.y = -1.05;
    this.circle.rotation.x = Math.PI / 2;
    this.add(this.circle);

    // Add sausage mesh

    this.mesh = THREE.SkeletonUtils.clone(Globals.main.assets.sausage.scene);
    this.add(this.mesh);
    this.mesh.scale.multiplyScalar(0.01);
    this.mesh.position.y = -1.05;
    Globals.main.scene.add(this);

    Globals.gameObjects.push(this);
    console.log(Globals.gameObjects);

    let ssg3 = new Box3().setFromObject(this);
    let ssgSize = ssg3.getSize(new Vector3());

    this.body = new Body({
      mass: 10,
    });

    let shape = new Box(new Vec3(ssgSize.x / 5, ssgSize.y / 2.5, ssgSize.z / 5));
    this.body.addShape(shape);
    Globals.main.world.add(this.body);

    this.position.copy(pos);
    this.rotation.copy(rot);

    this.body.position.copy(this.position);
    //this.body.quaternion.copy(this.quaternion);

    // Anim Manager

    let origAnims = Globals.main.assets.sausage.animations;

    let anims = [
      THREE.AnimationUtils.subclip(origAnims[0], "idle", 0, 500),
      THREE.AnimationUtils.subclip(origAnims[1], "kosma", 0, 500),
      THREE.AnimationUtils.subclip(origAnims[2], "kafaatma", 0, 500),
      THREE.AnimationUtils.subclip(origAnims[3], "sarsilma", 0, 500),
      THREE.AnimationUtils.subclip(origAnims[4], "dans", 0, 500),
      THREE.AnimationUtils.subclip(origAnims[5], "dusme", 0, 500),
    ];

    this.animManager = new AnimManager(this.mesh, anims);
    this.body.animManager = this.animManager;
  }

  update(delta) {}

  initAnimation() {
    this.animManager.startAnimation("idle", false);
  }

  detectCollisions() {
    let obj1;
    let obj2;

    let distance = Math.sqrt((obj2.x - obj1.x) * (obj2.x - obj1.x) + (obj2.y - obj1.y) * (obj2.y - obj1.y));

    let vCollisionNorm = {
      x: vCollision.x / distance,
      y: vCollision.y / distance,
    };

    let vRelativeVelocity = {
      x: obj1.vx - obj2.vx,
      y: obj1.vy - obj2.vy,
    };

    let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

    // if (speed < 0) {
    //   break;
    // }

    obj1.vx -= speed * vCollisionNorm.x;
    obj1.vy -= speed * vCollisionNorm.y;
    obj2.vx += speed * vCollisionNorm.x;
    obj2.vy += speed * vCollisionNorm.y;

    for (let i = 0; i < Globals.gameObjects.length; i++) {
      Globals.gameObjects[i].isColliding = false;
    }

    for (let i = 0; i < Globals.gameObjects.length; i++) {
      obj1 = Globals.gameObjects[i];
      for (let j = i + 1; j < Globals.gameObjects.length; j++) {
        obj2 = Globals.gameObjects[j];

        if (rectIntersect(obj1.x, obj1.y, obj1.width, obj1.height, obj2.x, obj2.y, obj2.width, obj2.height)) {
          obj1.isColliding = true;
          obj2.isColliding = true;
        }
      }
    }
  }
}
