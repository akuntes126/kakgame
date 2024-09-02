const clickButton = document.getElementById('click-button');
const scoreElement = document.getElementById('score');
const autoClickerButton = document.getElementById('buy-auto-clicker');
const clickUpgradeButton = document.getElementById('buy-click-upgrade');
const autoClickerCostElement = document.getElementById('auto-clicker-cost');
const clickUpgradeCostElement = document.getElementById('click-upgrade-cost');

let score = 0;
let clickValue = 1;
let autoClickerCost = 50;
let clickUpgradeCost = 100;
let autoClickerRate = 0;

// Update score display
function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}

// Handle click button
clickButton.addEventListener('click', () => {
    score += clickValue;
    updateScore();
    // Add click animation
    clickButton.classList.add('clicked');
    setTimeout(() => {
        clickButton.classList.remove('clicked');
    }, 200);
});

// Handle auto clicker purchase
autoClickerButton.addEventListener('click', () => {
    if (score >= autoClickerCost) {
        score -= autoClickerCost;
        autoClickerRate++;
        autoClickerCost = Math.floor(autoClickerCost * 1.5); // Increase cost for next upgrade
        autoClickerCostElement.textContent = autoClickerCost;
        updateScore();
    }
});

// Handle click upgrade purchase
clickUpgradeButton.addEventListener('click', () => {
    if (score >= clickUpgradeCost) {
        score -= clickUpgradeCost;
        clickValue++;
        clickUpgradeCost = Math.floor(clickUpgradeCost * 1.5); // Increase cost for next upgrade
        clickUpgradeCostElement.textContent = clickUpgradeCost;
        updateScore();
    }
});

// Auto clicker functionality
setInterval(() => {
    if (autoClickerRate > 0) {
        score += autoClickerRate;
        updateScore();
    }
}, 1000);
