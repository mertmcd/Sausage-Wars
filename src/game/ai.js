import Sausage from "./sausage";
import AiController from "./aicontroller";
import {LoopRepeat, LoopOnce, Vector3} from "three";
import Globals from "./globals";

export default class Ai extends Sausage {
  constructor(pos, rot) {
    super(pos, rot);

    this.timer = 0.5;

    this.controller = new AiController(this);
    this.controller.id = this.uuid;
    this.isAi = true;

    this.body.currentState = Globals.states.IDLE;
    this.initAnimation();
  }
  update(delta) {
    this.body.position.y = 2.1;

    this.controller.update(delta);

    if (this.body.currentState === Globals.states.IDLE && this.controller.isActive) {
      this.setState(Globals.states.MOVE);
      //   this.animManager.fadeToAction("kosma", {duration: 0.2, loopType: LoopRepeat});
    }
    if (this.body.currentState === Globals.states.MOVE) {
      this.animManager.fadeToAction("kosma", {duration: 0.2, loopType: LoopRepeat});

      //   for (let i = 0; i < Globals.gameObjects.length; i++) {
      //     let enemy = Globals.gameObjects[i];
      //     let dist = this.body.position.distanceTo(enemy.body.position);
      //     if (dist < 1) {
      //       let diff = new Vector3().subVectors(enemy.body.position, this.body.position);
      //       let ang = Math.atan2(diff.x, diff.z);
      //       this.rotation.y = ang;
      //       this.animManager.fadeToAction("kafaatma", {duration: 0.1, loopType: LoopOnce});
      //       enemy.animManager.fadeToAction("sarsilma", {duration: 0.1, loopType: LoopOnce});
      //       this.setState(Globals.states.ATTACK);
      //       break;
      //     }
      //   }
    } else if (this.body.currentState === Globals.states.ATTACK) {
      this.body.velocity.set(0, 0, 0);
      if (this.animManager.getCurPerctange() >= 1) {
        this.setState(Globals.states.IDLE);
      }
    }
    this.animManager.update(delta);
    this.position.copy(this.body.position);
  }

  setState(state) {
    this.body.currentState = state;
  }
}
