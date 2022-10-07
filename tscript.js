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

/* adding key to array when pressed */
$(window).keydown(function(e) {dataKeyPressed[e.which] = true;});

/* removing key from array when released */
$(window).keyup(function(e) { dataKeyPressed[e.which] = false; });

game.doKeyboardEvents = function() {
    if (dataKeyPressed[37]) { // left arrow
        game.player.moveLeft();
    }
    if (dataKeyPressed[38]) { // up arrow
        game.player.moveUp();
    }
    if (dataKeyPressed[39]) { // right arrow
        game.player.moveRight();
    }
    if (dataKeyPressed[40]) { // down arrow
        game.player.moveDown();
    }
    if (dataKeyPressed[32]) { // spacebar
        game.player.shoot();
    }
};


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
game.drawBackground = function() {
    game.ctx.drawImage(imgBackground, 0, 0, game.canvas.width, game.canvas.height);
}

game.drawEnnemies = function(){
    game.ennemies.forEach(function(ennemy) {
        ennemy.draw(game.ctx);
    });
}


/* In-game functions */

game.moveEnnemies = function(){
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

game.checkLvlState = function() {
    if (game.ennemies.length == 0) {
        game.spawnEnnemies(game.wave);
        game.wave++;
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
    
    moveLeft() {
        /* check if the object will be off screen */
        if (this.offScreen(-this.speed, 0)) {
            this.x = 0;
            return;
        }
        /* move the object */
        this.x -= this.speed;
    }

    moveRight() {
        /* check if the object will be off screen */
        if (this.offScreen(this.speed, 0)) {
            this.x = game.canvas.width - this.width;
            return;
        }
        /* move the object */
        this.x += this.speed;
    }

    moveUp() {
        /* check if the object will be off screen */
        if (this.offScreen(0, -this.speed)) {
            this.y = 0;
            return;
        }
        
        /* move the object */
        this.y -= this.speed;
    }
    
    moveDown() {
        /* check if the object will be off screen */
        if (this.offScreen(0, this.speed)) {
            this.y = game.canvas.height - this.height;
            return;
        }
        /* move the object */
        this.y += this.speed;
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
        super(200, 500, 30, 50, imgPlayer, 20);
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
    /* reset the canvas */
    game.drawBackground();
    
    /* manage events */
    game.doKeyboardEvents();
    
    /* do all the drawings */
    game.player.draw(game.ctx);
    game.player.drawLasers();
    game.drawEnnemies();

    /* do all the in-game functions */
    game.moveEnnemies();
    game.checkLvlState();

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
