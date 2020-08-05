import Sausage from "./sausage";
import PlayerController from "./playercontroller";
import {LoopRepeat} from "three";
import Globals from "./globals";

export default class Player extends Sausage {
  constructor(pos, rot) {
    super(pos, rot);

    this.controller = new PlayerController(this);
    this.isAi = false;

    this.body.currentState = Globals.states.IDLE;
    this.initAnimation();
  }
  update(delta) {
    this.animManager.update(delta);

    this.body.position.y = 2.1;
    this.position.copy(this.body.position);

    this.controller.update(delta);

    // if (this.body.currentState === Globals.states.IDLE && this.controller.isClicked) {
    // //  this.setState(Globals.states.MOVE);
    //   this.animManager.fadeToAction("kosma", {duration: 0.2, loopType: LoopRepeat});
    // } else if (this.body.currentState === Globals.states.IDLE && !this.controller.isClicked) {
    //   // this.animManager.startAnimation("kafaatma", false);
    //   console.log("mert");
    //   this.animManager.startAnimation("idle", {loopType: LoopRepeat});
    //   this.setState(Globals.states.IDLE);
    // }

    if (this.body.currentState === Globals.states.IDLE) {
      if (this.controller.isClicked) {
        this.setState(Globals.states.MOVE);
        this.animManager.fadeToAction("kosma", {duration: 0.2, loopType: LoopRepeat});
      }
    } else if (this.body.currentState === Globals.states.MOVE && !this.controller.isClicked) {
      this.animManager.startAnimation("kafaatma", false);
      this.setState(Globals.states.ATTACK);
    } else if (this.body.currentState === Globals.states.ATTACK && !this.controller.isClicked) {
      this.animManager.fadeToAction("idle", {loopType: LoopRepeat});
      this.setState(Globals.states.IDLE);
    }
  }

  setState(state) {
    this.body.currentState = state;
  }

  //   animPlayer() {
  //     if (this.controls.isDown) {
  //       this.isClicked = true;
  //       this.animManager.fadeToAction("kosma", {duration: 0.2, loopType: LoopRepeat});
  //     } else if (!this.controls.isDown && this.isClicked) {
  //       this.isClicked = false;
  //       this.animManager.startAnimation("kafaatma", false);
  //       this.animManager.fadeToAction("idle", {loopType: LoopRepeat});
  //     }
  //   }
}
