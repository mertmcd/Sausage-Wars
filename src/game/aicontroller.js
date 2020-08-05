import Globals from "./globals";
// import Ai from "./ai";
import {Vector3} from "three";

export default class AiController {
  constructor(ai) {
    this.ai = ai;
    this.controls = app.controls;
    this.timer = 0;
    this.decisionTime = 2;
    this.isActive = false;
    this.activateEnemy = false;
    this.ai.body.angularDamping = 1;
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
        this.timer = 0;
        this.moveAi();
      }
    }

    let posx = this.ai.body.position.x;
    let posz = this.ai.body.position.z;
    if (posx > 9 || posx < -9 || posz > 9 || posz < -9) {
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
}
