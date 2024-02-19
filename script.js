// Variáveis globais
let canvas, context, player, puddings, puddingCount, slimes, timeLeft, lives, gameOver;

// Função principal para iniciar o jogo
function startGame() {
  // Esconder o botão de início do jogo
  const startButton = document.getElementById("startButton");
  startButton.style.display = "none";

  // Configurar o canvas e iniciar o jogo
  canvas = document.getElementById("gameCanvas");
  context = canvas.getContext("2d");

  // Definir o tamanho do canvas
  canvas.width = 800;
  canvas.height = 600;

  // Inicializar as variáveis do jogo
  player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 50,
    height: 50,
    speed: 5,
    left: false,
    right: false,
    up: false,
    down: false,
  };

  puddings = [
    { x: 100, y: 100, width: 30, height: 30, collected: false },
    { x: 200, y: 200, width: 30, height: 30, collected: false },
    { x: 300, y: 300, width: 30, height: 30, collected: false },
  ];

  puddingCount = puddings.length;

  slimes = [
    { x: 400, y: 400, width: 50, height: 50, dx: getRandomDirection(), dy: getRandomDirection() },
    { x: 500, y: 500, width: 50, height: 50, dx: getRandomDirection(), dy: getRandomDirection() },
  ];

  timeLeft = 60;

  lives = 3;

  gameOver = false
  // Configurar eventos de teclado
  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);

  // Iniciar o loop do jogo
  setInterval(gameLoop, 16);

  // Função para lidar com o pressionamento de teclas
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

  // Função para lidar com a soltura de teclas
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

  // Função principal do loop do jogo
  function gameLoop() {
    // Limpar o canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
      // Atualizar a posição do jogador
      updatePlayerPosition();

      // Verificar colisões
      checkCollisions();

      // Atualizar o tempo restante
      timeLeft -= 1 / 60; // Decremento ajustado para 1/60 por segundo

      // Verificar se o tempo acabou
      if (timeLeft <= 0) {
        endGame();
      }
    }

    // Desenhar o jogador
    drawPlayer();

    // Desenhar os pudins
    drawPuddings();

    // Desenhar os slimes
    drawSlimes();

    // Atualizar o HUD
    updateHUD();
  }

  // Função para atualizar a posição do jogador
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

  // Função para verificar colisões
  function checkCollisions() {
    // Verificar colisões com os pudins
    for (let i = 0; i < puddings.length; i++) {
      const pudding = puddings[i];

      if (!pudding.collected && detectCollision(player, pudding)) {
        pudding.collected = true;
        puddingCount--;

        if (puddingCount === 0) {
          endGame();
        }
      }
    }

    // Verificar colisões com os slimes
    for (let i = 0; i < slimes.length; i++) {
      const slime = slimes[i];

      if (detectCollision(player, slime)) {
          // Reduzir uma vida e reiniciar a posição do jogador
          lives--;
          resetPlayerPosition();
  
          if (lives === 0) {
            endGame();
          }
        }
      }
    }
  
    // Função para verificar a colisão entre dois objetos retangulares
    function detectCollision(rect1, rect2) {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
      );
    }
  
    // Função para reiniciar a posição do jogador
    function resetPlayerPosition() {
      player.x = canvas.width / 2;
      player.y = canvas.height / 2;
    }
  
    // Função para encerrar o jogo
    // Função para encerrar o jogo
  function endGame(win) {
    gameOver = true;
  
    // Exibir mensagem de vitória ou derrota
    const message = win ? "Good Game" : "Game Over";
    context.fillStyle = "#000";
    context.font = "40px Arial";
    context.fillText(message, canvas.width / 2 - 100, canvas.height / 2);
  
    // Exibir botão de recomeçar
    const restartButton = document.createElement("button");
    restartButton.textContent = "Recomeçar";
    restartButton.addEventListener("click", restartGame);
    document.body.appendChild(restartButton);
  }
  
    // Função para recomeçar o jogo
    function restartGame() {
      // Remover botão de recomeçar
      const restartButton = document.querySelector("button");
      restartButton.remove();
  
      // Restaurar as configurações iniciais do jogo
      player = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        width: 50,
        height: 50,
        speed: 5,
        left: false,
        right: false,
        up: false,
        down: false,
      };
  
      for (let i = 0; i < puddings.length; i++) {
        puddings[i].collected = false;
      }
  
      puddingCount = puddings.length;
  
      timeLeft = 60;
  
      lives = 3;
  
      gameOver = false;
    }
  
    // Função para desenhar o jogador
    function drawPlayer() {
      context.fillStyle = "blue";
      context.fillRect(player.x, player.y, player.width, player.height);
    }
  
    // Função para desenhar os pudins
    function drawPuddings() {
      context.fillStyle = "yellow";
  
      for (let i = 0; i < puddings.length; i++) {
        const pudding = puddings[i];
  
        if (!pudding.collected) {
          context.fillRect(pudding.x, pudding.y, pudding.width, pudding.height);
        }
      }
    }
  
    // Função para desenhar os slimes
    function drawSlimes() {
      context.fillStyle = "green";
  
      for (let i = 0; i < slimes.length; i++) {
        const slime = slimes[i];
        context.fillRect(slime.x, slime.y, slime.width, slime.height);
  
        // Atualizar a posição dos slimes
        slime.x += slime.dx;
        slime.y += slime.dy;
  
        // Verificar se o slime atingiu as bordas do canvas e inverter a direção
        if (slime.x <= 0 || slime.x + slime.width >= canvas.width) {
          slime.dx *= -1;
        }
  
        if (slime.y <= 0 || slime.y + slime.height >= canvas.height)  slime.dy *= -1;
      }
    }
  }

  // Função para atualizar o HUD
  function updateHUD() {
    // Atualizar o tempo restante
    const timeLeftElement = document.getElementById("timeLeft");
    timeLeftElement.textContent = Math.ceil(timeLeft);

    // Atualizar a contagem de pudins coletados
    const collectedPuddingsElement = document.getElementById("collectedPuddings");
    collectedPuddingsElement.textContent = puddings.length - puddingCount;

    // Atualizar a contagem de vidas restantes
    const remainingLivesElement = document.getElementById("remainingLives");
    remainingLivesElement.textContent = lives;
  }

  // Função para obter uma direção aleatória (-1 ou 1)
  function getRandomDirection() {
    return Math.random() < 0.5 ? -1 : 1;
  }

  // Adicionar evento de clique para iniciar o jogo
  const startButton = document.getElementById("startButton");
  startButton.addEventListener("click", startGame);

  function update() {
    if (!gameOver) {
      updatePlayer();
      updatePuddings();
      updateSlimes();
      updateHUD();
  
      // Verificar se o jogador pegou 20 pudins
      if (puddings.length - puddingCount >= 20) {
        endGame(true);
      }
  
      // Verificar se o tempo acabou
      if (timeLeft <= 0) {
        endGame(false);
      }
  
      // Chamar a função update novamente após um pequeno intervalo
      setTimeout(update, 10);
    }
  }
// Função para gerar os pudins no mapa
function generatePuddings() {
  for (let i = 0; i < 20; i++) {
    const pudding = {
      x: getRandomNumber(canvas.width - 50),
      y: getRandomNumber(canvas.height - 50),
      width: 50,
      height: 50,
      collected: false,
    };
    puddings.push(pudding);
  }
}

