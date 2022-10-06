const sWidth = 800;
const sHeight = 600;
var dataKeyPressed = {};


/* represents caracteristics of the game */
var game = {};
game.canvas = document.getElementById("screenplay");
game.ctx = game.canvas.getContext("2d");

/* events */
/* keyboard events */
game.keydown = function(e) {
    console.log("keydown");
    if (e.which == 32) {
        game.player.shoot();
    }
    else if (e.which == 37) {
        game.player.moveLeft();
    }
    else if (e.which == 39) {
        game.player.moveRight();
    }
    else if (e.which == 32) {
        game.player.shoot();
    }
}
// Detect keydown events
window.onkeydown = game.keydown;

$(window).keyup(function(e) { dataKeyPressed[e.which] = false; });  // removing key from array when released




/* definitions of the assets */
const imgPlayer = new Image();
imgPlayer.src = "assets/player.png";
var imgBackground = new Image();
imgBackground.src = "assets/background.jpg";


/* graphic features of the game */
game.canvas.width = sWidth;
game.canvas.height = sHeight;



/* drawing functions */
function drawBackground() {
    game.ctx.drawImage(imgBackground, 0, 0, game.canvas.width, game.canvas.height);
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
        return this.x + dx < 0 || this.x + dx + this.width > game.canvas.width
    }
    
    moveLeft() {
        /* check if the object will be off screen */
        if (this.offScreen(-5, 0)) {
            return;
        }
        /* move the object */
        this.x -= 5;
    }

    moveRight() {
        /* check if the object will be off screen */
        if (this.offScreen(5, 0)) {
            return;
        }
        /* move the object */
        this.x += 5;
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

    drawLasers() {
        /* draw the lasers */
        for (let laser of this.lasers) {
            laser.draw();
            laser.move(0, -this.speed);
        }
    }
}

class Player extends Shooter {
    constructor() {
        super(200, 500, 30, 50, imgPlayer, 5);
    }

    draw() {
        /* draw the player */
        game.ctx.drawImage(imgPlayer, this.x, this.y , this.width, this.height);
    }
}

/* Laser class */
class Laser extends PhysicalObject {
    constructor(x, y, width, height, color, speed) {
        super(x, y, width, height, color);
        this.speed = speed;
    }

    draw() {
        /* draw the laser */
        game.ctx.fillStyle = this.image;
        game.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(dx, dy) {
        /* move the laser */
        this.x += dx;
        this.y += dy;
    }

}


/* Main loop of the game */
function updateGame() {
    /* do all the drawings */
    drawBackground();
    game.player.draw(game.ctx);
    game.player.drawLasers();
    // updateEnemies();
    // updateBullets();
    // updateScore();
    // updateLives();
}




/* start the game */
game.init = function(){
    game.player = new Player();
    console.log(game.player);
    game.interval = setInterval(updateGame, 20);
}

/* stop the game */
game.stop = function() {
    clearInterval(game.interval);
}


/* main */ 
game.init();