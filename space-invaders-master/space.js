// Define variables for the game state and entities
let tileSize = 32;
let rows = 16;
let columns = 16;
let board, context;
let boardWidth = tileSize * columns;
let boardHeight = tileSize * rows;

// Ship
let shipWidth = tileSize * 2;
let shipHeight = tileSize;
let shipX = tileSize * columns / 2 - tileSize;
let shipY = tileSize * rows - tileSize * 2;
let shipVelocityX = tileSize;
let shipImg;
let ship = { x: shipX, y: shipY, width: shipWidth, height: shipHeight };

// Aliens
let alienArray = [];
let alienWidth = tileSize * 2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;
let alienRows = 2;
let alienColumns = 3;
let alienCount = 0;
let alienVelocityX = 1;

// Bullets
let bulletArray = [];
let bulletVelocityY = -10;

// Game state
let score = 0;
let gameOver = false;

// Initialize the game when the window loads
window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    // Load images and start the game
    shipImg = new Image();
    shipImg.src = "./ship.png";
    shipImg.onload = function() {
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    }

    alienImg = new Image();
    alienImg.src = "./alien.png";
    createAliens();

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);
}

// Update the game loop
function update() {
    requestAnimationFrame(update);

    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // Draw the ship
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    // Update and draw aliens
    for (let i = 0; i < alienArray.length; i++) {
        let alien = alienArray[i];
        if (alien.alive) {
            alien.x += alienVelocityX;

            // Handle alien movement and direction change
            if (alien.x + alien.width >= board.width || alien.x <= 0) {
                alienVelocityX *= -1;
                alien.x += alienVelocityX * 2;

                // Move all aliens down by one row
                for (let j = 0; j < alienArray.length; j++) {
                    alienArray[j].y += alienHeight;
                }
            }

            // Draw the alien
            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);

            // Check for game over
            if (alien.y >= ship.y) {
                gameOver = true;
            }
        }
    }

    // Update and draw bullets
    for (let i = 0; i < bulletArray.length; i++) {
        let bullet = bulletArray[i];
        bullet.y += bulletVelocityY;
        context.fillStyle = "white";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Check for bullet collision with aliens
        for (let j = 0; j < alienArray.length; j++) {
            let alien = alienArray[j];
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
                bullet.used = true;
                alien.alive = false;
                alienCount--;
                score += 100;
            }
        }
    }

    // Remove used or out-of-bounds bullets
    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
        bulletArray.shift();
    }

    // Check for next level
    if (alienCount === 0) {
        nextLevel();
    }

    // Display score
    context.fillStyle = "white";
    context.font = "16px courier";
    context.fillText(score, 5, 20);
}

// Move the ship based on keyboard input
function moveShip(e) {
    if (gameOver) return;

    if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
        ship.x -= shipVelocityX;
    } else if (e.code == "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width) {
        ship.x += shipVelocityX;
    }
}

// Create the aliens at the start of the game or the next level
function createAliens() {
    alienArray = [];
    for (let c = 0; c < alienColumns; c++) {
        for (let r = 0; r < alienRows; r++) {
            let alien = {
                img: alienImg,
                x: alienX + c * alienWidth,
                y: alienY + r * alienHeight,
                width: alienWidth,
                height: alienHeight,
                alive: true
            };
            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}

// Shoot bullets with the space bar
function shoot(e) {
    if (gameOver) return;

    if (e.code == "Space") {
        let bullet = {
            x: ship.x + shipWidth * 15 / 32,
            y: ship.y,
            width: tileSize / 8,
            height: tileSize / 2,
            used: false
        };
        bulletArray.push(bullet);
    }
}

// Detect collision between bullets and aliens
function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

// Proceed to the next level after defeating all aliens
function nextLevel() {
    score += alienColumns * alienRows * 100; // Bonus points
    alienColumns = Math.min(alienColumns + 1, columns / 2 - 2);
    alienRows = Math.min(alienRows + 1, rows - 4);

    alienVelocityX = alienVelocityX > 0 ? alienVelocityX + 0.2 : alienVelocityX - 0.2;
    createAliens();
    bulletArray = [];
}

// Restart the game by resetting all variables and restarting the game loop
function restartGame() {
    ship.x = shipX;
    ship.y = shipY;
    alienRows = 2;
    alienColumns = 3;
    alienVelocityX = 1;
    score = 0;
    gameOver = false;
    bulletArray = [];
    createAliens();
}
