const canvas = document.getElementById('jeu');
const ctx = canvas.getContext('2d');

// Dimensions du canvas
const canvas_width = canvas.width;
const canvas_height = canvas.height;

// Joueur
const joueur = {
    x: width / 2 - 50,
    y: height - 20,
    width: 100,
    height: 10,
    color: 'black',
    vitesse: 5
  };


function drawPlayer(x, y) {
  ctx.fillStyle = joueur.color;
  ctx.fillRect(x, y, joueur.width, joueur.height);
}


// Input
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && joueur.y < canvas_height) { // Up
    joueur.y += joueur.vitesse
  }
});

// Game loop
while (true) {
  ctx.clearRect(0, 0, width, height);  // Clear canvas
  drawPlayer(joueur.x, joueur.y);
}
