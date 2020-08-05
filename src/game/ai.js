import Sausage from "./sausage";
import AiController from "./aicontroller";
import {LoopRepeat} from "three";
import Globals from "./globals";

export default class Ai extends Sausage {
  constructor(pos, rot) {
    super(pos, rot);

    this.timer = 1;

    this.controller = new AiController(this);
    this.isAi = true;

    this.body.currentState = Globals.states.IDLE;
    this.initAnimation();
  }
  update(delta) {
    this.animManager.update(delta);

    this.body.position.y = 2.1;
    this.position.copy(this.body.position);

    this.controller.update(delta);

    if (this.body.currentState === Globals.states.IDLE && this.controller.isActive) {
      this.animManager.fadeToAction("kosma", {duration: 0.2, loopType: LoopRepeat});
    } else if (this.body.currentState === Globals.states.ATTACK) {
      this.timer -= delta;
      if (this.timer <= 0) {
        this.timer = 1;
        this.setState(Globals.states.IDLE);
      }
      //this.animManager.startAnimation("sarsilma", false);
    }
  }

  setState(state) {
    this.body.currentState = state;
  }
}
