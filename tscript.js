// todo: collision tir mail se fait trop rapidement
// todo: coeur de vie a afficher
//todo: reset de la lvlwave quand restart a faire
//todo quand en pause on peut log des events, ou bien à fin de pause on enleve tous les evnets de datakeypressed
//todo score need to be restart at restart
//todo hitbox avec shield
// todo gameover window
// mettre autre temps pour les bonus 
//score at pause need to be done better
//todo supermissile passent de rouge à jaune quand timer passe à 0 => solve ça
//todo indep FPS
// probleme poubelle et spawn bonus
// mettre temps pour poubelle plutot

/* Get width of the screeplay */
const sWidth = document.getElementById('screenplay').offsetWidth;
const sHeight = document.getElementById('screenplay').offsetHeight;
var dataKeyPressed = {};


/* Represents caracteristics of the game */
var game = {};
game.canvas = document.getElementById('screenplay');
game.ctx = game.canvas.getContext('2d');
game.wave = 1;
game.initialized = false;
game.on_pause = false; // todo utiliser plutot classe avec display or not du menu pause et s'assurer qu'on est ingame
var list_menu = ['start_menu', 'screen_game', "pause_menu", "help_menu"];
var can_presspause = true; // todo a virer
game.score = 0;
game.bonusOnMap = [];
game.inventory = {
  'shield': 0,
  'trap': 0,
  'turbo': 0,
  'super_shoot': 0,
  'trap_placed': 0
};

game.trapOnMap = {};
/* en secondes */
const maxShieldTimer = 10 * 3.33 * 10;
const maxTurboTimer = 10 * 3.33 * 10;
const maxSuperShootTimer = 10 * 3.33 * 10;
const maxTrapGrabbed = 3;
const speedPlayer = 13;

const FPS = 30;

/* Events */
/* Keyboard events */

/* Adding key to array when pressed */
$(window).keydown(function (e) {
  if (e.which == 32 && game.player.canShoot) {  // spacebar
    game.player.canShoot = false;
    game.player.shoot();
  }
  dataKeyPressed[e.which] = true;
});

/* Removing key from array when released */
$(window).keyup(function (e) {
  if (e.which == 32) {
    game.player.canShoot = true;
  }
  dataKeyPressed[e.which] = false;
});


game.switch_pause = function () {
  game.can_presspause = !game.can_presspause;
  game.on_pause = !game.on_pause;
  if (game.on_pause) {
    game.changeScreen('pause_menu');
  } else {
    game.changeScreen('screen_game');
  }

}

$(window).keydown(function (e) {
  let cond_pause_screen = document.getElementById('screen_game').style.display == 'block';
  let cond_help_screen = document.getElementById('help_menu').style.display == 'block';
  if (e.which == 27 && cond_help_screen) {
    game.changeScreen("pause_menu");
  }
  else if (e.which == 27 && can_presspause && cond_pause_screen) {
    game.switch_pause();
  }
  else if (e.which == 37 && cond_help_screen) {
    document.getElementById('move_left_help_menu').classList.add('button_help_hover');
  }
  else if (e.which == 39 && cond_help_screen) {
    document.getElementById('move_right_help_menu').classList.add('button_help_hover');
  }
  dataKeyPressed[e.which] = true;
});

$(window).keyup(function (e) {
  let cond_pause_screen = document.getElementById('screen_game').style.display == 'block';
  let cond_help_screen = document.getElementById('help_menu').style.display == 'block';
  if (e.which == 27 && cond_pause_screen) {
    game.player.on_pause = true;
  }
  else if (e.which == 27 && cond_help_screen) {
    game.player.on_pause = true;
  }
  else if (e.which == 37 && cond_help_screen) {
    document.getElementById('move_left_help_menu').classList.remove('button_help_hover');
  }
  else if (e.which == 39 && cond_help_screen) {
    document.getElementById('move_right_help_menu').classList.remove('button_help_hover');
  }
  else if (e.which == 81 && game.inventory['shield'] > 0) {
    game.player.shieldTimer = maxShieldTimer;
    game.inventory['shield'] -= 1;
    document.getElementById("bonus_description_shield").style.display = "none";
    document.getElementById("bar_wrapper_shield").style.display = "flex";
  }
  else if (e.which == 87 && game.inventory['trap'] > 0) {
    game.inventory['trap'] -= 1;
    let bonus_trap = new TrapPlaced();
    document.getElementById("bonus_trap_wrapper").style.display = "none";
    game.bonusOnMap.push(bonus_trap);
    // putTrap();
  }
  else if (e.which == 69 && game.inventory['turbo'] > 0) {
    game.player.turboTimer = maxTurboTimer;
    game.inventory['turbo'] -= 1;
    game.player.speed = 20;
    document.getElementById("bonus_description_turbo").style.display = "none";
    document.getElementById("bar_wrapper_turbo").style.display = "flex";
  }
  else if (e.which == 82 && game.inventory['super_shoot'] > 0) {
    console.log("super_shoot");
    game.player.superShootTimer = maxSuperShootTimer;
    game.inventory['super_shoot'] -= 1;
    document.getElementById("bonus_description_super_shoot").style.display = "none";
    document.getElementById("bar_wrapper_super_shoot").style.display = "flex";
  }

  dataKeyPressed[e.which] = false;
});



/* Do keyboard events stored in dataKeyPressed */
game.doKeyboardEvents = function () {
  if (dataKeyPressed[37]) {  // left arrow
    game.player.moveLeft();
  }
  if (dataKeyPressed[38]) {  // up arrow
    game.player.moveUp();
  }
  if (dataKeyPressed[39]) {  // right arrow
    game.player.moveRight();
  }
  if (dataKeyPressed[40]) {  // down arrow
    game.player.moveDown();
  }
};


/* Graphics */

/* Definitions of the assets */
const imgPlayer = new Image();
imgPlayer.src = 'assets/player.png';
const imgShield = new Image();
imgShield.src = 'assets/shield.png';
const imgShieldInGame = new Image();
imgShieldInGame.src = 'assets/shield_ingame.png';

const imgTrap = new Image();
imgTrap.src = 'assets/trap.png';
const imgTrapInGame = new Image();
imgTrapInGame.src = 'assets/trap_ingame.png';

const imgTurbo = new Image();
imgTurbo.src = 'assets/turbo.png';

const imgSuperShoot = new Image();
imgSuperShoot.src = 'assets/star.png';

const imgEnnemies = new Image();
imgEnnemies.src = 'assets/Mail.png';
const imgMissile = new Image();
imgMissile.src = 'assets/Missile.png';

const imgSuperMissile = new Image();
imgSuperMissile.src = 'assets/supershoot_missile.png';

/* Graphic features of the game */
game.canvas.width = sWidth;
game.canvas.height = sHeight;

game.changeScreen =
  function (menu) {
    if (menu == 'pause_menu') {
      document.getElementById('pause_menu').style.display = 'block';
      document.getElementById('help_menu').style.display = 'none';
    }
    else if (menu == 'help_menu') {
      document.getElementById('pause_menu').style.display = 'none';
      document.getElementById('help_menu').style.display = 'block';
    }
    else {
      for (var i = 0; i < list_menu.length; i++) {
        if (list_menu[i] != menu) {
          document.getElementById(list_menu[i]).style.display = 'none';
        } else {
          document.getElementById(list_menu[i]).style.display = 'block';
        }
      }
      if (menu == 'screen_game') {
        document.body.style.backgroundImage =
          'url("assets/background_ingame.jpg")';
        game.init();
      }
      else if (menu == 'start_menu') {
        document.body.style.backgroundImage =
          'url("assets/background_startmenu.jpg")';
      }
    }
  }



game.manageLifeBar =
  function () {
    const lifebar = document.getElementById('lifebar_inner');
    lifebar.style.width = game.player.lifebar + '%';
    lifebar.innerHTML = game.player.lifebar + '%';
  }

game.drawEnnemies =
  function () {
    game.ennemies.forEach(function (ennemy) {
      ennemy.draw(game.ctx);
    });
  }

game.drawScore = function () {
  var score = document.getElementsByClassName("score_value");
  for (var i = 0; i < score.length; i++) {
    score[i].innerHTML = game.score;
  }
}

/* In-game functions */

game.moveEnnemies =
  function () {
    /* move the ennemies */
    game.ennemies.forEach(function (ennemy) {
      ennemy.move();
      /* Check collision with player */
      if (game.player.shieldTimer != 0) {
        if (ennemy.isColliding(game.player)) {
          game.player.shieldTimer = 1;
          game.ennemies.splice(game.ennemies.indexOf(ennemy), 1);
        }
      }
      else {
        if (ennemy.isColliding(game.player)) {
          game.player.lifebar -= 20;
          game.ennemies.splice(game.ennemies.indexOf(ennemy), 1);
        }
      }
    }
    );
  }

game.checkGameOver =
  function () {
    if (game.player.lifebar <= 0) {
      game.gameOver();
    }
  }

game.spawnEnnemies =
  function (wave) {
    let nbEnnemies = wave * 10;
    for (let i = 0; i < nbEnnemies; i++) {
      let x = Math.random() * (sWidth - 59);
      let y = Math.random() * (- 300 * (1 + wave * 0.3));
      let ennemy = new Ennemy(x, y, 58, 43, imgEnnemies, 1);
      game.ennemies.push(ennemy);
    }
  }

game.checkLvlState =
  function () {
    /* check if we spawn bonus */
    if (game.bonusOnMap.length == 0) {
      let proba = Math.random();
      if (proba < 1 / 600) {
        /* spawn a random bonus */
        game.spawnBonus();
      }
    }
    /* check if we spawn ennemies */
    if (game.ennemies.length == 0) {
      game.spawnEnnemies(game.wave);
      game.wave++;
    }
  }

game.checkCollisionBonus =
  function () {
    game.bonusOnMap.forEach(function (bonus) {
      if (bonus.type == 'trap_placed') {
        /* Check collision with ennemies */
        game.ennemies.forEach(function (ennemy) {
          if (ennemy.isColliding(bonus)) {
            game.ennemies.splice(game.ennemies.indexOf(ennemy), 1);
            bonus.canStillGrabAmount--;
            if (bonus.canStillGrabAmount == 0) {
              game.bonusOnMap.splice(game.bonusOnMap.indexOf(bonus), 1);
            }
          }
        }
        );

      }
      else if (bonus.type == 'shield') {
        if (bonus.isColliding(game.player)) {

          game.inventory['shield']++;
          game.bonusOnMap.splice(game.bonusOnMap.indexOf(bonus), 1);
          showBonus('shield');
        }
      }
      else if (bonus.type == 'trap') {
        if (bonus.isColliding(game.player)) {
          game.inventory['trap']++;
          game.bonusOnMap.splice(game.bonusOnMap.indexOf(bonus), 1);
          showBonus('trap');
        }
      }
      else if (bonus.type == 'turbo') {
        if (bonus.isColliding(game.player)) {
          game.inventory['turbo']++;
          game.bonusOnMap.splice(game.bonusOnMap.indexOf(bonus), 1);
          showBonus('turbo');
        }
      }
      else if (bonus.type == 'super_shoot') {
        if (bonus.isColliding(game.player)) {
          game.inventory['super_shoot']++;
          game.bonusOnMap.splice(game.bonusOnMap.indexOf(bonus), 1);
          showBonus('super_shoot');
        }
      }
    })
  }

game.spawnBonus =
  function () {
    let x = Math.random() * (sWidth - 65);
    let y = Math.random() * (sHeight - 65);

    let random = Math.random();
    if (random < 0.25) {
      if (game.inventory['shield'] > 0) {
        game.spawnBonus();
      }
      else {
        bonus = new Shield(x, y);
      }
    }
    else if (random < 0.5) {
      if (game.inventory['trap'] > 0) {
        game.spawnBonus();
      }
      else {
        bonus = new Trap(x, y);
      }
    }
    else if (random < 0.75) {
      if (game.inventory['turbo'] > 0) {
        game.spawnBonus();
      }
      else {
        bonus = new Turbo(x, y);
      }
    }
    else {
      if (game.inventory['super_shoot'] > 0) {
        game.spawnBonus();
      }
      else {
        bonus = new SuperShoot(x, y);
      }
    }
    game.bonusOnMap.push(bonus);
  }

game.drawBonus =
  function () {
    game.bonusOnMap.forEach(function (bonus) {
      bonus.draw(game.ctx);
    });
  }


game.manageBonus =
  function () {
    game.checkCollisionBonus();
    /* manage turbo */


  }


function putTrap() {
  /* draw the ingame_trap at the place of the player */
  game.ctx.drawImage(imgTrapInGame, game.player.x, game.player.y, 58, 43);
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
    // TODO: rajouter width et heighth de l'objet pour plus de précision
    /* check if the object is off screen */
    return this.x + dx < 0 || this.x + dx + this.width > game.canvas.width ||
      this.y + dy < 0 || this.y + dy + this.height > game.canvas.height;
  }

  isColliding(object) {
    /* check if the object is colliding with another object */
    return this.x < object.x + object.width && this.x + this.width > object.x &&
      this.y < object.y + object.height && this.y + this.height > object.y;
  }
}

class Bonus extends PhysicalObject {
  constructor(x, y, width, height, imgLogo, type) {
    super(x, y, width, height, imgLogo);
    this.type = type;
  }
}

class Turbo extends Bonus {
  constructor(x, y) {
    super(x, y, 48, 52, imgTurbo, 'turbo');
  }
}

class SuperShoot extends Bonus {
  constructor(x, y) {
    super(x, y, 48, 52, imgSuperShoot, 'super_shoot');
  }
}

class Shield extends Bonus {
  constructor(x, y) {
    super(x, y, 48, 52, imgShield, 'shield');
  }
}

class Trap extends Bonus {
  constructor(x, y) {
    super(x, y, 48, 52, imgTrap, 'trap');
  }
}


class TrapPlaced extends Bonus {
  constructor() {
    super(game.player.x, game.player.y, 48, 76, imgTrapInGame, "trap_placed");
    this.canStillGrabAmount = maxTrapGrabbed;
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
    if (this == game.player) {
      let laser = new LaserPlayer(this.x + this.width / 2, this.y, imgMissile, 10);
      this.lasers.push(laser);
    }
    else {
      const newLaser = new Laser(
        this.x + this.width / 2 - 5, this.y - this.height / 2, 14, 57,
        5);
      this.lasers.push(newLaser);
    }
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
    super(400, 800, 27, 64.5, imgPlayer, speedPlayer);
    this.canShoot = true;
    this.lifebar = 100;
    this.shieldTimer = 0;
    this.turboTimer = 0;
    this.superShootTimer = 0;
  }

  shoot() {
    /* shoot a laser */
    if (this.superShootTimer > 0) {
      const newLaser = new LaserPlayer(
        this.x + this.width / 2 - 15, this.y - this.height / 2, 10, 30,
        5);
      const newLaser2 = new LaserPlayer(
        this.x + this.width / 2 + 10, this.y - this.height / 2, 10, 30,
        5);
      this.lasers.push(newLaser);
      this.lasers.push(newLaser2);
    }
    else {
      super.shoot();
    }
  }


  draw() {

    game.ctx.globalCompositeOperation = 'source-over';
    super.draw();
    game.ctx.globalCompositeOperation = 'destination-over';
    if (this.shieldTimer > 0) {
      game.ctx.drawImage(imgShieldInGame, this.x - this.height / 2.1, this.y - this.height / 3.5, this.height * 1.5, this.height * 1.5);
      this.shieldTimer--;
      const barTimer = document.getElementById('bar_wrapper_shield');
      let countBar = Math.round(this.shieldTimer / maxShieldTimer * 100);
      let barWidth = Math.round(countBar * 0.6);
      barTimer.style.width = barWidth + '%';
      barTimer.innerHTML = countBar / 10 + ' s';
      if (this.shieldTimer == 0) {
        document.getElementById('bonus_shield_wrapper').style.display = 'none';
      }
    }
    if (this.turboTimer > 0) {
      this.turboTimer--;
      const barTimer = document.getElementById('bar_wrapper_turbo');
      let countBar = Math.round(this.turboTimer / maxTurboTimer * 100);
      let barWidth = Math.round(countBar * 0.6);
      barTimer.style.width = barWidth + '%';
      barTimer.innerHTML = countBar / 10 + ' s';
      if (this.turboTimer == 0) {
        document.getElementById('bonus_turbo_wrapper').style.display = 'none';
        this.speed = speedPlayer;
      }
    }
    if (this.superShootTimer > 0) {
      this.superShootTimer--;
      const barTimer = document.getElementById('bar_wrapper_super_shoot');
      let countBar = Math.round(this.superShootTimer / maxSuperShootTimer * 100);
      let barWidth = Math.round(countBar * 0.6);
      barTimer.style.width = barWidth + '%';
      barTimer.innerHTML = countBar / 10 + ' s';
      if (this.superShootTimer == 0) {
        document.getElementById('bonus_super_shoot_wrapper').style.display = 'none';
      }
    }
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
    }
  }
}

/* Laser class */
class Laser extends PhysicalObject {
  constructor(x, y, width, height, speed) {
    super(x, y, width, height);
    this.speed = speed;
  }

  draw() {
    /* draw the laser */
    game.ctx.drawImage(imgMissile, this.x, this.y, this.width, this.height);
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

class LaserPlayer extends Laser {
  constructor(x, y) {
    super(x, y, 14, 57, 14);
  }

  draw() {
    /* draw the laser */
    if (game.player.superShootTimer > 0) {
      game.ctx.drawImage(imgSuperMissile, this.x, this.y, this.width, this.height);
    }
    else {
      game.ctx.drawImage(imgMissile, this.x, this.y, this.width, this.height);
    }
  }
}


/* Main loop of the game */
function updateGame() {
  /* manage events */
  game.doKeyboardEvents();
  if (game.on_pause == false) {
    /* reset the canvas */
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);

    /* do all the drawings */
    game.player.draw(game.ctx);
    game.player.drawLasers();
    game.drawEnnemies();

    /* do all the in-game functions */
    game.moveEnnemies();
    game.checkLvlState();
    game.checkGameOver();
    game.manageLifeBar();
    game.score += 10;
    game.drawScore();
    game.manageBonus();
    game.drawBonus();
  }
  // updateEnemies();
  // updateBullets();
  // updateScore();
  // updateLives();
}

/* Manage buttons */
document.getElementById('start_button').onclick = function () {
  game.initialized = false;
  game.changeScreen('screen_game');
}

/* Button of pause menu */

document.getElementById("logo_home").onclick = function () {
  game.changeScreen('start_menu');
}

document.getElementById("resume_button").onclick = function () {
  game.changeScreen('screen_game');
  game.switch_pause();
}

document.getElementById("restart_button").onclick = function () {
  game.initialized = false;
  game.changeScreen('screen_game');
  game.can_presspause = true;
  game.on_pause = false;
}

document.getElementById("home_button").onclick = function () {
  game.changeScreen('start_menu');
}

document.getElementById("help_button_pause_menu").onclick = function () {
  game.changeScreen('help_menu');
}


function hideAllBonus() {
  let div_bonus = document.getElementsByClassName("bonus_wrapper");
  for (let i = 0; i < div_bonus.length; i++) {
    div_bonus[i].style.display = "none";
  }
}

function showBonus(bonus) {
  document.getElementById("bonus_" + bonus + "_wrapper").style.display = "flex";
}

/* Start the game */
game.init =
  function () {
    if (game.initialized == false) {
      hideAllBonus();
      game.wave = 1;
      game.initialized = true;
      game.score = 0;
      game.on_pause = false;
      game.can_presspause = true;
      game.player = new Player();
      game.player.x = game.canvas.width / 2 - game.player.width / 2;
      game.player.y = game.canvas.height - game.player.height;
      game.ennemies = [];
      game.spawnEnnemies(game.wave);
      if (game.interval === null) {
        game.interval = setInterval(updateGame, FPS);
      }
      else {
        clearInterval(game.interval);
        game.interval = setInterval(updateGame, FPS);
      }
    }
  }

/* Stop the game todo the gameover stuff here */
game.stop =
  function () {
    clearInterval(game.interval);
  }

game.gameOver =
  function () {
    game.stop();
    game.changeScreen('start_menu');
  }


game.changeScreen('start_menu');

