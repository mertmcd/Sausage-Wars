export default class PlayerController {
  constructor(player) {
    this.player = player;
  }

  update(delta) {
    let controls = app.controls;

    if (controls.isDown) {
      console.log("mert");

      let dx = 0.01 * (controls.mouseX - controls.prevX);
      let dy = 0.01 * (controls.mouseY - controls.prevY);

      this.player.tx += dx;
      this.player.ty += dy;

      // this.player.body.velocity.x = dx;
      // this.player.body.velocity.z = dy;
      this.player.body.angularDamping = 1;
    }

    this.player.body.position.x += (this.player.tx - this.player.body.position.x) * 0.1;
    this.player.body.position.z += (this.player.ty - this.player.body.position.z) * 0.1;
  }
}
