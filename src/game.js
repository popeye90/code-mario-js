kaboom({
  global: true,
  fullscreen: true,
  scale: 1,
  debug: true,
  clearColor: [0, 0, 0, 1],
});

const MOVE_SPEED = 120;
const JUMP_FORCE = 360;
const BIG_JUMP_FORCE = 550;
let CURRENT_JUMP_FORCE = JUMP_FORCE;
const FALL_DEATH = 400;
const ENEMY_SPEED = 20;

let isJumping = true;

//sound
loadSound("bg-music", "/sound/download/Super Mario Bros. medley.mp3");
loadSound("coin-s", "/sound/smw_coin.wav");
loadSound("mushroom-s", "/sound/smw_hit_while_flying.wav");
loadSound("jump-s", "/sound/smw_jump.wav");
loadSound("brick-s", "/sound/smw_break_block.wav");

//images
loadRoot("/images");
loadSprite("bg", "/bg.png");
loadSprite("grass", "/grass.png");
loadSprite("coin", "/coin.png");
loadSprite("evil-shroom", "/evil-shroom.png");
loadSprite("brick", "/brick.png");
loadSprite("block", "/block.png");
loadSprite("mario", "/mario.png");
loadSprite("mushroom", "/mushroom.png");
loadSprite("suprise-block", "/suprise-block.png");
loadSprite("unboxed", "/block.png");
loadSprite("pipe-top-left", "/pipe-top-left.png");
loadSprite("pipe-top-right", "/pipe-top-right.png");
loadSprite("pipe-bottom-left", "/pipe-bottom-left.png");
loadSprite("pipe-bottom-right", "/pipe-bottom-right.png");

loadSprite("blue-brick", "/blue-brick.png");

scene("game", ({ level, score }) => {
  layers(["bg", "obj", "ui"], "obj");

  
  
  const music = play('bg-music',{
  volume: 0.1,
  loop: 2
  
  })

  add([sprite("bg"), origin("topleft")]);

  const maps = [
    [
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                                       ",
      "                       $$$                ",
      "                       bbb               ",
      "                      b                 ",
      "         $ $         b                  ",
      "       =*=%=       bb================                    ",
      "                                       ",
      "                                       ",
      "      $$$    $$$                          ()  ",
      "..........................................................................................",
    ],
    [
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "                                          ",
      "       =======$$$$$$                                   ",
      "                                          ",
    ],
  ];
 
  const levelCfg = {
    width: 20,
    height: 20,
    ".": [sprite("grass", solid())],
    'b': [sprite('block',solid()), rect()],
    "=": [sprite("brick"), solid(), "brick"],
    '$': [sprite("coin"), "coin"],
    "%": [sprite("suprise-block"), solid(), "coin-surprise"],
    "£": [sprite("blue-brick"), solid(), scale(0.5)],
    "#": [sprite("mushroom"), solid(), "mushroom", body()],
    "!": [sprite("pipe-top-left"), solid()],
    "*": [sprite("suprise-block"), solid(), "mushroom-surprise"],
    "}": [sprite("unboxed"), solid()],
    "(": [sprite("pipe-bottom-left"), solid(), scale(0.7), "pipe"],
    ")": [sprite("pipe-bottom-right"), solid(), scale(0.7), "pipe"],
  };
  const gameLevel = addLevel(maps[level], levelCfg);

  const scoreLabel = add([
    text(score, 12),
    pos(30, 30),
    color(1, 1, 1),

    layer("ui"),
    {
      value: score,
    },
  ]);
  add([
    text("World " + parseInt(level + 1),12),
    pos(650, 30),
    layer("ui"),
    {
      value: level,
    },
  ]);

  function big() {
    let timer = 0;
    let isBig = false;
    return {
      update() {
        if (isBig) {
          CURRENT_JUMP_FORCE = BIG_JUMP_FORCE;
          timer -= dt();
          if (timer <= 0) {
            this.smallify();
          }
        }
      },
      isBig() {
        return isBig;
      },
      smallify() {
        this.scale = vec2(1);
        CURRENT_JUMP_FORCE = JUMP_FORCE;
        timer = 0;
        isBig = false;
      },
      biggify(time) {
        this.scale = vec2(2);
        timer = time;
        isBig = true;
        play("mushroom-s");
      },
    };
  }
  const wall = add([
    sprite('block'),
    solid(),
  ])
 

  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 600),
    body(),
    big(),
    origin("bot"),
  ]); //palyer

  add([
    rect(width(), 20),
    pos(0, height() - 40),
    color(rgba(0, 194, 0, 0.9)),
    solid(),
  ]);

  action("mushroom", (m) => {
    m.move(40, 0);
  });

  player.on("headbump", (obj) => {
    if (obj.is("coin-surprise")) {
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("}", obj.gridPos.sub(0, 0));
    }
    if (obj.is("mushroom-surprise")) {
      gameLevel.spawn("#", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("}", obj.gridPos.sub(0, 0));
    }
  });
  player.collides("mushroom", (m) => {
    destroy(m);
    player.biggify(6);
  });
  player.collides("coin", (c) => {
    destroy(c);
    scoreLabel.value++;
    scoreLabel.text = scoreLabel.value;
    play("coin-s");
  });

  player.collides("brick", (b) => {
    destroy(b);
    play("brick-s");
  });

  player.collides("mushroom", (m) => {
    destroy(m);
    player.biggify(6);
  });

  action("dangerous", (d) => {
    d.move(-ENEMY_SPEED, 0);
  });

  player.collides("pipe", () => {
    keyPress("down", () => {
      go("game", {
        level: (level + 1) % maps.length,
        score: scoreLabel.value,
        music: [music.stop()],
        
      });
    });
  });

  keyDown("left", () => {
    player.move(-MOVE_SPEED, 0);
  });

  keyDown("right", () => {
    player.move(MOVE_SPEED, 0);
  });

  player.action(() => {
    if (player.grounded()) {
      isJumping = false;
    }
  });

  keyPress("space", () => {
    if (player.grounded()) {
      isJumping = true;
      player.jump(CURRENT_JUMP_FORCE);
      play("jump-s");
    }
  });
  
});

scene("lose", ({ score }) => {
  add([text(score, 32), origin("center"), pos(width() / 2, height() / 2)]);
});

start("game", { level: 0, score: 0 });
