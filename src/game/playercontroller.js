import {Euler} from "three";

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

      //  console.log("dx: " + dx);
      // console.log("dy: " + dy);

      // let ratio = dx / dy / 8;
      // let ang = ratio * Math.PI;

      // if (ratio > 0 && dx > 0) {
      //   console.log("3");
      // } else if (ratio > 0 && dx < 0) {
      //   console.log("1");
      //   ang += 180;
      // } else if (ratio < 0 && dx > 0) {
      //   console.log("2");
      //   ang += 180;
      // } else {
      //   console.log("4");
      // }

      let rota = Math.atan2(dx, dy);
      // let rota = new Euler(0, ang, 0);

      //  console.log(ang);

      if (dx > 7) dx = 7;
      else if (dx < -7) dx = -7;

      if (dy > 7) dy = 7;
      else if (dy < -7) dy = -7;

      this.player.body.velocity.x = dx;
      this.player.body.velocity.z = dy;
      this.player.rotation.y = rota; // copy(rota);
    }

    if (!isClicked) {
      this.player.body.velocity.x = 0;
      this.player.body.velocity.z = 0;
    }
  }
}
