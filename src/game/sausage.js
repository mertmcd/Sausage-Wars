import {Object3D, Vector3, Box3Helper, Box3, Euler, AnimationUtils, LoopRepeat} from "three";
import assetManager from "./assetManager";
import Globals from "./globals";
import {Body, Box, Vec3} from "cannon";
import PlayerController from "./playercontroller";
import AnimManager from "../utils/animManager";

export default class Sausage extends Object3D {
  constructor(pos, rot) {
    super();

    this.controls = app.controls;
    this.isClicked = false;

    // Add sausage mesh and body

    this.isAi = true;

    this.mesh = THREE.SkeletonUtils.clone(Globals.main.assets.sausage.scene);
    this.add(this.mesh);
    this.mesh.scale.multiplyScalar(0.01);
    this.mesh.position.y = -1.1;
    Globals.main.scene.add(this);
    this.position.copy(pos);
    this.rotation.copy(rot);

    // let geometry = new THREE.CircleGeometry(2, 16);
    // let material = new THREE.MeshBasicMaterial({color: 0xffff00});
    // let circle = new THREE.Mesh(geometry, material);
    // circle.scale.multiplyScalar(0.11);
    // circle.position.copy(this.position);
    // this.add(circle);

    Globals.gameObjects.push(this);

    this.initAnimation();

    let ssg3 = new Box3().setFromObject(this);
    let ssgSize = ssg3.getSize(new Vector3());

    this.body = new Body({
      mass: 10,
    });

    let shape = new Box(new Vec3(ssgSize.x / 2, ssgSize.y / 2, ssgSize.z / 2));
    this.body.addShape(shape);
    Globals.main.world.add(this.body);

    this.body.position.copy(this.position);
    //this.body.quaternion.copy(this.quaternion);
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

  update(delta) {
    this.animManager.update(delta);
    this.body.position.y = 2.1;
    this.position.copy(this.body.position);
    // this.quaternion.copy(this.body.quaternion);

    if (this.controls.isDown && !this.isClicked) {
      this.isClicked = true;
      console.log("mert");
      this.animManager.fadeToAction("kosma", {duration: 0.2, loopType: LoopRepeat});
    } else if (!this.controls.isDown && this.isClicked) {
      this.isClicked = false;
      console.log("can");
      this.animManager.fadeToAction("idle", false);
    }

    if (!this.isAi) {
      this.controller.update(delta);
    }
  }
}
