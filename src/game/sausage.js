import {Object3D, Vector3, Box3Helper, Box3, Euler} from "three";
import assetManager from "./assetManager";
import Globals from "./globals";
import {Body, Box, Vec3} from "cannon";

export default class Sausage extends Object3D {
  constructor(pos, rot = new Euler()) {
    super();

    // Add sausage mesh

    this.mesh = THREE.SkeletonUtils.clone(Globals.main.assets.sausage.scene);
    this.add(this.mesh);
    this.mesh.position.y = -100;

    Globals.main.scene.add(this);

    this.position.copy(pos);
    this.rotation.copy(rot);

    Globals.gameObjects.push(this);

    let ssg3 = new Box3().setFromObject(this);
    let ssgSize = ssg3.getSize(new Vector3());

    /*     let box3helper = new Box3Helper(ssg3, "#ff0000");
    Globals.main.scene.add(box3helper); */

    this.body = new Body({
      position: this.position,
      mass: 10,
    });

    let shape = new Box(new Vec3(ssgSize.x / 2, ssgSize.y / 2, ssgSize.z / 2));
    this.body.addShape(shape);
    Globals.main.world.add(this.body);

    this.body.position.y += ssgSize.y * 1.2;
    this.updateWorldMatrix(true);
  }

  update(delta) {
    this.position.copy(this.body.position);
    this.quaternion.copy(this.body.quaternion);
  }
}
