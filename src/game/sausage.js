import {Object3D, Vector3, Box3Helper, Box3, Euler} from "three";
import assetManager from "./assetManager";
import Globals from "./globals";
import {Body, Box, Vec3} from "cannon";
import PlayerController from "./playercontroller";

export default class Sausage extends Object3D {
  constructor(pos = new Vector3(), rot = new Euler()) {
    super();

    // Add sausage mesh and body

    this.isAi = true;

    this.mesh = THREE.SkeletonUtils.clone(Globals.main.assets.sausage.scene);
    this.add(this.mesh);
    this.mesh.scale.multiplyScalar(0.01);
    this.mesh.position.y = -1.1;
    Globals.main.scene.add(this);
    this.position.copy(pos);
    this.rotation.copy(rot);

    Globals.gameObjects.push(this);

    let ssg3 = new Box3().setFromObject(this);
    let ssgSize = ssg3.getSize(new Vector3());

    this.body = new Body({
      mass: 10,
    });

    let shape = new Box(new Vec3(ssgSize.x / 2, ssgSize.y / 2, ssgSize.z / 2));
    this.body.addShape(shape);
    Globals.main.world.add(this.body);

    this.body.position.copy(this.position);
    this.body.quaternion.copy(this.quaternion);

    this.updateWorldMatrix(true);
  }

  setPlayer() {
    this.controller = new PlayerController(this);
    this.isAi = false;
  }

  update(delta) {
    this.body.position.y = 2.1;
    this.position.copy(this.body.position);
    this.quaternion.copy(this.body.quaternion);
    this.rotation.y += 0.1;

    if (!this.isAi) {
      this.controller.update(delta);
    }
  }
}
