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

function drawPlayer() {
    imgPlayer.onload = function() {
        game.ctx.drawImage(imgPlayer, 0, 0, game.canvas.width, game.canvas.height);
        }
}


/* different objects of the game */
class PhysicalObject {
    constructor(x, y, width, height, image) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image
    }

    draw() {
        /* draw the object */
        game.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    offScreen(dx, dy) {
        //TODO: rajouter width et heighth de l'objet pour plus de précision
        /* check if the object is off screen */
        return this.x + dx < 0 || this.x + dx > game.canvas.width ||
            this.y + dy < 0 || this.y + dy > game.canvas.height;
    }

    move(vx, vy) {
        /* check if the object will be off screen */
        if (this.offScreen(vx, vy)) {
            return;
        }
        /* move the object */
        this.x += vx;
        this.y += vy;
    }

    isColliding(object) {
        /* check if the object is colliding with another object */
        return this.x < object.x + object.width &&
            this.x + this.width > object.x &&
            this.y < object.y + object.height &&
            this.y + this.height > object.y;
    }

}

/* Shooters */
class Shooter extends PhysicalObject {
    constructor(x, y, width, height, image, speed) {
        super(x, y, width, height, image);
        this.speed = speed;
        this.lasers = [];
    }

    shoot() {
        /* shoot a laser */
        const newLaser = new Laser(this.x + this.width / 2, this.y, 10, 30, "red", 5);
        this.lasers.push(newLaser);
    }
}

class Player extends Shooter {
    constructor() {
        super(200, 500, 100, 100, imgPlayer, 5);
    }

    draw() {
        /* draw the player */
        drawPlayer();
    }
}

/* Laser class */
class Laser extends PhysicalObject {
    constructor(x, y, width, height, color, speed) {
        super(x, y, width, height, color);
        this.speed = speed;
    }

}


/* Main loop of the game */
function updateGame() {
    /* do all the drawings */
    drawBackground();
    game.player.draw(game.ctx);
    // updatePlayer();
    // updateEnemies();
    // updateBullets();
    // updateScore();
    // updateLives();
}




/* start the game */
game.init = function(){
    game.player = new Player();
    console.log(game.player);
    game.interval = setInterval(updateGame, 80);
}

/* stop the game */
game.stop = function() {
    clearInterval(game.interval);
}


/* main */ 
game.init();