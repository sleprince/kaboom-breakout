import kaboom from "kaboom";
//import { createLevel } from "kaboom";

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
//loadFont("breakout", "sprites/breakout_font.png", 6, 8, {
//    chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ  0123456789:!'",
//});

//add sounds
loadSound("blockbreak", "sounds/Explosion5.ogg");
loadSound("paddlehit", "sounds/Powerup20.ogg");
loadSound("powerup", "sounds/Powerup2.ogg");
loadSound("ArcadeOddities", "sounds/Arcade-Oddities.mp3");

//json levelopt defines all gameobjects, needs to occur before level defined
const LEVELOPT = {
    //NB used to be width and height on previous kaboom version
    tileWidth: 32,
    tileHeight: 16,
    //tiles: was missing in tutorial which caused fundamental problem
    tiles: {
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
            anchor("center"),
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
            anchor("center"),
            "ball",
            {
                hspeed: 100,
                vspeed: 50,
            },
        ],
    }
};

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
        "            @           ",
    ],
];


scene("game", ({ levelIndex, score, lives }) => {

    //used to be add level
    addLevel(LEVELS[levelIndex], LEVELOPT);



    // mouse controls
    onUpdate("paddle", (paddle) => {

       // debug.log(mousePos().x);

        if (
            mousePos().x > 0 &&
            mousePos().x < width() &&
            mousePos().y > 0 &&
            mousePos().y < height()
        )

        {
                paddle.pos.x = mousePos().x;
        }
    });


    // ball movement
    onUpdate("ball", (ball) => {
        ball.move(ball.hspeed, ball.vspeed);
    });

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


