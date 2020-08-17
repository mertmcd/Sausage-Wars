import assetManager from "./assetManager";
import Confetti from "../utils/confetti";
import Ui from "./ui";
import Globals from "./globals";
import {Body, Sphere, Box, Vec3} from "cannon";
import {Vector3, Box3, Triangle, Euler, LoopOnce} from "three";
import Sausage from "./sausage";
import Player from "./player";
import Ai from "./ai";

//import AnimateTest from './animateTest';

var gameEnded = false;
var main, clock, controls, ui;
var isTest = true;
var data, confettiMaker;
var updateFunction;
let cam;

class Game {
  constructor(_main) {}

  boot(_main) {
    main = _main;
    main.data = app.data;
    data = app.data;
    main.isTest = isTest;

    Globals.game = this;
    Globals.main = main;

    main.renderer.outputEncoding = THREE.GammaEncoding;
    main.renderer.gammaFactor = 2.2;

    ////add fog here if you want fog

    clock = new THREE.Clock();

    if (app.type == "tapjoy" && window.TJ_API) {
      window.TJ_API.setPlayableBuild("v1.0");
      window.TJ_API.setPlayableAPI({
        skipAd: function () {
          app.data.hasTryAgain = false;
          this.endGame(false);
        },
      });
    }

    assetManager.loadAssets(main, (list) => {
      this.assetList = list;
      main.assets = list;
      main.assetsLoaded();
    });
  }

  init(fromRestart) {
    confettiMaker = new Confetti(main.scene);
    this.initLights();
    this.initControls();

    cam = main.camera;
    cam.position.set(0, 20, 20);
    cam.lookAt(0, 0, 0);

    main.initCannonDebug();
    main.world.allowSleep = true;

    // /// /// /// /// ///     C O D E     B E L O W     \\\ \\\ \\\ \\\ \\\ \\

    // Add platform

    let pathGeo = new THREE.BoxGeometry(20, 2, 20);
    let pathMat = new THREE.MeshPhongMaterial({
      color: 0x787878,
    });
    this.path = new THREE.Mesh(pathGeo, pathMat);

    this.path.position.set(0, 0, 0);
    main.scene.add(this.path);

    // Add sausages to the scene

    let number = 5;
    let radius = 7;
    Globals.sausages = [];

    for (let i = 0; i < number; i++) {
      let angle = (i / (number * 0.5)) * Math.PI;
      let rot = new Euler(0, -angle, 0);
      let pos = new Vector3(0 + radius * Math.sin(angle), 0, 0 - radius * Math.cos(angle));

      if (i != 0) {
        let ai = new Ai(pos, rot);
        ai.body.tag = "enemy";
        Globals.sausages.push(ai);
      } else {
        Globals.player = new Player(pos, rot);
        Globals.player.body.tag = "enemy";
      }
    }

    // Collision

    // for (let enemy of Globals.gameObjects) {
    //   continue;
    //   //Globals.isHit = false;
    //   enemy.body.addEventListener("collide", (e) => {
    //     if (e.body.tag === "enemy") {
    //       let curBody = e.target;
    //       let targetBody = e.body;

    //       curBody.currentState = Globals.states.ATTACK;

    //       //Globals.isHit = true;

    //       // let distance = Math.sqrt((e.target.position.x - e.body.position.x) * (e.target.position.x - e.body.position.x) + (e.target.position.z - e.body.position.z) * (e.target.position.z - e.body.position.z));
    //       // console.log("d: " + distance);

    //       //if (distance > 0.5) {
    //       console.log(e);
    //       curBody.master.animManager.fadeToAction("kafaatma", {duration: 0.1, loopType: LoopOnce});
    //       //e.target.animManager.fadeToAction("sarsilma", {duration: 0.2, loopType: LoopOnce});
    //       let angle = Math.atan2(targetBody.position.x - curBody.position.x, targetBody.position.z - curBody.position.z);
    //       //console.log("body: " + e.body);
    //       //console.log("target: " + e.target);

    //       let vx = 2 * Math.sin(angle);
    //       let vz = 2 * Math.cos(angle);
    //       //e.body.velocity.x += -vx;
    //       //e.body.velocity.z += -vz;
    //       targetBody.velocity.set(0, 0, 0);
    //       targetBody.velocity.x += vx * 5;
    //       targetBody.velocity.z += vz * 5;
    //       //console.log(vx);
    //       // }
    //       // console.log(e);
    //       // e.body.applyForce(new Vec3(500, 0, 500), e.body.position);
    //       // e.target.applyForce(new Vec3(500, 0, 500), e.target.position);

    //       // e.body.velocity.z -= 5;
    //     }
    //   });
    //   //Globals.isHit = false;
    // }

    if (fromRestart) {
      return;
    }

    // call these functions once

    updateFunction = this.update.bind(this);
    this.initUi();
    this.update();
    this.initTouchEvents();

    this.onResizeCallback(main.lastWidth, main.lastHeight);
    setTimeout(() => {
      this.onResizeCallback(main.lastWidth, main.lastHeight);
    }, 500);
  }

  initControls() {
    controls = main.utility.initControls();
    //controls = main.utility.initControlsPointer(); ///for pepjs
    app.controls = controls;

    if (isTest) {
      isTest = false;
      window.onkeydown = function (e) {
        if (e.key == "a" && !isTest) {
          isTest = true;
          controls = main.utility.startOrbitControls(0, 1500);
        }

        if (e.key == "s" && isTest) {
          isTest = false;
          controls.dispose && controls.dispose();
        }
        main.isTest = isTest;
      };
    }
  }

  initUi() {
    let uiDiv = document.getElementById("ui");
    ui = new Ui(uiDiv);
    Globals.ui = ui;
    ui.prepare();
  }

  update() {
    main.update();
    requestAnimationFrame(updateFunction);

    var delta = clock.getDelta();
    if (!delta || isNaN(delta)) delta = 0.01;
    if (delta > 0.03) delta = 0.03;
    var ratio = delta * 60;

    let controls = app.controls;

    for (let obj of Globals.gameObjects) {
      obj.update(delta);
    }

    cam.position.x = Globals.player.body.position.x; // 0
    cam.position.z = Globals.player.body.position.z + 27; // 20
    //confettiMaker && confettiMaker.update();

    main.CANNON && main.CANNON.cannonDebugRenderer && main.CANNON.cannonDebugRenderer.update();
    main.world && main.world.step(delta);

    //main.renderer.render(main.scene, main.camera);
    //console.log(cam.position);

    app.threeRenderOnUpdate && main.renderer.render(main.scene, main.camera);
  }

  onResizeCallback() {
    if (!main) {
      return;
    }
    let w = window.innerWidth;
    let h = window.innerHeight;

    app.w = w;
    app.h = h;

    if (ui) {
      ui.resize(w, h);
    }
  }

  initLights() {
    let lightColor = 0xffffff;

    let ambientLight = new THREE.AmbientLight(lightColor, 1); //0.7
    main.scene.add(ambientLight);

    var dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(-300, 1000, 0);
    main.scene.add(dirLight);
  }

  initTouchEvents() {
    function pointerDown(e) {
      let install = ui.install;
      let bottomBanner = ui.bottomBanner;

      if (install && !install.classList.contains("show")) {
        install.classList.add("show");
        install.resize && install.resize();
      }

      if (bottomBanner && !bottomBanner.classList.contains("show")) {
        bottomBanner.classList.add("show");
        bottomBanner.resize && bottomBanner.resize();
      }

      if (!main.timeStarted && app.type != "mobvista") {
        main.startTimer();
      }
    }

    function pointerUp(e) {}

    let domElement = document.body;

    ///pointer events require pepjs on safari
    /*domElement.addEventListener("pointerdown", pointerDown);
        domElement.addEventListener("pointerup", pointerUp);
        domElement.addEventListener("pointermove", pointerMove);*/

    domElement.addEventListener("touchstart", pointerDown);
    domElement.addEventListener("touchend", pointerUp);

    if ("ontouchstart" in document.documentElement) {
    } else {
      domElement.addEventListener("mousedown", pointerDown);
      domElement.addEventListener("mouseup", pointerUp);
    }
  }

  endGame(didWon, reason) {
    if (gameEnded) {
      return;
    }

    gameEnded = true;
    main.gameEnded = true;

    ui.addEndCard();
    ////Call this part if the game is completely ended

    if (app.type == "tapjoy" && window.TJ_API) {
      if (didWon) {
        window.TJ_API && window.TJ_API.objectiveComplete();
      }
      window.TJ_API && window.TJ_API.gameplayFinished();

      if (window.TJ_API && window.TJ_API.directives.showEndCard) {
        // render end card
      } else {
        /* prepare for Tapjoy endcard */
        return;
      }
    }

    main.gameFinished(didWon, reason);
  }

  restartGame() {
    main.restartGame(data.totalTime);

    gameEnded = false;
    main.gameEnded = false;
    let scene = main.scene;

    for (var i = scene.children.length - 1; i >= 0; i--) {
      let obj = scene.children[i];
      scene.remove(obj);
      if (obj.body) {
        if (main.CANNON) {
          main.world.remove(obj.body);
        } else if (main.matter) {
          main.mater.removeBody(obj.body);
        }
      }
    }

    main.objectMaker.clear();
    this.init(true);
  }
}

export default Game;
