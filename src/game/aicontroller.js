import Globals from "./globals";
// import Ai from "./ai";
import {Vector3, Euler, Quaternion, Vector2} from "three";

export default class AiController {
  constructor(ai) {
    this.ai = ai;
    this.controls = app.controls;
    this.timer = 0;
    this.decisionTime = 3;
    this.ai.body.angularDamping = 1;
    this.isActive = false;
    this.activateEnemy = false;
    this.chaser = false;

    this.targetRotationQuaternion = new Quaternion();
    this.targetRotationEuler = new Euler();
    this.velocity = new Vector3();
    this.forwardVector = new Vector3(0, 0, -1);
    this.direction = new Vector3(0, 0, -1);
    this.detectTarget();
  }

  update(delta) {
    this.ai.body.velocity.y = 0;

    if (this.controls.isDown && !this.activateEnemy) {
      this.activateEnemy = true;
      this.setActive(true);
    }

    if (this.isActive) {
      this.timer += delta;

      if (this.timer >= this.decisionTime) {
        this.chaser = false;
        if (Math.random() < 0.3) {
          // console.log("mert");
          this.detectTarget();
          this.chaser = true;
        } else {
          this.moveAi();
          // this.detectTarget();
          // console.log("can");
        }
        this.timer = 0;
      }
      // this.chaseTarget();
    }

    if (this.chaser) {
      this.chaseTarget();
    }

    let posx = this.ai.body.position.x;
    let posz = this.ai.body.position.z;
    if (posx > 9 || posx < -9 || posz > 9 || posz < -9) {
      //this.detectTarget();
      //this.chaseTarget();
      this.moveAi();
    }
  }

  moveAi() {
    let ranx = Math.random() * 16 - 8;
    let ranz = Math.random() * 16 - 8;

    let ang = Math.atan2(ranx - this.ai.body.position.x, ranz - this.ai.body.position.z);

    let dx = ranx - this.ai.body.position.x;
    let dz = ranz - this.ai.body.position.z;

    this.ai.body.velocity.x = Math.sin(ang);
    this.ai.body.velocity.z = Math.cos(ang);

    let velo = new Vector3().copy(this.ai.body.velocity);
    velo.setLength(5);
    this.ai.body.velocity.copy(velo);

    let rota = Math.atan2(dx, dz);
    this.ai.rotation.y = rota;
  }

  setActive(isActive) {
    this.isActive = isActive;
    if (isActive) this.moveAi();
    this.timer = 0;
  }

  detectTarget() {
    //for (let i = 0; i < Globals.gameObjects.length; i++) {
    this.others = [];
    this.others = Globals.gameObjects.filter((x) => x.uuid != this.id);

    //this.target = Globals.gameObjects[0];
    this.target = this.others[Math.floor(Math.random() * this.others.length)];
    //}
  }

  chaseTarget() {
    let diff = new Vector2(this.target.body.position.x - this.ai.body.position.x, this.target.body.position.z - this.ai.body.position.z);
    let ang = Math.atan2(diff.x, diff.y);

    this.targetRotationEuler.y = ang + Math.PI;

    this.currentEuler = this.targetRotationEuler.clone();

    this.targetRotationQuaternion.setFromEuler(this.currentEuler);

    this.direction = this.forwardVector.clone().applyQuaternion(this.targetRotationQuaternion);

    this.velocity = this.direction.clone().multiplyScalar(4);

    this.ai.body.velocity.copy(this.velocity);
    this.ai.rotation.y = ang;

    //this.ai.quaternion.copy(this.direction);
  }
}
