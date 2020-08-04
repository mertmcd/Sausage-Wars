export default class Player extends Sausage {
  constructor(player) {
    super(pos, rot);
  }

  update(delta) {}
  setPlayer() {
    this.controller = new PlayerController(this);
    this.isAi = false;
  }
  animPlayer() {
    if (this.controls.isDown) {
      this.isClicked = true;
      this.animManager.fadeToAction("kosma", {duration: 0.2, loopType: LoopRepeat});
    } else if (!this.controls.isDown && this.isClicked) {
      this.isClicked = false;
      this.animManager.startAnimation("kafaatma", false);
      this.animManager.fadeToAction("idle", {loopType: LoopRepeat});
    }
  }
}
