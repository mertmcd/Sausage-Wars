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
  }

  moveAi() {
    let dx = Math.random() * 20 - 10;
    console.log("x: " + dx);
    let dy = Math.random() * 20 - 10;
    console.log("y: " + dy);

    //   let dx = 7;
    //   let dy = 7;

    let rota = Math.atan2(dx, dy);

    if (dx > 7) dx = 7;
    else if (dx < -7) dx = -7;

    if (dy > 7) dy = 7;
    else if (dy < -7) dy = -7;

    this.ai.body.velocity.x = dx;
    this.ai.body.velocity.z = dy;
    this.ai.rotation.y = rota;

    this.ai.body.velocity.x = 0;
    this.ai.body.velocity.z = 0;
  }

  setActive(isActive) {
    this.isActive = isActive;
    if (isActive) {
      this.moveAi();
    }
    this.timer = 0;
  }
}
