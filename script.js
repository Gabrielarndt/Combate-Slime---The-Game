let canvas, context, player, puddings, puddingCount, slimes, timeLeft, lives, gameOver;

function startGame() {
  const startButton = document.getElementById("startButton");
  startButton.style.display = "none";

  canvas = document.getElementById("gameCanvas");
  context = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 600;

  initializeGame();

  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);

  setInterval(gameLoop, 16);
}

function initializeGame() {
  player = createPlayer();
  puddings = [];
  createPudding();
  puddingCount = 1;
  slimes = [];
  createSlimes(2); // Inicialmente, dois slimes
  timeLeft = 60;
  lives = 3;
  gameOver = false;
}

function createPlayer() {
  const margin = 10; // Margem para evitar que os slimes nasçam muito próximos das bordas
 
  return {
    x: getRandomNumber(canvas.width - margin * 2) + margin, // Limitar a posição x dentro das margens
    y: getRandomNumber(canvas.height - margin * 2) + margin, // Limitar a posição y dentro das margens
   
    width: 60,
    height: 90,
    speed: 5,
    left: false,
    right: false,
    up: false,
    down: false
  };
}

function createPudding() {
  const margin = 10; // Margem para evitar que os slimes nasçam muito próximos das bordas
 
  const pudding = {
    x: getRandomNumber(canvas.width - margin * 2) + margin, // Limitar a posição x dentro das margens
    y: getRandomNumber(canvas.height - margin * 2) + margin, // Limitar a posição y dentro das margens
    
    width: 50,
    height: 50,
    collected: false
  };
  puddings.push(pudding);
}

function createSlimes(numSlimes) {
  const margin = 50; // Margem para evitar que os slimes nasçam muito próximos das bordas
  for (let i = 0; i < numSlimes; i++) {
    const slime = {
      x: getRandomNumber(canvas.width - margin * 2) + margin, // Limitar a posição x dentro das margens
      y: getRandomNumber(canvas.height - margin * 2) + margin, // Limitar a posição y dentro das margens
      width: 50,
      height: 50,
      dx: 8, // Velocidade ajustada para 4
      dy: 8 // Velocidade ajustada para 4
    };
    slimes.push(slime);
  }
}

function keyDownHandler(event) {
  if (event.key === "ArrowLeft" || event.key === "Left") {
    player.left = true;
  } else if (event.key === "ArrowRight" || event.key === "Right") {
    player.right = true;
  } else if (event.key === "ArrowUp" || event.key === "Up") {
    player.up = true;
  } else if (event.key === "ArrowDown" || event.key === "Down") {
    player.down = true;
  }
}

function keyUpHandler(event) {
  if (event.key === "ArrowLeft" || event.key === "Left") {
    player.left = false;
  } else if (event.key === "ArrowRight" || event.key === "Right") {
    player.right = false;
  } else if (event.key === "ArrowUp" || event.key === "Up") {
    player.up = false;
  } else if (event.key === "ArrowDown" || event.key === "Down") {
    player.down = false;
  }
}

function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    updatePlayerPosition();
    checkCollisions();
    timeLeft -= 1 / 60;

    if (timeLeft <= 0) {
      endGame(false);
    }
  }

  drawPlayer();
  drawPuddings();
  drawSlimes();
  updateHUD();
}

function updatePlayerPosition() {
  if (player.left && player.x > 0) {
    player.x -= player.speed;
  }
  if (player.right && player.x < canvas.width - player.width) {
    player.x += player.speed;
  }
  if (player.up && player.y > 0) {
    player.y -= player.speed;
  }
  if (player.down && player.y < canvas.height - player.height) {
    player.y += player.speed;
  }
}

function checkCollisions() {
  for (let i = 0; i < puddings.length; i++) {
    const pudding = puddings[i];
    if (!pudding.collected && detectCollision(player, pudding)) {
      pudding.collected = true;
      puddingCount++;
      if (puddingCount === 6) {
        endGame(true);
      } else {
        createPudding();
      }
    }
  }
  for (let i = 0; i < slimes.length; i++) {
    const slime = slimes[i];
    if (detectCollision(player, slime)) {
      lives--;
      resetPlayerPosition();
      if (lives === 0) {
        endGame(false);
      }
    }
  }
}

function detectCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

function resetPlayerPosition() {
  player.x = getRandomNumber(canvas.width);
  player.y = getRandomNumber(canvas.height);
}

function endGame(win) {
  if (!gameOver) {
    gameOver = true;
    const message = win ? "Good Game" : "Game Over";
    context.fillStyle = "#000";
    context.font = "40px Arial";
    context.fillText(message, canvas.width / 2 - 100, canvas.height / 2);

    // Remover o botão de recomeçar existente, se houver
    const existingRestartButton = document.getElementById("restartButton");
    if (existingRestartButton) {
      existingRestartButton.remove();
    }

    // Criar um novo botão de recomeçar
    const restartButton = document.createElement("button");
    restartButton.id = "restartButton";
    restartButton.textContent = "Recomeçar";
    restartButton.addEventListener("click", restartGame);
    document.body.appendChild(restartButton);
  }
}

function restartGame() {
  const restartButton = document.querySelector("button");
  restartButton.remove();
  initializeGame();
}

const playerImage = new Image();
playerImage.src = 'https://www.clashofclans-dicas.com/wp-content/uploads/2021/02/skin-rei-guerreiro-ano-novo-lunar-2021.png'; // URL da imagem do player

const puddingImage = new Image();
puddingImage.src = 'https://static.vecteezy.com/system/resources/thumbnails/010/171/321/small/cartoon-juicy-pudding-file-free-png.png'; // URL da imagem do pudim

// No evento de carregamento das imagens
playerImage.onload = function() {
  // Aqui você pode começar a desenhar o player
  drawPlayer();
};

puddingImage.onload = function() {
  // Aqui você pode começar a desenhar os pudins
  drawPuddings();
};

// Dentro da função drawPlayer()
function drawPlayer() {
  context.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

// Dentro da função drawPuddings()
function drawPuddings() {
  for (let i = 0; i < puddings.length; i++) {
    const pudding = puddings[i];
    if (!pudding.collected) {
      context.drawImage(puddingImage, pudding.x, pudding.y, pudding.width, pudding.height);
    }
  }
}

const slimeImage = new Image();
slimeImage.src = 'https://staticg.sportskeeda.com/editor/2022/03/c507c-16480120578484-1920.jpg'; // Substitua pelo caminho da sua imagem

function drawSlimes() {
  for (let i = 0; i < slimes.length; i++) {
    const slime = slimes[i];

    // Desenhe a imagem do slime
    context.drawImage(slimeImage, slime.x, slime.y, slime.width, slime.height);
    slime.x += slime.dx;
    slime.y += slime.dy;

    if (slime.x <= 0 || slime.x + slime.width >= canvas.width) {
      slime.dx *= -1;
    }
    if (slime.y <= 0 || slime.y + slime.height >= canvas.height) {
      slime.dy *= -1;
    }
  }
}

function updateHUD() {
  const timeLeftElement = document.getElementById("timeLeft");
  timeLeftElement.textContent = Math.ceil(timeLeft);

  const collectedPuddingsElement = document.getElementById("collectedPuddings");
  collectedPuddingsElement.textContent = puddingCount;

  const remainingLivesElement = document.getElementById("remainingLives");
  remainingLivesElement.textContent = lives;
}

function getRandomNumber(max) {
  return Math.floor(Math.random() * max);
}

function getRandomSpeed() {
  return Math.random() < 0.5 ? -1 : 1;
}

const startButton = document.getElementById("startButton");
startButton.addEventListener("click", startGame);
