const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');

const basketWidth = 100;
const basketHeight = 20;
const fruitWidth = 40;
const fruitHeight = 40;

let basketX = canvas.width / 2 - basketWidth / 2;
let fruits = [];
let score = 0;
let level = 1;
let fallSpeed = 2;
let interval = 1000; // Interval untuk menambahkan buah (ms)
let nextFruitTime = Date.now() + interval;

function resetGame() {
    score = 0;
    level = 1;
    fallSpeed = 2;
    interval = 1000;
    nextFruitTime = Date.now() + interval;
    fruits = [];
}

function drawBasket() {
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(basketX, canvas.height - basketHeight, basketWidth, basketHeight);
}

function drawFruit(fruit) {
    ctx.fillStyle = fruit.color;
    ctx.beginPath();
    ctx.arc(fruit.x, fruit.y, fruitWidth / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.stroke();
}

function updateFruits() {
    const now = Date.now();
    if (now >= nextFruitTime) {
        const x = Math.random() * (canvas.width - fruitWidth);
        const color = ['#ff0000', '#ffa500', '#ffff00', '#008000'][Math.floor(Math.random() * 4)];
        fruits.push({ x: x + fruitWidth / 2, y: 0, color: color });
        nextFruitTime = now + interval;
    }

    let missedFruit = false;

    fruits.forEach(fruit => {
        fruit.y += fallSpeed;
        if (fruit.y > canvas.height) {
            missedFruit = true;
            fruits.splice(fruits.indexOf(fruit), 1);
        }

        // Cek tabrakan dengan keranjang
        if (fruit.y + fruitHeight / 2 > canvas.height - basketHeight &&
            fruit.x > basketX &&
            fruit.x < basketX + basketWidth) {
            score += 10; // Tambah skor untuk setiap buah yang tertangkap
            fruits.splice(fruits.indexOf(fruit), 1);
        }
    });

    if (missedFruit) {
        resetGame();
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBasket();
    fruits.forEach(drawFruit);

    // Update dan tampilkan skor dan level
    scoreElement.textContent = `Score: ${score}`;
    levelElement.textContent = `Level: ${level}`;
}

function gameLoop() {
    updateFruits();
    drawGame();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    basketX = e.clientX - rect.left - basketWidth / 2;
    basketX = Math.max(0, Math.min(basketX, canvas.width - basketWidth));
});

// Level up setiap 100 poin
setInterval(() => {
    if (score > 0 && score % 100 === 0) {
        level++;
        fallSpeed += 1;
        interval = Math.max(500, interval - 50); // Meningkatkan kecepatan jatuh buah
    }
}, 1000);

gameLoop();
