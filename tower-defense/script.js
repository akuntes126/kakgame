const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const towers = [];
const enemies = [];
let lastTime = 0;
let score = 0;
let level = 1;
const maxTowers = 15;  // Batas maksimum menara

function drawTower(x, y) {
    ctx.fillStyle = '#00f';
    ctx.fillRect(x, y, 40, 40);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(x, y, 40, 40);
}

function drawEnemy(x, y) {
    ctx.fillStyle = '#f00';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.stroke();
}

function resetGameState() {
    towers.length = 0;
    enemies.length = 0;
    level++;
    scoreElement.textContent = `Score: ${score} (Level ${level})`;
}

function resetScore() {
    score = 0;
    level = 1;
    enemies.length = 0;
    towers.length = 0;
    scoreElement.textContent = `Score: ${score} (Level ${level})`;
}

function updateGame(time) {
    const deltaTime = time - lastTime;
    lastTime = time;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw towers
    towers.forEach(tower => {
        drawTower(tower.x, tower.y);
    });

    // Update and draw enemies
    enemies.forEach(enemy => {
        enemy.x += (enemy.speed + level * 50) * deltaTime / 500;  // Tingkatkan kecepatan musuh dengan level
        drawEnemy(enemy.x, enemy.y);

        // Check if enemy has passed the right edge of the canvas
        if (enemy.x > canvas.width) {
            resetScore(); // Reset skor jika musuh melewati kanvas
        }

        // Simple collision detection with tower
        towers.forEach(tower => {
            if (enemy.x > tower.x && enemy.x < tower.x + 40 &&
                enemy.y > tower.y && enemy.y < tower.y + 40) {
                // Collision detected, remove enemy and increase score
                enemies.splice(enemies.indexOf(enemy), 1);
                score += 10;
                scoreElement.textContent = `Score: ${score} (Level ${level})`;

                // Check if score is a multiple of 200 and reset for the next level
                if (score % 200 === 0) {
                    resetGameState();
                }
            }
        });
    });

    // Request next frame
    requestAnimationFrame(updateGame);
}

// Add a tower on click, but limit to maxTowers
canvas.addEventListener('click', (e) => {
    if (towers.length < maxTowers) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Add tower at clicked position
        towers.push({ x: x - 20, y: y - 20 });
    }
});

// Spawn enemies periodically
setInterval(() => {
    const x = 0;
    const y = Math.random() * canvas.height;
    enemies.push({ x, y, speed: 80 });  // Musuh lebih cepat dengan level
}, 1000);  // Musuh muncul lebih cepat

// Start game loop
requestAnimationFrame(updateGame);
