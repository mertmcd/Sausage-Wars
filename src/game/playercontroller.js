export default class PlayerController {
  constructor(player) {
    this.player = player;
  }
  update(delta) {
    let controls = app.controls;

    if (controls.isDown) {
      this.player.body.angularDamping = 1;

      let dx = controls.mouseX - controls.downX;
      let dy = controls.mouseY - controls.downY;
      console.log("mouse x: " + controls.mouseX);
      console.log("dwon x: " + controls.downX);

      dx *= 0.0005;
      dy *= 0.0005;

      this.player.body.position.x += dx;
      this.player.body.velocity.x = 0;
      this.player.body.position.z += dy;
      this.player.body.velocity.z = 0;

      // let dx = 0.03 * (controls.mouseX - controls.prevX);
      // console.log("dx: " + dx);
      // let dy = 0.03 * (controls.mouseY - controls.prevY);
      // console.log("dy: " + dy);

      // this.player.tx += dx;
      // this.player.ty += dy;

      // this.player.body.position.x += (this.player.tx - this.player.body.position.x) * 0.1;
      // this.player.body.position.z += (this.player.ty - this.player.body.position.z) * 0.1;
      // console.log("posx: " + this.player.body.position.x);
      // console.log("posy: " + this.player.body.position.z);
    }
  }
}
