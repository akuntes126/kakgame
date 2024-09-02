let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

// Dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
}

// Cactus
let cactusArray = [];
let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;
let cactusHeight = 70;
let cactusX = boardWidth;
let cactusY = boardHeight - cactusHeight;
let cactus1Img, cactus2Img, cactus3Img;

// Physics
let velocityX = -8;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");

    // Load images
    dinoImg = new Image();
    dinoImg.src = "./img/dino.png";

    cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000);

    document.addEventListener("keydown", moveDino);
}

function update() {
    if (gameOver) {
        return;
    }
    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    // Dino physics
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); // Dino lands on the ground
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    // Move and draw cacti
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dinoImg.src = "./img/dino-dead.png";
            context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
        }
    }

    // Score
    context.fillStyle = "black";
    context.font = "20px Courier";
    score++;
    context.fillText(`Score: ${score}`, 5, 20);
}

function moveDino(e) {
    if (gameOver) {
        if (e.code == "Space" || e.code == "ArrowUp") {
            resetGame();
        }
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        velocityY = -10;
    }
}

function placeCactus() {
    if (gameOver) {
        return;
    }

    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random();

    if (placeCactusChance > 0.90) {
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
    } else if (placeCactusChance > 0.70) {
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
    } else {
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
    }
    cactusArray.push(cactus);

    if (cactusArray.length > 5) {
        cactusArray.shift();
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function resetGame() {
    dinoImg.src = "./img/dino.png";
    cactusArray = [];
    score = 0;
    gameOver = false;
    velocityY = 0;
    update();
}
