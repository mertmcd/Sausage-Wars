export default class Ai extends Sausage {
  constructor(ai) {
    super(pos, rot);
  }
  update(delta) {}
  setAi() {
    this.controller = new AiController(this);
    this.isAi = true;
  }
  animAi() {
    if (this.controls.isDown) this.animManager.fadeToAction("kosma", {duration: 0.2, loopType: LoopRepeat});
  }
}
