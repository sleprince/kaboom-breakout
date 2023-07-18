import kaboom from "kaboom"

const FLOOR_HEIGHT = 48;
let JUMP_FORCE = 800;
const SPEED = 480;

// initialize context
kaboom({
    width: 768,
    height: 360,
    background: [0, 0, 0],
});

//load all sprites
loadSpriteAtlas("sprites/breakout_pieces.png", {
    blocka: {
        x: 8,
        y: 8,
        width: 32,
        height: 16,
    },
    blockb: {
        x: 8,
        y: 28,
        width: 32,
        height: 16,
    },
    blockc: {
        x: 8,
        y: 48,
        width: 32,
        height: 16,
    },
    blockd: {
        x: 8,
        y: 68,
        width: 32,
        height: 16,
    },
    paddle: {
        x: 8,
        y: 152,
        width: 64,
        height: 16,
    },
    ball: {
        x: 48,
        y: 136,
        width: 8,
        height: 8,
    },
    heart: {
        x: 120,
        y: 136,
        width: 8,
        height: 8,
    },
});

//add custom font
loadFont("breakout", "sprites/breakout_font.png", 6, 8, {
    chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ  0123456789:!'",
});

//add sounds
loadSound("blockbreak", "sounds/Explosion5.ogg");
loadSound("paddlehit", "sounds/Powerup20.ogg");
loadSound("powerup", "sounds/Powerup2.ogg");
loadSound("ArcadeOddities", "sounds/Arcade-Oddities.mp3");

//ascii create levels
const LEVELS = [
    [
        "                        ",
        "                        ",
        "dddddddddddddddddddddddd",
        "cccccccccccccccccccccccc",
        "bbbbbbbbbbbbbbbbbbbbbbbb",
        "aaaaaaaaaaaaaaaaaaaaaaaa",
        "                        ",
        "                        ",
        "                        ",
        "            .           ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "            @           ",
    ],
    [
        " aaaaaaaaaaaaaaaaaaaaaa ",
        " a                    a ",
        " a  bbbbbbbbbbbbbbbbb a ",
        " a  b               b a ",
        " a  b    ccccccc    b a ",
        " a  b  ccdddddddcc  b a ",
        " a  b    ccccccc    b a ",
        " a  b               b a ",
        " a  bbbbbbbbbbbbbbbbb a ",
        " a                    a ",
        " aaaaaaaaaaaaaaaaaaaaaa ",
        "                        ",
        "            .           ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "                        ",
        "            @           ",
    ],
];

//json levelopt defines all gameobjects
const LEVELOPT = {
    width: 32,
    height: 16,
    a: () => [
        // block
        sprite("blocka"),
        area(),
        "block",
        "bouncy",
        {
            points: 1,
        },
    ],
    b: () => [
        // block
        sprite("blockb"),
        area(),
        "block",
        "bouncy",
        {
            points: 2,
        },
    ],
    c: () => [
        // block
        sprite("blockc"),
        area(),
        "block",
        "bouncy",
        {
            points: 4,
        },
    ],
    d: () => [
        // block
        sprite("blockd"),
        area(),
        "block",
        "bouncy",
        {
            points: 8,
        },
    ],
    "@": () => [
        // paddle
        sprite("paddle"),
        area(),
        origin("center"),
        "paddle",
        "bouncy",
        {
            speed: 400,
        },
    ],
    ".": () => [
        // ball
        sprite("ball"),
        color(WHITE),
        area(),
        origin("center"),
        "ball",
        {
            hspeed: 100,
            vspeed: 50,
        },
    ],
};

scene("game", ({ levelIndex, score, lives }) => {
    addLevel(LEVELS[levelIndex], LEVELOPT);
});

// start game on first level
function start() {
    go("game", {
        levelIndex: 0,
        score: 0,
        lives: 3,
    });
}

start();

