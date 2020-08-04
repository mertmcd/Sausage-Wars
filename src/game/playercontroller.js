import Globals from "./globals";

export default class PlayerController {
  constructor(player) {
    this.player = player;
    this.controls = app.controls;
    this.isClicked = false;
    this.activateEnemy = false;
  }
  update(delta) {
    //this.isClicked = false;
    if (this.controls.isDown) {
      if (!this.activateEnemy) {
        this.activateEnemy = true;
        for (let i = 0; i < Globals.sausages.length; i++) {
          Globals.sausages[i].controller.setActive(true);
        }
      }
      this.isClicked = true;
      this.player.body.angularDamping = 1;

      let dx = 0.05 * (this.controls.mouseX - this.controls.downX);

      let dy = 0.05 * (this.controls.mouseY - this.controls.downY);

      let rota = Math.atan2(dx, dy);

      if (dx > 7) dx = 7;
      else if (dx < -7) dx = -7;

      if (dy > 7) dy = 7;
      else if (dy < -7) dy = -7;

      this.player.body.velocity.x = dx;
      this.player.body.velocity.z = dy;
      this.player.rotation.y = rota;
    } else if (!this.controls.isDown && this.isClicked) {
      this.player.body.velocity.x = 0;
      this.player.body.velocity.z = 0;
      this.isClicked = false;
    }
    if (this.player.body.position.x >= 9) this.player.body.position.x = 9;
    else if (this.player.body.position.x <= -9) this.player.body.position.x = -9;

    if (this.player.body.position.z > 9) this.player.body.position.z = 9;
    else if (this.player.body.position.z < -9) this.player.body.position.z = -9;
  }
}
