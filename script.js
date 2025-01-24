// Get HTML elements
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const enemiesContainer = document.getElementById('enemies');
const scoreDisplay = document.getElementById('score-display');
const gameOverScreen = document.getElementById('game-over');
const restartButton = document.getElementById('restart-button');

// Game state
let playerX = window.innerWidth / 2 - 25;
let score = 0;
let timer = 45; // Timer starts at 45 seconds
let enemies = [];
let bullets = [];
let enemySpeed = 2;
let enemyDirection = 1;
let gameInterval;
let timerInterval;

// Initialize player position
player.style.left = `${playerX}px`;

// Event listener for player controls
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && playerX > 0) {
    playerX -= 15;
  } else if (e.key === 'ArrowRight' && playerX < window.innerWidth - 50) {
    playerX += 15;
  } else if (e.key === ' ') {
    shoot();
  }
  player.style.left = `${playerX}px`;
});

// Player shooting function
function shoot() {
  const bullet = document.createElement('div');
  bullet.classList.add('bullet');
  bullet.style.left = `${playerX + 22.5}px`;
  bullet.style.bottom = '70px';
  gameContainer.appendChild(bullet);
  bullets.push(bullet);
}

// Move player bullets
function moveBullets() {
  bullets.forEach((bullet, index) => {
    const bottom = parseInt(bullet.style.bottom);
    if (bottom > window.innerHeight) {
      bullet.remove();
      bullets.splice(index, 1);
    } else {
      bullet.style.bottom = `${bottom + 12}px`;
    }
  });
}

// Create enemies in a pyramid shape
function createEnemies() {
  enemiesContainer.innerHTML = '';
  enemies = [];
  const rows = 5;
  const baseWidth = 9;

  for (let row = 0; row < rows; row++) {
    const numEnemies = baseWidth - row;
    const startX = (window.innerWidth - numEnemies * 60) / 2;

    for (let col = 0; col < numEnemies; col++) {
      const enemy = document.createElement('div');
      enemy.classList.add('enemy');
      enemy.style.left = `${startX + col * 60}px`;
      enemy.style.top = `${row * 50 + 30}px`;
      enemiesContainer.appendChild(enemy);
      enemies.push(enemy);
    }
  }
}

// Move enemies
function moveEnemies() {
  const leftmost = Math.min(...enemies.map(enemy => parseInt(enemy.style.left)));
  const rightmost = Math.max(...enemies.map(enemy => parseInt(enemy.style.left) + 40));

  if (leftmost <= 0 || rightmost >= window.innerWidth) {
    enemyDirection *= -1;
    enemies.forEach(enemy => {
      enemy.style.top = `${parseInt(enemy.style.top) + 30}px`;
    });
  }

  enemies.forEach(enemy => {
    enemy.style.left = `${parseInt(enemy.style.left) + enemySpeed * enemyDirection}px`;
  });
}

// Check collisions
function checkCollisions() {
  bullets.forEach((bullet, bulletIndex) => {
    const bulletRect = bullet.getBoundingClientRect();

    enemies.forEach((enemy, enemyIndex) => {
      const enemyRect = enemy.getBoundingClientRect();
      if (
        bulletRect.left < enemyRect.right &&
        bulletRect.right > enemyRect.left &&
        bulletRect.top < enemyRect.bottom &&
        bulletRect.bottom > enemyRect.top
      ) {
        bullet.remove();
        enemy.remove();
        bullets.splice(bulletIndex, 1);
        enemies.splice(enemyIndex, 1);
        score += 10;
        scoreDisplay.textContent = `Score: ${score} | Timer: ${timer}s`;
      }
    });
  });
}

// Check level completion
function checkLevelCompletion() {
  if (enemies.length === 0) {
    timer += 2; // Increase timer by 2 seconds after clearing the level
    createEnemies();
  }
}

// Update timer
function updateTimer() {
  if (timer <= 0) {
    endGame();
  } else {
    timer--;
    scoreDisplay.textContent = `Score: ${score} | Timer: ${timer}s`;
  }
}

// Main game loop
function gameLoop() {
  moveBullets();
  moveEnemies();
  checkCollisions();
  checkLevelCompletion();
}

// Start game
startButton.addEventListener('click', () => {
  startScreen.style.display = 'none';
  gameContainer.style.display = 'block';
  gameInterval = setInterval(gameLoop, 1000 / 60); // Game loop
  timerInterval = setInterval(updateTimer, 1000);  // Timer
  createEnemies();
});

// End game and show final score in alert
function endGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  gameContainer.style.display = 'none';
  gameOverScreen.style.display = 'flex';

  // Show final score in alert
  alert(`Game Over! Your final score is: ${score}`);
}

// Restart game
restartButton.addEventListener('click', () => {
  gameOverScreen.style.display = 'none';
  startScreen.style.display = 'flex';
  score = 0;
  timer = 45;
  scoreDisplay.textContent = `Score: ${score} | Timer: ${timer}s`;
});
