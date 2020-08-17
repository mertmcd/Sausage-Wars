import Sausage from "./sausage";
import PlayerController from "./playercontroller";
import {LoopRepeat, LoopOnce, Vector3} from "three";
import Globals from "./globals";

export default class Player extends Sausage {
  constructor(pos, rot) {
    super(pos, rot);

    this.controller = new PlayerController(this);
    this.isAi = false;

    this.body.currentState = Globals.states.IDLE;
    this.initAnimation();

    // Add triangle

    let geo = new THREE.Geometry();

    let v1 = new THREE.Vector3(-0.5, 0, 1);
    let v2 = new THREE.Vector3(0.5, 0, 1);
    let v3 = new THREE.Vector3(0, 0, 2);

    geo.vertices.push(v1);
    geo.vertices.push(v2);
    geo.vertices.push(v3);

    let mat = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
    });

    geo.faces.push(new THREE.Face3(0, 1, 2));
    geo.computeFaceNormals();

    let triangle = new THREE.Mesh(geo, mat);

    triangle.scale.multiplyScalar(0.4);
    triangle.position.copy(this.circle.position);
    // triangle.position.x = 1;
    triangle.position.y = -1;
    triangle.position.z = 0.5;

    //triangle.rotation.z = Math.PI / 2;
    this.add(triangle);
  }

  update(delta) {
    this.animManager.update(delta);

    this.body.position.y = 2.1;
    if (!Globals.isHit) {
      // this.body.velocity.x = 0;
      // this.body.velocity.z = 0;
    }

    this.controller.update(delta);

    if (this.body.currentState === Globals.states.IDLE) {
      if (this.controller.isClicked) {
        this.setState(Globals.states.MOVE);
        this.animManager.fadeToAction("kosma", {duration: 0.2, loopType: LoopRepeat});
      }
    } else if (this.body.currentState === Globals.states.MOVE && !this.controller.isClicked) {
      this.setState(Globals.states.ATTACK);
      this.animManager.fadeToAction("kafaatma", {duration: 0.1, loopType: LoopOnce});

      this.animManager.curAnim.onComplete(() => {
        this.setState(Globals.states.IDLE);
        this.animManager.fadeToAction("idle", {loopType: LoopRepeat});
      });
    }
    this.position.copy(this.body.position);
  }

  setState(state) {
    this.body.currentState = state;
  }
}
