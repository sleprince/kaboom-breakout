import kaboom from "kaboom"

const FLOOR_HEIGHT = 48;
let JUMP_FORCE = 800;
const SPEED = 480;

// initialize context
kaboom();

// load assets
loadSprite("bean", "sprites/bean.png");
loadSprite("tree", "sprites/tree.png");
loadSprite("bg", "sprites/bg.png");

scene("game", () => {

    // define gravity
    setGravity(1600);

    //add background
    add([sprite("bg", { width: width(), height: height() })]);

    // add a game object to screen
    const player = add([
        // list of components
        sprite("bean"),
        pos(80, 40),
        area(),
        body(),
    ]);

    // floor
    add([
        rect(width(), FLOOR_HEIGHT),
        outline(4),
        pos(0, height()),
        anchor("botleft"),
        area(),
        body({ isStatic: true }),
        color(127, 200, 255),
    ]);

    function jump() {
        if (player.isGrounded()) {
            JUMP_FORCE = 1000;
            setGravity(1600);
            player.jump(JUMP_FORCE);
        }
    }

    // jump when user press space
    onKeyPressRepeat("space", jump);
    onKeyRelease("space", () => {
        (setGravity(5600));
    })

    //or left clicks
    onMousePress("left", jump);
    onMouseRelease("left", () => {
        (setGravity(5600));
    })



    function spawnTree() {

        let randomHeight = rand(36, 100)

        // add tree obj
        /*let base = add([
            rect(48, randomHeight),
            area(),
            outline(4),
            pos(width(), height() - FLOOR_HEIGHT),
            anchor("botleft"),
            color(255, 180, 255),
            move(LEFT, SPEED),
            "tree",
        ]);
        */

        add([
            sprite("tree"),
            pos(width() - 20, height() - FLOOR_HEIGHT),
            scale(0.25, randomHeight / 1000),
            area(),
            anchor("botleft"),
            move(LEFT, SPEED),
            "tree",
        ]);

        // wait a random amount of time to spawn next tree
        wait(rand(0.5, 1.5), spawnTree);

    }

    // start spawning trees
    spawnTree();

    // lose if player collides with any game obj with tag "tree"
    player.onCollide("tree", () => {
        // go to "lose" scene and pass the score
        go("lose", score);
        burp();
        addKaboom(player.pos);
    });

    // keep track of score
    let score = 0;

    const scoreLabel = add([
        text(score),
        pos(24, 24),
    ]);

    // increment score every frame
    onUpdate(() => {
        score++;
        scoreLabel.text = score;
    });

});

scene("lose", (score) => {

    //display player character sprite
    add([
        sprite("bean"),
        pos(width() / 2, height() / 2 - 80),
        scale(2),
        anchor("center"),

    ]);

    //display game over text
    add([
        text("GAME OVER"),
        pos(width() / 2, height() / 2 + 15),
        scale(2),
        anchor("center"),
    ]);

    // display score
    add([
        text(score),
        pos(width() / 2, height() / 2 + 80),
        scale(2),
        anchor("center"),
    ]);

    // go back to game with space is pressed
    onKeyPress("space", () => go("game"));
    onClick(() => go("game"));

});

go("game");