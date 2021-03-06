import Sausage from "./sausage";
import PlayerController from "./playercontroller";
import {LoopRepeat, LoopOnce, Vector3} from "three";
import Globals from "./globals";

export default class Player extends Sausage {
  constructor(pos, rot) {
    super(pos, rot);

    this.controller = new PlayerController(this);
    this.isAi = false;

    this.body.currentState = Globals.states.IDLE;
    this.initAnimation();

    this.currentTarget = null;

    // Add triangle

    let geo = new THREE.Geometry();

    let v1 = new THREE.Vector3(-0.5, 0, 1);
    let v2 = new THREE.Vector3(0.5, 0, 1);
    let v3 = new THREE.Vector3(0, 0, 2);

    geo.vertices.push(v1);
    geo.vertices.push(v2);
    geo.vertices.push(v3);

    let mat = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
    });

    geo.faces.push(new THREE.Face3(0, 1, 2));
    geo.computeFaceNormals();

    let triangle = new THREE.Mesh(geo, mat);

    triangle.scale.multiplyScalar(0.4);
    triangle.position.copy(this.circle.position);
    // triangle.position.x = 1;
    triangle.position.y = -1;
    triangle.position.z = 0.5;

    //triangle.rotation.z = Math.PI / 2;
    this.add(triangle);
    console.log(this);
  }

  update(delta) {
    this.body.position.y = 2.1;

    // if (!Globals.isHit) {
    //   this.body.velocity.x = 0;
    //   this.body.velocity.z = 0;
    // }
    this.controller.update(delta);

    if (this.body.currentState === Globals.states.IDLE) {
      if (this.controller.isClicked) {
        this.setState(Globals.states.MOVE);
      }
    } else if (this.body.currentState === Globals.states.MOVE && !this.controller.isClicked) {
      this.setState(Globals.states.ATTACK);
      this.animManager.fadeToAction("kafaatma", {duration: 0.1, loopType: LoopOnce});
      this.animManager.curAnim.onComplete(() => {
        this.setState(Globals.states.IDLE);
        this.animManager.fadeToAction("idle", {loopType: LoopRepeat});
      });
    }

    if (this.body.currentState === Globals.states.MOVE) {
      this.animManager.fadeToAction("kosma", {duration: 0.2, loopType: LoopRepeat});

      for (let i = 0; i < Globals.sausages.length; i++) {
        let enemy = Globals.sausages[i];
        let dist = this.body.position.distanceTo(enemy.body.position);
        if (dist < 1.5) {
          let diff = new Vector3().subVectors(enemy.body.position, this.body.position);
          let ang = Math.atan2(diff.x, diff.z);
          // this.rotation.y = ang;

          let vx = 7 * Math.sin(ang);
          let vz = 7 * Math.cos(ang);
          enemy.body.velocity.x += vx;
          enemy.body.velocity.z += vz;

          this.animManager.fadeToAction("kafaatma", {duration: 0.1, loopType: LoopOnce});
          this.animManager.curAnim.onComplete(() => {
            this.setState(Globals.states.IDLE);
            this.animManager.fadeToAction("idle", {loopType: LoopRepeat});
            this.timer = 0;
          });
          enemy.animManager.fadeToAction("sarsilma", {duration: 0.1, loopType: LoopOnce});
          this.setState(Globals.states.ATTACK);
          break;
        }
      }
    } else if (this.body.currentState === Globals.states.ATTACK) {
      this.body.velocity.set(0, 0, 0);
      if (this.animManager.getCurPerctange() >= 1) {
        this.setState(Globals.states.IDLE);
        console.log("mc");
      }
    }
    this.animManager.update(delta);
    this.position.copy(this.body.position);
  }

  setState(state) {
    this.body.currentState = state;
  }
}
