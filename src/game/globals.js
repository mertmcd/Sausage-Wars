let Globals = {};

Globals.main;
Globals.game;
Globals.ui;
Globals.player;
Globals.animManager;
Globals.ai;
Globals.isClicked;
Globals.sausages;
Globals.gameObjects = [];
Globals.states = {
  IDLE: 0,
  MOVE: 1,
  ATTACK: 2,
  HIT: 3,
  DIE: 4,
};

export default Globals;
