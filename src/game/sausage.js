import {Object3D, Vector3, Box3Helper, Box3, Euler, AnimationUtils, LoopRepeat} from "three";
import assetManager from "./assetManager";
import Globals from "./globals";
import {Body, Box, Vec3} from "cannon";
import PlayerController from "./playercontroller";
import AnimManager from "../utils/animManager";
import AiController from "./aicontroller";

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
    let circle = new THREE.Mesh(geometry, material);
    circle.scale.multiplyScalar(0.3);
    circle.position.copy(this.position);
    circle.position.y = -1.05;
    circle.rotation.x = Math.PI / 2;
    this.add(circle);

    // Add sausage mesh

    this.mesh = THREE.SkeletonUtils.clone(Globals.main.assets.sausage.scene);
    this.add(this.mesh);
    this.mesh.scale.multiplyScalar(0.01);
    this.mesh.position.y = -1.05;
    Globals.main.scene.add(this);
    this.position.copy(pos);
    this.rotation.copy(rot);

    Globals.gameObjects.push(this);

    let ssg3 = new Box3().setFromObject(this);
    let ssgSize = ssg3.getSize(new Vector3());

    this.body = new Body({
      mass: 10,
    });

    let shape = new Box(new Vec3(ssgSize.x / 2.5, ssgSize.y / 2.5, ssgSize.z / 2.5));
    this.body.addShape(shape);
    Globals.main.world.add(this.body);

    this.body.position.copy(this.position);
    //this.body.quaternion.copy(this.quaternion);

    this.initAnimation();

    this.updateWorldMatrix(true);
  }

  initAnimation() {
    let origAnims = Globals.main.assets.sausage.animations;
    //console.log(origAnims);
    let anims = [THREE.AnimationUtils.subclip(origAnims[0], "idle", 0, 500), AnimationUtils.subclip(origAnims[1], "kosma", 0, 500)];

    this.animManager = new AnimManager(this.mesh, anims);
    this.animManager.startAnimation("idle", false);
  }

  setPlayer() {
    this.controller = new PlayerController(this);
    this.isAi = false;
  }

  setAi() {
    this.controller = new AiController(this);
    this.isAi = true;
  }

  update(delta) {
    this.animManager.update(delta);
    this.body.position.y = 2.1;
    this.position.copy(this.body.position);
    // this.quaternion.copy(this.body.quaternion);

    if (this.controls.isDown) {
      this.isClicked = true;
      this.animManager.fadeToAction("kosma", {duration: 0.2, loopType: LoopRepeat});
      console.log("mert");
    } else if (!this.controls.isDown && this.isClicked) {
      this.isClicked = false;
      this.animManager.fadeToAction("idle", {loopType: LoopRepeat});
      console.log("can");
    }

    if (!this.isAi) {
      this.controller.update(delta);
    } else this.controller.update(delta);
  }
}
