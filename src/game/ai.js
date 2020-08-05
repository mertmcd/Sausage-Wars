import Sausage from "./sausage";
import AiController from "./aicontroller";
import {LoopRepeat} from "three";
import Globals from "./globals";

export default class Ai extends Sausage {
  constructor(pos, rot) {
    super(pos, rot);

    this.controller = new AiController(this);
    this.isAi = true;
    // Globals.Ai = this;
    this.mert = false;

    this.body.currentState = Globals.states.IDLE;
    this.initAnimation();
  }
  update(delta) {
    this.animManager.update(delta);

    this.body.position.y = 2.1;
    this.position.copy(this.body.position);

    this.controller.update(delta);

    if (this.body.currentState === Globals.states.IDLE) {
      if (this.controller.isActive) {
        this.setState(Globals.states.MOVE);
        this.animManager.fadeToAction("kosma", {duration: 0.2, loopType: LoopRepeat});
      }
    } else if (this.body.currentState === Globals.states.MOVE) {
      // this.body.currentState === Globals.states.MOVE;
      this.animManager.startAnimation("kosma", false);
      console.log("can");
      //this.body.currentState = Globals.states.MOVE;
    }
  }

  setState(state) {
    this.currentState = state;
  }

  animAi() {
    //if (this.controls.isDown) ;
  }
}
