const canvas = document.getElementById('jeu');
const ctx = canvas.getContext('2d');

// Dimensions du canvas
const canvas_width = canvas.width;
const canvas_height = canvas.height;

let intervalId; // Variable globale pour stocker l'ID de setInterval

const gravity = 3;

let instructionCourante;

let images = [];

// Instances
let player;
let answers = [];
let pipes = [];

// Classe de base pour les objets du jeu
class GameObject {
  constructor({ x = 0, y = 0, width = 50, height = 50, vitesse = 5, spriteId = null } = {}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.vitesse = vitesse;
    this.spriteId = spriteId;
  }

  // Méthode pour dessiner l'objet
  draw() {
    const sprite = sprites.find(s => s.spriteId === this.spriteId);
    if (sprite) {
      const image = images[sprite.spriteId];
      if (image) {
        ctx.drawImage(image, this.x, this.y, this.width, this.height);
      } else {
        console.log("Erreur lors du chargement du sprite id : " + this.spriteId);
      }
    }
  }
}

// Classe Player
class Player extends GameObject {
  constructor({
    score = 0,
    isAlive = true,
    x = canvas_width / 2 - 150,
    y = canvas_height / 2 - 50,
    width = 150,
    height = 150,
    vitesse = 6,
    spriteId = 5,
  } = {}) {
    super({ x, y, width, height, vitesse, spriteId });
    this.isInput = false;
    this.isAlive = true;
    this.score = 0;
  }
  
  update() {
     // MOVEMENT
    
     if (this.isInput) {
      this.y -= this.vitesse;
    } else {
      this.y += gravity;
    }

    // COLLISION

    if (this.y < 0) { // Backroom du haut
      this.y = 0;
    }

    if (this.y > canvas_height - this.height) { // Backroom du bas
      this.y = canvas_height - this.height;
    }

    // Pipes
    for (let pipe of pipes) {
      if (player.x < pipe.x + pipe.width &&
        player.x + player.width > pipe.x &&
        player.y < pipe.y + pipe.height &&
        player.y + player.height > pipe.y) {
          this.isAlive = false;
      }
    } 

    // Answers
    for (let answer of answers) {
      if (player.x < answer.x + answer.width &&
        player.x + player.width > answer.x &&
        player.y < answer.y + answer.height &&
        player.y + player.height > answer.y) {
          if (answer.spriteId == instructionCourante.answerId) {
            this.score += 1;
            console.log("score : " + this.score);
            newInstruction();
          } else {
            this.isAlive = false;
          }
      }
    } 
   
    this.draw();
  }
}

// Classe Pipe
class Pipe extends GameObject {
  constructor({
    x = canvas_width,
    y = 0,
    width = 175,
    height = 150,
    vitesse = 10,
    spriteId = 6,
  } = {}) {
    super({ x, y, width, height, vitesse, spriteId });
  }

  update() {
    this.x -= this.vitesse;
    if (this.x < 0) {
      this.x = canvas_width;
      this.y = getRandomYCanvas();
    }
    this.draw();
  }
}

// Classe Answer
class Answer extends GameObject {
  constructor({
    x = canvas_width,
    y = 0,
    width = 175,
    height = 150,
    vitesse = 10,
    spriteId = null,
  } = {}) {
    super({ x, y, width, height, vitesse, spriteId });
  }

  update() {
    this.x -= this.vitesse;
    if (this.x < 0) {
      this.x = canvas_width;
      this.y = getRandomYCanvas();
    }
    this.draw();
  }
}

  // List of instructions to follow
  const instructions = [
    { instruction: "Prend la canette écraser", answerId: 0,
      instruction: "Prend le filet de pêche", answerId: 1,
      instruction: "Prend l'emballage de canette", answerId: 2,
      instruction: "Prend le sac plastique", answerId: 3,
      instruction: "Prend la flaque de maré noire", answerId: 4
    }
  ];

   // Get a new random instruction from the list
   function getRandomInstruction() {
     const randomIndex = Math.floor(Math.random() * instructions.length);
     return instructions[randomIndex];
   }

  // List of sprite images available to draw
  const sprites = [
    { spriteId: 0, imageSrc: "canetteEcrasee.jpg" },
    { spriteId: 1, imageSrc: "filetDePeche.jpg" },
    { spriteId: 2, imageSrc: "emballageCanette.jfif" },
    { spriteId: 3, imageSrc: "sacPlastique.png" },
    { spriteId: 4, imageSrc: "flaqueMareNoire.jfif" },
    { spriteId: 5, imageSrc: "joueur.jfif" },
    { spriteId: 6, imageSrc: "algue.jfif" }
  ];

// Input handling for the player (keydown)
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') { // up
    player.isInput = true;
  }
});

// Input handling for the player (keyup)
document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowUp') { // up
    player.isInput = false;
  }
});

function preloadImages() {
  return Promise.all(sprites.map(sprite => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = "img/" + sprite.imageSrc;
      img.onload = () => {
        images[sprite.spriteId] = img;
        resolve();
      };
      img.onerror = reject;
    });
  }));
}

function newInstruction() {
  // Obtenir une instruction aléatoire
  instructionCourante = getRandomInstruction();

  // Réinitialiser les réponses pour la nouvelle instruction
  answers.length = 0; // Vide la liste des réponses existantes

  // Ajoute la réponse correcte
  let correctAnswer = new Answer({ spriteId: instructionCourante.answerId });
  answers.push(correctAnswer);
  console.log("correct : " + instructionCourante.answerId);

  // Génère deux mauvaises réponses
  for (let i = 0; i < 2; i++) {
    // Choisir un ID de sprite incorrect aléatoire
    let wrongAnswerId;
    do {
      wrongAnswerId = Math.floor(Math.random() * sprites.length); // ID aléatoire
    } while (wrongAnswerId === instructionCourante.answerId); // Éviter les doublons avec la bonne réponse

    let wrongAnswer = new Answer({ spriteId: wrongAnswerId });
    console.log("wrong : " + wrongAnswerId);
    answers.push(wrongAnswer);
  }
}

function getRandomYCanvas() {
  return Math.floor(Math.random() * (canvas_height - 100));
}

// Updates every frame 
function update() {

  if (!player.isAlive)
  {
    clearInterval(intervalId);

    answers = [];
    pipes = [];
    
    drawGameOverMenu();
    return;
  }

  if (player.isAlive && player.score === 1)
  {
    clearInterval(intervalId);

    answers = [];
    pipes = [];
    
    drawWinMenu();
    return;
  }

  ctx.clearRect(0, 0, canvas_width, canvas_height);  // Clear canvas 

  ctx.fillStyle = "cyan"; // Bleu car on est sous l'ocean
  ctx.fillRect(0, 0, canvas_width, canvas_height);

  answers.forEach(answer => answer.update()); // Update all instances of answers
  pipes.forEach(pipe => pipe.update()); // Update all instances of pipes
  player.update(); // Update player
}

// Runs once at startup
function start() {
  preloadImages().then(() => {
    player = new Player();

    newInstruction();

    // Create new pipes
    for (let i=0; i<2; i++)
    {
      let pipe = new Pipe();
      pipes.push(pipe);
    }      

    // Start main game loop
    intervalId = setInterval(update, 1000 / 60); // 60 FPS
  }).catch(err => {
    console.error("Erreur lors du préchargement des images", err);
  });
}

// Gestion des clics pour redémarrer
canvas.addEventListener("click", (e) => {
  if (!player.isAlive) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Vérifie si le clic est dans la zone du bouton "Restart"
    if (
      mouseX >= canvas_width / 2 - 75 &&
      mouseX <= canvas_width / 2 + 75 &&
      mouseY >= canvas_height / 2 &&
      mouseY <= canvas_height / 2 + 50
    ) {
      start();
    }
  }
});

function drawGameOverMenu() {
  ctx.clearRect(0, 0, canvas_width, canvas_height);  // Clear canvas 

  // Affiche un fond semi-transparent
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas_width, canvas_height);

  // Texte "Game Over"
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas_width / 2, canvas_height / 2 - 50);

  // Bouton "Restart"
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(canvas_width / 2 - 75, canvas_height / 2, 150, 50);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "24px Arial";
  ctx.fillText("Restart", canvas_width / 2, canvas_height / 2 + 35);
}

function drawWinMenu() {
  ctx.clearRect(0, 0, canvas_width, canvas_height);  // Clear canvas 

  // Affiche un fond semi-transparent
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas_width, canvas_height);

  // Texte "You Win"
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  ctx.fillText("You win", canvas_width / 2, canvas_height / 2 - 50);

  // Bouton "Restart"
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(canvas_width / 2 - 75, canvas_height / 2, 150, 50);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "24px Arial";
  ctx.fillText("Restart", canvas_width / 2, canvas_height / 2 + 35);
}

start();