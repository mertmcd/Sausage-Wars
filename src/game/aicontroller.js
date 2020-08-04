import Globals from "./globals";

export default class AiController {
  constructor(ai) {
    this.ai = ai;
    this.controls = app.controls;
    this.timer = 0;
    this.decisionTime = 2;
    this.isActive = false;
  }
  update(delta) {
    if (this.isActive) {
      this.timer += delta;
      if (this.timer >= this.decisionTime) {
        this.timer = 0;
        this.moveAi();
      }
    }

    this.ai.body.angularDamping = 1;

    if (this.ai.body.position.x >= 9) this.ai.body.position.x = 9;
    else if (this.ai.body.position.x <= -9) this.ai.body.position.x = -9;

    if (this.ai.body.position.z > 9) this.ai.body.position.z = 9;
    else if (this.ai.body.position.z < -9) this.ai.body.position.z = -9;
  }

  moveAi() {
    let dx = Math.random() * 20 - 10;
    let dy = Math.random() * 20 - 10;

    let rota = Math.atan2(dx, dy);

    if (dx > 7) dx = 7;
    else if (dx < -7) dx = -7;

    if (dy > 7) dy = 7;
    else if (dy < -7) dy = -7;

    this.ai.body.velocity.x = dx;
    this.ai.body.velocity.z = dy;
    this.ai.rotation.y = rota;

    /* if (!Globals.isClicked) {
      this.ai.body.velocity.x = 0;
      this.ai.body.velocity.z = 0;
    } */
  }

  setActive(isActive) {
    this.isActive = isActive;
    if (isActive) this.moveAi();

    this.timer = 0;
  }
}
