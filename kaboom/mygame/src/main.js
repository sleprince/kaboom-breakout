import kaboom from "kaboom";

// initialize context, set canvas size
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

//add custom font, is loadBitmapFont on new version of kaboom
loadBitmapFont("breakout", "sprites/breakout_font.png", 6, 8, {
    chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ  0123456789:!'",
});

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
                hspeed: 300,
                vspeed: 150,
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


scene("game", ({ levelIndex, score, lives, blocks }) => {

    //used to be add level
    addLevel(LEVELS[levelIndex], LEVELOPT);

    //initialise number of blocks at start of level
    blocks = get("block", { recursive: true }).length + 1;

    function getPaddle() {
        // Get all objects in the scene with the tag "paddle"
        const paddles = get("paddle", { recursive: true });

        //return the first paddle found
            return paddles[0];

    }

    // Use the function to get the paddle and move it to the left to test it's working
    //const paddle = getPaddle();
    //paddle.pos.x -= 1000;

    // Declare a flag to track mouse control
    let isMouseControl = false;

    // mouse controls
    onUpdate("paddle", (paddle) => {
        if (isMouseControl) {
            if (
                mousePos().x > 0 &&
                mousePos().x < width() &&
                mousePos().y > 0 &&
                mousePos().y < height()
            ) {
                paddle.pos.x = mousePos().x;
            }
        } 
    });

    // Mouse move event to enable mouse control
    onMouseMove(() => {
        isMouseControl = true;
    });

    const paddle = getPaddle();

    // left key pressed event to disable mouse control
    onKeyDown("left", () => {
        isMouseControl = false;

        if (paddle.pos.x > 0) {
            paddle.pos.x -= 8;
        }
    });

    // right key pressed event to disable mouse control
    onKeyDown("right", () => {
        isMouseControl = false;

        if (paddle.pos.x < width()) {
            paddle.pos.x += 8;
        }
    });


    // ball movement
    onUpdate("ball", (ball) => {
        // bounce off screen edges
        if (ball.pos.x < 0 || ball.pos.x > width()) {
            ball.hspeed = -ball.hspeed;
        }

        if (ball.pos.y < 0) {
            ball.vspeed = -ball.vspeed;
        }

        // fall off screen
        if (ball.pos.y > height()) {
            lives -= 1;
            if (lives <= 0) {
                go("lose", { score: score });
            } else {
                ball.pos.x = width() / 2;
                ball.pos.y = height() / 2;
            }
        }

        // move
        ball.move(ball.hspeed, ball.vspeed);
    });

    // collision with paddle
    onCollide("ball", "bouncy", (ball, bouncy) => {
        ball.vspeed = -ball.vspeed;

        if (bouncy.is("paddle")) {
            // play sound
            play("paddlehit", {
                volume: 0.05,
                });
        }
    });

    // collision with block
    onCollide("ball", "block", (ball, block) => {

        //in this version of kaboom get("block").length without specifying recursive no longer works
        const blockNum = get("block", { recursive: true })


        block.destroy();
        score += block.points;
        blocks = blockNum.length;

        play("blockbreak", {
            volume: 0.05,
        });

        // level end
        if (blockNum.length === 1) {
            // next level
            if (levelIndex != LEVELS.length - 1) {
                go("game", {
                    levelIndex: levelIndex + 1,
                    score: score,
                    lives: lives,
                });
            } else {
                // win
                go("win", { score: score });
            }
        }

        // powerups
        if (chance(0.05)) {
            // extra life
            add([
                sprite("heart"),
                pos(block.pos),
                area(),
                anchor("center"),
                offscreen({ destroy: true }),
                "powerup",
                {
                    speed: 80,
                    effect() {
                        lives++;
                    },
                },
            ]);
        }
    });

    // powerups
    onUpdate("powerup", (powerup) => {
        powerup.move(0, powerup.speed);
    });

    // powerup collision with paddle
    onCollide("powerup", "bouncy", (powerup, bouncy) => {

        if (bouncy.is("paddle")) {
            powerup.effect();
            powerup.destroy();
            play("powerup", {
                volume: 0.05,
                });

        }
    });


    // ui
    onDraw(() => {
        drawText({
            text: `SCORE: ${score}`,
            size: 16,
            pos: vec2(8, 8),
            font: "breakout",
            color: WHITE,
        });
        drawText({
            text: `LIVES: ${lives}`,
            size: 16,
            pos: vec2((width() * 13) / 16, 8),
            font: "breakout",
            color: WHITE,
        });
        drawText({
            text: `BLOCKS: ${blocks - 1}`,
            size: 16,
            pos: vec2((width() * 5) / 16, 8),
            font: "breakout",
            color: WHITE,
        });





    });

});

// intro screen
scene("intro", () => { 
    add([
        text(`BLOCK BREAKER`, {
            size: 32,
            width: width(),
            font: "breakout",
        }),
        pos(12),
    ]);

    add([
        text(`PRESS ANY KEY TO START`, {
            size: 16,
            width: width(),
            font: "breakout",
        }),
        pos(width() / 2, height() * (3 / 4)),
    ]);

    onKeyPress(intro);
    onMousePress(intro);
});


// gameover screens
scene("lose", ({ score }) => {
    add([
        text(`GAME OVER\n\nYOUR FINAL SCORE WAS ${score}`, {
            size: 32,
            width: width(),
            font: "breakout",
        }),
        pos(12),
    ]);

    add([
        text(`PRESS ANY KEY TO RESTART`, {
            size: 16,
            width: width(),
            font: "breakout",
        }),
        pos(width() / 2, height() * (3 / 4)),
    ]);

    onKeyPress(start);
    onMousePress(start);
});

//win screens
scene("win", ({ score }) => {
    add([
        text(`CONGRATULATIONS, YOU WIN!\n\nYOUR FINAL SCORE WAS ${score}`, {
            size: 32,
            width: width(),
            font: "breakout",
        }),
        pos(12),
    ]);

    add([
        text(`PRESS ANY KEY TO RESTART`, {
            size: 16,
            width: width(),
            font: "breakout",
        }),
        pos(width() / 2, height() * (3 / 4)),
    ]);

    onKeyPress(start);
    onMousePress(start);
});
    

function intro() {
    // play music
    play("ArcadeOddities", {
        volume: 0.05,
        loop: true
    })

    start();
    
}

// start game on first level
function start() {

    go("game", {
        levelIndex: 0,
        score: 0,
        lives: 3,
        blocks: 0
    });
}

go("intro");


