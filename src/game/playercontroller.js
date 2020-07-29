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

      // dx = dx / Math.abs(dx);
      // dy = dy / Math.abs(dy);

      if (dx > 7) dx = 7;
      else if (dx < -7) dx = -7;

      if (dy > 7) dy = 7;
      else if (dy < -7) dy = -7;

      // console.log("dx: " + dx);
      // console.log("dy: " + dy);

      this.player.body.velocity.x = dx;
      this.player.body.velocity.z = dy;
    }

    if (!isClicked) {
      this.player.body.velocity.x = 0;
      this.player.body.velocity.z = 0;
    }
  }
}
