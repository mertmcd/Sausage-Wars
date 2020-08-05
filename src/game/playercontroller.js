import Globals from "./globals";
// import Player from "./player";
import {Vector3} from "three";

export default class PlayerController {
  constructor(player) {
    this.player = player;
    this.controls = app.controls;
    this.isClicked = false;
    this.player.body.angularDamping = 1;
  }

  update(delta) {
    this.player.body.velocity.y = 0;

    if (this.controls.isDown) {
      this.isClicked = true;

      let dx = this.controls.mouseX - this.controls.downX;
      let dz = this.controls.mouseY - this.controls.downY;

      this.player.body.velocity.x = dx;
      this.player.body.velocity.z = dz;

      let velo = new Vector3().copy(this.player.body.velocity);
      velo.setLength(6);
      this.player.body.velocity.copy(velo);

      let rota = Math.atan2(dx, dz);
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
