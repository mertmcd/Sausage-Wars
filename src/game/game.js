import assetManager from "./assetManager";
import Confetti from "../utils/confetti";
import Ui from "./ui";
import Globals from "./globals";
import {Body, Sphere, Box, Vec3} from "cannon";
import {Vector3, Box3, Triangle, Euler} from "three";
import Sausage from "./sausage";

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
    cam.position.set(0, 3000, 2000);
    cam.lookAt(0, 0, 0);

    main.initCannonDebug();
    main.world.allowSleep = true;

    // /// /// /// /// /// /// /// ///     C O D E     B E L O W     \\\ \\\ \\\ \\\ \\\ \\\ \\\ \\\ \\

    // Add platform

    let pathGeo = new THREE.BoxGeometry(2000, 200, 2000);
    let pathMat = new THREE.MeshPhongMaterial({
      color: 0x787878,
    });
    this.path = new THREE.Mesh(pathGeo, pathMat);

    this.path.position.set(0, 0, 0);
    main.scene.add(this.path);

    this.path.body = new Body({
      position: this.path.position,
      mass: 0,
    });
    let pathShape = new Box(new Vec3(1000, 100, 1000)); //cannonjs
    this.path.body.addShape(pathShape);
    main.world.add(this.path.body);

    // Add sausages

    // let sampleSausage = THREE.SkeletonUtils.clone(main.assets.sausage.scene);
    // //main.scene.add(sampleSausage);

    // let ssgVec = new Vector3();
    // let ssg3 = new Box3().setFromObject(sampleSausage);
    // let ssgSize = ssg3.getSize(ssgVec);
    // console.log(ssgSize);

    let number = 5;
    let radius = 500;

    for (let i = 0; i < number; i++) {
      let angle = (i / (number * 0.5)) * Math.PI;

      let pos = new Vector3(0 + radius * Math.sin(angle), 0, 0 - radius * Math.cos(angle));

      let rot = new Euler(0, -(i * Math.PI) / 2.5, 0);

      let sausage = new Sausage(pos, rot);
      /*       sausage = THREE.SkeletonUtils.clone(main.assets.sausage.scene);
      main.scene.add(sausage);

      angle = (i / (number * 0.5)) * Math.PI;
      sausage.position.set(0 + radius * Math.sin(angle), 500, 0 - radius * Math.cos(angle));
      sausage.rotation.y = -(i * Math.PI) / 2.5;

      sausage.body = new Body({
        position: sausage.position,
        mass: 10,
      });

      let shape = new Box(new Vec3(ssgSize.x / 2, ssgSize.y / 2, ssgSize.z / 2));
      sausage.body.addShape(shape);
      main.world.add(sausage.body);
      sausages.push(sausage); */
    }

    if (fromRestart) {
      return;
    }

    ////call these functions once
    updateFunction = this.update.bind(this);
    this.initUi();
    this.update();
    this.initTouchEvents();

    this.onResizeCallback(main.lastWidth, main.lastHeight);
    setTimeout(() => {
      this.onResizeCallback(main.lastWidth, main.lastHeight);
    }, 500);

    // let animateTest = new AnimateTest("test2", "970A9189C42E104AB20AD7ACF63D34F4");
    // setTimeout(()=>{
    //     animateTest.showEndCard();
    // }, 2000);
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

    if (controls.isDown) {
      let dx = 1.5 * (controls.mouseX - controls.prevX);
      let dy = 1.5 * (controls.mouseY - controls.prevY);
    }

    for (let obj of Globals.gameObjects) {
      obj.update(delta);
    }

    confettiMaker && confettiMaker.update();

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
