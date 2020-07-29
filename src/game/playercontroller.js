export default class PlayerController {
  constructor(player) {
    this.player = player;
  }
  update(delta) {
    let controls = app.controls;
    let isClicked = false;

    if (controls.isDown) {
      this.player.body.angularDamping = 1;
      isClicked = true;

      let dx = 0.05 * (controls.mouseX - controls.downX);
      let dy = 0.05 * (controls.mouseY - controls.downY);

      let rota = Math.atan2(dx, dy);

      if (dx > 7) dx = 7;
      else if (dx < -7) dx = -7;

      if (dy > 7) dy = 7;
      else if (dy < -7) dy = -7;

      this.player.body.velocity.x = dx;
      this.player.body.velocity.z = dy;
      this.player.rotation.y = rota;
    }

    if (!isClicked) {
      this.player.body.velocity.x = 0;
      this.player.body.velocity.z = 0;
    }
  }
}
