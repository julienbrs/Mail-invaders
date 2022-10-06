const sWidth = 800;
const sHeight = 600;
var dataKeyPressed = {};
// todo: gérer deux touches appuyées en même temps


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
const imgEnnemies = new Image();
imgEnnemies.src = "assets/Mail.png";


/* graphic features of the game */
game.canvas.width = sWidth;
game.canvas.height = sHeight;



/* drawing functions */ //put in class ?
function drawBackground() {
    game.ctx.drawImage(imgBackground, 0, 0, game.canvas.width, game.canvas.height);
}

function drawEnnemies(){
    game.ennemies.forEach(function(ennemy) {
        ennemy.draw(game.ctx);
    });
}


function moveEnnemies(){
    /* move the ennemies */
    game.ennemies.forEach(function(ennemy) {
        ennemy.move();
        /* Check collision with player */
        if (ennemy.isColliding(game.player)) {
            console.log("collision");
            game.ennemies.splice(game.ennemies.indexOf(ennemy), 1);
        }
    });
}

game.spawnEnnemies = function(wave) {
    let nbEnnemies = wave * 3;
    for (let i = 0; i < nbEnnemies; i++) {
        let x = Math.random() * (sWidth - 50);
        let ennemy = new Ennemy(x, 0 , 50, 50, imgEnnemies, 2);
        game.ennemies.push(ennemy);
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
        return this.x + dx < 0 || this.x + dx + this.width > game.canvas.width ||
            this.y + dy < 0 || this.y + dy + this.height > game.canvas.height;
    }
    
    moveLeft() {
        /* check if the object will be off screen */
        if (this.offScreen(-5, 0)) {
            return;
        }
        /* move the object */
        this.x -= 8;
    }

    moveRight() {
        /* check if the object will be off screen */
        if (this.offScreen(5, 0)) {
            return;
        }
        /* move the object */
        this.x += 8;
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
        const newLaser = new Laser(this.x + this.width / 2 - 5, this.y - this.height / 2, 10, 30, "red", 5);
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

class Ennemy extends Shooter {
    constructor(x, y, width, height, image, speed) {
        super(x, y, width, height, image, speed);
    }

    move() {
        /* move the ennemy */
        this.y += this.speed;
        if (this.y > game.canvas.height) {
            game.ennemies.splice(game.ennemies.indexOf(this), 1);
            console.log("DEAD");
        }

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
        if (this.offScreen(0, 0)) {
            this.delete();
        }
        for (let ennemy of game.ennemies) {
            if (this.isColliding(ennemy)) {
                this.delete();
                game.ennemies.splice(game.ennemies.indexOf(ennemy), 1);
            }
        }
    }


    delete() {
        /* delete the laser */
        game.player.lasers.splice(game.player.lasers.indexOf(this), 1);
    }
}


/* Main loop of the game */
function updateGame() {
    drawBackground();
    /* do all the drawings */
    game.player.draw(game.ctx);
    game.player.drawLasers();
    drawEnnemies();
    moveEnnemies();
    
    // updateEnemies();
    // updateBullets();
    // updateScore();
    // updateLives();
}


game.wave = 1;

/* start the game */
game.init = function(){
    game.player = new Player();
    game.ennemies = [];
    game.spawnEnnemies(game.wave);
    game.wave++;
    game.interval = setInterval(updateGame, 30);
}

/* stop the game */
game.stop = function() {
    clearInterval(game.interval);
}


/* main */ 
game.init();
