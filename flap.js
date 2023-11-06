// Get the canvas and its context
const canvas = document.getElementById("flappyBirdCanvas");
const ctx = canvas.getContext("2d");

// Add a countdown timer
let countdown = 3; // Set the initial countdown value

function updateCountdown() {
    if (countdown > 0) {
        clearCanvas();
        ctx.fillStyle = "#000";
        ctx.font = "50px Arial";
        ctx.fillText(countdown, canvas.width / 2 - 10, canvas.height / 2 + 10);
        countdown--;

        // Request the next frame to continue the countdown
        requestAnimationFrame(updateCountdown);
    } else {
        startGame(); // Start the game when the countdown reaches 0
    }
}

// Bird properties
const bird = {
    x: 50,
    y: canvas.height / 2 - 15,
    width: 30,
    height: 30,
    speedY: -2, // Set initial speed to -2 to keep the bird in the air
    gravity: 0.5,
    jumpStrength: 8,
};

// Obstacle properties
const obstacles = [];
const obstacleWidth = 60;
const obstacleGap = 250;
const obstacleSpeed = 2;
const minObstacleHeight = 50;
const maxObstacleHeight = canvas.height - obstacleGap - minObstacleHeight;

// Score
let score = 0;

// Game over flag
let isGameOver = false;

// Game control flags
let isGameRunning = false;

// Buttons
const startButton = document.getElementById("startButton");
const endButton = document.getElementById("endButton");

// Add event listeners to buttons
startButton.addEventListener("click", startGame);
endButton.addEventListener("click", endGame);

// Handle player input (click or touch for mobile)
canvas.addEventListener("click", jump);
canvas.addEventListener("touchstart", jump);

function jump(event) {
    if (isGameRunning && !isGameOver) {
        bird.speedY = -bird.jumpStrength;
    }
}

function startGame() {
    if (!isGameRunning) {
        isGameRunning = true;
        resetGame();
        gameLoop();
    }
}

function endGame() {
    if (isGameRunning) {
        isGameRunning = false;
        gameOver();
    }
}

// Main game loop
function gameLoop() {
    if (!isGameOver) {
        clearCanvas();
        updateBird();
        updateObstacles();
        drawBird();
        drawObstacles();
        drawScore();
        checkCollision();
        requestAnimationFrame(gameLoop);
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateBird() {
    bird.speedY += bird.gravity;
    bird.y += bird.speedY;

    if (bird.y + bird.height > canvas.height) {
        bird.y = canvas.height - bird.height;
        gameOver();
    }
}

function updateObstacles() {
    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x <= canvas.width - 200) {
        const obstacleHeight = Math.floor(Math.random() * (maxObstacleHeight - minObstacleHeight + 1) + minObstacleHeight);
        obstacles.push({
            x: canvas.width,
            height: obstacleHeight,
        });
    }

    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= obstacleSpeed;

        if (obstacles[i].x + obstacleWidth < 0) {
            obstacles.shift();
            score++;
        }
    }
}

function drawBird() {
    ctx.fillStyle = ""; // Bird color
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawObstacles() {
    ctx.fillStyle = " #355986"; // Obstacle color
    obstacles.forEach((obstacle) => {
        ctx.fillRect(obstacle.x, 0, obstacleWidth, obstacle.height);
        ctx.fillRect(obstacle.x, obstacle.height + obstacleGap, obstacleWidth, canvas.height - obstacle.height - obstacleGap);
    });
}

function drawScore() {
    ctx.fillStyle = "#408CA9"; // Score color
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
    ctx.font = "15px Arial";
    ctx.fillText("Then, continue playing by starting button", 10, 570);
    ctx.fillText("Press end to end the game", 10, 590);
}

function checkCollision() {
    for (let i = 0; i < obstacles.length; i++) {
        if (
            bird.x + bird.width > obstacles[i].x &&
            bird.x < obstacles[i].x + obstacleWidth &&
            (bird.y < obstacles[i].height || bird.y + bird.height > obstacles[i].height + obstacleGap)
        ) {
            gameOver();
            break;
        }
    }
}

function gameOver() {
    isGameOver = true;
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
}

function resetGame() {
    bird.y = canvas.height / 2 - 15;
    bird.speedY = 0; // Reset the bird's speed
    obstacles.length = 0;
    score = 0;
    isGameOver = false;
}

// Start the countdown when the page loads
updateCountdown();
