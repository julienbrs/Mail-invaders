/* definitions of the assets */
const imgPlayer = new Image();
imgPlayer.src = "assets/player.png";
var imgBackground = new Image();
imgBackground.src = "assets/background.jpg";


/* represents caracteristics of the game */
var game = {};

/* graphic features of the game */
game.canvas = document.getElementById("screenplay");
game.ctx = game.canvas.getContext("2d");



/* drawing functions */
function drawBackground() {
    imgBackground.onload = function() {
    game.ctx.drawImage(imgBackground, 0, 0, game.canvas.width, game.canvas.height);
    }
}




/* Main loop of the game */
function updateGame() {
    /* do all the drawings */
    drawBackground();
    // clearCanvas();
    // updatePlayer();
    // updateEnemies();
    // updateBullets();
    // updateScore();
    // updateLives();
}




/* start the game */
function startGame() {
    game.interval = setInterval(updateGame, 20);
}

/* stop the game */
function stopGame() {
    clearInterval(game.interval);
}


/* main */ 
console.log("start the game");
startGame();