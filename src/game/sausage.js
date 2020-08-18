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

    let ssg3 = new Box3().setFromObject(this);
    let ssgSize = ssg3.getSize(new Vector3());

    this.body = new Body({
      mass: 10,
    });

    let shape = new Box(new Vec3(ssgSize.x / 2, ssgSize.y / 2.5, ssgSize.z / 2));
    this.body.addShape(shape);
    Globals.main.world.add(this.body);
    this.body.master = this;

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
}
