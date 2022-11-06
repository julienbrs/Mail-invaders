//todo hitbox avec shield
// musique ou son pour game over ?
// todo changer curseur
// laisser bonus title quand activé
// todo maxlife = 5 quand heart pris et déjà life max
//todo move poubelle
// enlever tous les underscore
// redraw map than bonus maybe ?
// spawn ennemies out of screen
// heart spawn need to be randomized
// todo switch case in spawnbonus ?
// todo came from game over or start menu for leaderboard
//todo indep FPS
// todo vitesse laser when turbo
// add bonus title when activated
// todo sound dmg player + pause button in game
// todo pause menu
// function frame to seconds for fps
// enlever son arrows difficulty quand max ou min
// mettre toutes les valeurs qu'on reset dans game init dans un seul attribut de game pour reset entierement plus facielement, genre game.instance

/* Get caracteristics of the screen */
const sWidth = document.getElementById('screenplay').offsetWidth;
const sHeight = document.getElementById('screenplay').offsetHeight;

/* Contains elements, methods and objects of the game */
var game = {};
/* Contains initialized elements of a party */
game.instance = {};
/* Drawing elements */
game.canvas = document.getElementById('screenplay');
game.ctx = game.canvas.getContext('2d');

/* Game party caracteristics */
game.wave = 1;
game.difficulty = 0;
game.score = 0;

game.canvas.width = sWidth;
game.canvas.height = sHeight;
/* Store key pressed here to manage several keys pressed at the same time */
var dataKeyPressed = {};
/* Store lasers of ennemies here so lasers don't disappear when ennemies die */
game.ennemyLasers = [];
/* game.Flags */
game.initialized = false;
game.onPause = false; // todo utiliser plutot classe avec display or not du menu pause et s'assurer qu'on est ingame
game.canSpawnBonus = true;
/* On map elements */
game.bonusOnMap = [];
game.inventory = {
  'shield': 0,
  'trap': 0,
  'turbo': 0,
  'super_shoot': 0,
  'trap_placed': 0,
  'items_in_bag': 0
};
game.trapOnMap = {};
/* Time caracteristics */
game.timerTick = 0;
game.bonusSpawnTick = 350;
game.maxBonusSpawnTick = 700;
game.tickPlayerImage = 0;


/* Constants */

const FPS = 30;
/* Time caracteristics */
const maxShieldTimer = 20 * 3.33 * 10;
const maxTurboTimer = 10 * 3.33 * 10;
const maxSuperShootTimer = 10 * 3.33 * 10;
const maxTrapGrabbed = 3;
var maxGameTimer = 60;
/* Speed */
const vitesseLaserEnnemy = 5;
const vitesseLaserPlayer = 10;
const speedPlayer = 13;

const list_difficulty = ["easy", "medium", "hard"];
const list_menu = ['start_menu', 'screen_game', "pause_menu", "help_menu_in_game", "game_over_menu", "leaderboard_menu"];
const maxDifficulty = 2; //todo  à virer ?
const maxNbLife = 5;
/* Flags */
var canPressPause = true; // todo a virer

/* div id that we will use often */
const idLife3 = document.getElementById("life3");
const idLife2 = document.getElementById("life2");
const idLife1 = document.getElementById("life1");
const idLife0 = document.getElementById("life0");
const mainAudio = document.getElementById("mainAudio");


/* Assets */

/* Definitions of the images */
const imgPlayer = new Image();
imgPlayer.src = 'images/player.png';
const imgPlayer2 = new Image();
imgPlayer2.src = 'images/player_without_light.png';

const imgShield = new Image();
imgShield.src = 'images/shield.png';
const imgShieldInGame = new Image();
imgShieldInGame.src = 'images/shield_ingame.png';

const imgTimerBonus = new Image();
imgTimerBonus.src = 'images/clock.png';

const imgHeart = new Image();
imgHeart.src = 'images/bonus_life.png';

const imgTrap = new Image();
imgTrap.src = 'images/trap.png';
const imgTrapInGame = new Image();
imgTrapInGame.src = 'images/trap_ingame.png';

const imgTurbo = new Image();
imgTurbo.src = 'images/turbo.png';

const imgSuperShoot = new Image();
imgSuperShoot.src = 'images/star.png';

const imgSimpleMail = new Image();
imgSimpleMail.src = 'images/simple_mail.png';
const imgDoubleMail = new Image();
imgDoubleMail.src = 'images/double_mail.png';
const imgTripleMail = new Image();
imgTripleMail.src = 'images/triple_mail.png';
const imgShooterMail = new Image();
imgShooterMail.src = 'images/shooter_mail.png';

const imgMissile = new Image();
imgMissile.src = 'images/Missile.png';
const imgSuperMissile = new Image();
imgSuperMissile.src = 'images/supershoot_missile.png';
const imgMissileShooterMail = new Image();
imgMissileShooterMail.src = 'images/missile_shooter_mail.png';

const imgCancelButton = new Image();
imgCancelButton.src = 'images/cancel_button.png';
const imgLifeEmpty = new Image();
imgLifeEmpty.src = 'images/life_empty.png';
const imgLifeFill = new Image();
imgLifeFill.src = 'images/life_fill.png';

/* Audios */
const audioPlayerShoot = new Audio('audio/shoot.mp3');
const audioHoverButton = new Audio('audio/hover_sound.mp3');
const audioClickButton = new Audio('audio/click_sound.mp3');
const audioEnnemyDown = new Audio('audio/ennemy_down.mp3');
const audioBonusPicked = new Audio('audio/bonus_picked.mp3');



/* Events */

/* Keyboard events */
/* Adding key to dataKeyPressed array when pressed */
$(window).keydown(function (e) {
  if (e.which == 32 && game.player.canShoot && isGaming()) {  // 32 = spacebar
    /* canShoot is used to avoid shooting too fast by leaving the spacebar pressed */
    game.player.canShoot = false;
    game.player.shoot();
  }
  dataKeyPressed[e.which] = true;
});

/* Removing key from dataKeyPressed array when released */
$(window).keyup(function (e) {
  if (e.which == 32) {  // 32 = spacebar
    game.player.canShoot = true;
  }
  dataKeyPressed[e.which] = false;
});

/* Pause the game when pressing Escape */
$(window).keydown(function (e) {
  let isGameLaunched = document.getElementById('screen_game').style.display == 'flex';
  let isOnPause = document.getElementById('help_menu_in_game').style.display == 'flex';
  if (e.which == 27 && isOnPause) { // 27 = escape
    game.changeScreen("pause_menu");
  }
  else if (e.which == 27 && canPressPause && isGameLaunched) {
    game.switchPause();
  }
  dataKeyPressed[e.which] = true;
});

$(window).keyup(function (e) {

  if (isGaming()) {
    if (e.which == 81 && game.inventory['shield'] > 0) {  // 81 = q
      game.player.shieldActivated = true;
      game.player.bonusActivated = true;
      game.player.shieldTimer = maxShieldTimer;
      game.inventory['shield'] -= 1;
      game.inventory['items_in_bag']--;
      document.getElementById("bonus_description_shield").style.display = "none";
      document.getElementById("bar_wrapper_shield").style.display = "flex";
    }
    if (e.which == 87 && game.inventory['trap'] > 0) {  // 87 = w
      game.inventory['trap'] -= 1;
      game.inventory['items_in_bag']--;
      game.bonusOnMap.push(new TrapPlaced());
      /* Hiding the bonus in HUD */
      document.getElementById("bonus_trap_wrapper").style.display = "none";
    }
    if (e.which == 69 && game.inventory['turbo'] > 0) {  // 69 = e
      game.player.turboActivated = true;
      game.player.bonusActivated = true;
      game.player.turboTimer = maxTurboTimer;
      game.player.speed = 20;
      game.inventory['turbo'] -= 1;
      game.inventory['items_in_bag']--;
      /* Hiding bonus description, showing timer bar */
      document.getElementById("bonus_description_turbo").style.display = "none";
      document.getElementById("bar_wrapper_turbo").style.display = "flex";
    }
    if (e.which == 82 && game.inventory['super_shoot'] > 0) {
      game.player.superShootActivated = true;
      game.player.bonusActivated = true;
      game.player.superShootTimer = maxSuperShootTimer;
      game.inventory['super_shoot'] -= 1;
      game.inventory['items_in_bag']--;
      /* Hiding bonus description, showing timer bar */
      document.getElementById("bonus_description_super_shoot").style.display = "none";
      document.getElementById("bar_wrapper_super_shoot").style.display = "flex";
    }
  }
  /* Removing key from dataKeyPressed array when released */
  dataKeyPressed[e.which] = false;
});

/* Do keyboard events stored in dataKeyPressed */
game.doKeyboardEvents = function () {
  if (isGaming()) {
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
  }
};


/* Buttons events */

/* Play main music when clicking */
function togglePlaySound() {
  logoSoundStartMenu = document.getElementById("sound_button_start_menu");
  logoSoundInGame = document.getElementById("logo_sound_in_game");
  if (mainAudio.paused) {
    mainAudio.play();
    /* Weird, can't change the image with .src, so has to be done manually with innerHTML */
    // logoSoundStartMenu.src = "images/button_sound.png";
    // logoSoundInGame.src = "images/logo_sound_in_game.png";
    logoSoundStartMenu.innerHTML = '<input id="toggle_sound_start_menu" type="image" class="audio_button" onclick="togglePlaySound()" src="images/button_sound.png"/>'
    logoSoundInGame.innerHTML = '<input type="image" class="audio_button" onclick="togglePlaySound()" src="images/logo_sound_in_game.png" alt="sound">'
  } else {
    mainAudio.pause();
    /* Weird, can't change the image with .src, so has to be done manually with innerHTML */
    // logoSoundStartMenu.src = "images/button_no_sounde.png";
    // logoSoundInGame.src = "images/logo_no_sound.png";
    logoSoundStartMenu.innerHTML = '<input id="toggle_sound_start_menu" type="image" class="audio_button" onclick="togglePlaySound()" src="images/button_no_sound.png">'
    logoSoundInGame.innerHTML = '<input type="image" class="audio_button" onclick="togglePlaySound()" src="images/logo_no_sound.png" alt="sound">'
  }
};

/* Link sound effect to buttons */
function setSoundClickHover() {
  let listElement = document.getElementsByClassName("sound_button");
  for (let element of listElement) {
    element.addEventListener("mouseover", function () {
      audioHoverButton.cloneNode(true).play();
    });
    element.addEventListener("click", function () {
      audioClickButton.cloneNode(true).play();
    }
    );
  }
}

/* Link click buttons to right changeScreen */
document.getElementById('start_button').onclick = function () {
  game.initialized = false;
  game.changeScreen('screen_game');
}
document.getElementById("logo_home").onclick = function () {
  game.changeScreen('start_menu');
}
document.getElementById("game_over_home").onclick = function () {
  game.changeScreen('start_menu');
}
document.getElementById("resume_button").onclick = function () {
  game.changeScreen('screen_game');
  game.switchPause();
}
document.getElementById("restart_button").onclick = function () {
  game.initialized = false;
  game.canPressPause = true;
  game.onPause = false;
  game.changeScreen('screen_game');
}
document.getElementById("home_button").onclick = function () {
  game.changeScreen('start_menu');
}
document.getElementById("help_button_pause_menu").onclick = function () {
  game.changeScreen('help_menu_in_game');
}


/* Menu management */
game.changeScreen =
  function (menu) {
    if (menu == 'pause_menu') {
      document.getElementById('pause_menu').style.display = 'flex';
      document.getElementById('help_menu_in_game').style.display = 'none';
    }
    else if (menu == 'help_menu_in_game') {
      document.getElementById('pause_menu').style.display = 'none';
      document.getElementById('help_menu_in_game').style.display = 'flex';
    }

    else {
      /* Hide all menus except the one we want to show */
      for (var i = 0; i < list_menu.length; i++) {
        if (list_menu[i] != menu) {
          document.getElementById(list_menu[i]).style.display = 'none';
        } else {
          document.getElementById(list_menu[i]).style.display = 'flex';
        }
      }

      /* Do specific actions for each menu */
      if (menu == 'screen_game') {
        document.body.style.backgroundImage = 'url("images/background_ingame.jpg")';
        game.initialize();
      }

      else if (menu == 'start_menu') {
        document.body.style.backgroundImage = 'url("images/background_startmenu.jpg")';
        document.getElementById("game_over_home").style.display = "none";
        /* Show elements of the start menu that might have been hidden at the previous game over */
        const startMenuElements = document.getElementsByClassName("start_menu");
        for (const element of startMenuElements) {
          element.style.display = 'flex';
        }
        /* Adapting elements position and text for start menu */
        document.getElementById("start_button").innerHTML = "Play";
        document.getElementById("start_menu_title").style.visibility = "visible";
        document.getElementById("start_menu_buttons").style.position = "static";
      }

      else if (menu == 'game_over_menu') {
        document.body.style.backgroundImage = 'url("images/background_startmenu.jpg")';
        /* First show start menu because some are reused for game over menu */
        document.getElementById("start_menu").style.display = "flex";
        /* Then hide elements of the start menu that are not used in game over menu */
        const startMenuElements = document.getElementsByClassName("start_menu");
        for (const element of startMenuElements) {
          element.style.display = 'none';
        }
        document.getElementById("start_menu_title").style.display = "flex";
        document.getElementById("start_menu_title").style.visibility = "hidden";
        document.getElementById("game_over_home").style.display = "block";
        /* Then show elements of the game over menu that might have been hidden at the previous start menu */
        const elements_over = document.getElementsByClassName("game_over");
        for (const element of elements_over) {
          element.style.display = 'flex';
        }
        /* Adapting elements position and text for game over menu */
        document.getElementById("start_menu_buttons").style.position = "absolute";
        document.getElementById("start_menu_buttons").style.setProperty("top", "155%");
        document.getElementById("start_menu_buttons").style.setProperty("left", "6.2%");
        document.getElementById("start_button").innerHTML = "Play Again";
      }
    }
  }

/* Pause or resume the game */
game.switchPause = function () {
  /* Change the value of canPressPause to avoid multiple press */
  game.canPressPause = !game.canPressPause;
  /* Change the value of on_pause to know if the game is paused or not */
  game.onPause = !game.onPause;
  if (game.onPause) {
    game.changeScreen('pause_menu');
  } else {
    game.changeScreen('screen_game');
  }
}

/* Check if it is playing and not paused */
function isGaming() {
  return document.getElementById('screen_game').style.display == 'flex' && document.getElementById('pause_menu').style.display == 'none';
}

/* Update score depending of the ennemy killed and the difficulty */
game.addScoreEnnemy =
  function (ennemy) {
    if (ennemy.constructor.name === 'TripleMail') {
      game.score += 300 * (game.difficulty + 1);
    }
    else if (ennemy.constructor.name === 'ShooterMail') {
      game.score += 200 * (game.difficulty + 1);
    }
    else {
      game.score += 100 * (game.difficulty + 1);
    }
  }

/* button to lower the difficulty */
function downDifficulty() {
  if (game.difficulty == 0) { // do nothing if difficulty is already at the lowest
    return;
  }
  game.difficulty--;
  /* Change text difficulty and little arrow selectors */
  document.getElementById("difficulty_button").innerHTML = list_difficulty[game.difficulty];
  document.getElementById("difficulty_title_ingame").innerHTML = '<h1>' + list_difficulty[game.difficulty] + '<h1>';
  document.getElementById("difficulty_right_arrow").src = "images/triangle_right.png";
  if (game.difficulty == 0) {
    /* Left arrow selector is in shadow if difficulty is at the lowest */
    document.getElementById("difficulty_left_arrow").src = "images/triangle_left_shadow.png";
  }
  else {
    /* Left arrow selector is not in shadow */
    document.getElementById("difficulty_left_arrow").src = "images/triangle_left.png";
  }
}

function upDifficulty() {
  if (game.difficulty == 2) { // do nothing if difficulty is already at the highest
    return;
  }
  game.difficulty++;
  /* Change text difficulty and little arrow selectors */
  document.getElementById("difficulty_button").innerHTML = list_difficulty[game.difficulty];
  document.getElementById("difficulty_title_ingame").innerHTML = '<h1>' + list_difficulty[game.difficulty] + '<h1>';
  document.getElementById("difficulty_left_arrow").src = "images/triangle_left.png";
  if (game.difficulty == maxDifficulty) {
    /* Right arrow selector is in shadow if difficulty is at the highest */
    document.getElementById("difficulty_right_arrow").src = "images/triangle_right_shadow.png";
  }
  else {
    /* Right arrow selector is not in shadow */
    document.getElementById("difficulty_right_arrow").src = "images/triangle_right.png";
  }
}


/* Graphics functions */

game.drawEnnemies =
  function () {
    game.ennemies.forEach(function (ennemy) {
      ennemy.draw(game.ctx);
    });
  }

game.drawScore = function () {
  const scores = document.getElementsByClassName("score_value");
  for (const score of scores) {
    score.innerHTML = game.score;
  }
}

game.drawBonus =
  function () {
    game.bonusOnMap.forEach(function (bonus) {
      bonus.draw(game.ctx);
    });
  }

game.drawLasersEnnemies = function () {
  for (let ennemy of game.ennemies) {
    /* Only ShooterMail has lasers */
    if (ennemy.constructor.name === 'ShooterMail') {
      ennemy.tryToShoot();
      ennemy.drawLasers();
    }
  }
}

game.drawTimerBar =
  function () {
    game.timerTick++;
    if (game.timer > maxGameTimer) {
      game.timer = maxGameTimer;
    }
    let percentageBar = game.timer / maxGameTimer * 100;
    if (percentageBar < 15) {
      percentageBar = 15;
    }

    const timerbar = document.getElementById('timerbar_inner');
    timerbar.style.width = percentageBar + '%';
    timerbar.innerHTML = game.timer + ' s';
    if (game.timerTick % 30 == 0) {
      game.timer--;
      game.timerTick = 0;
      game.score += 100 * (game.difficulty + 1);
    }
  }

game.manageImagePlayer = function () {
  game.tickPlayerImage++;
  /* Change the image of the player every 40 ticks */
  if (game.tickPlayerImage > 40) {
    game.tickPlayerImage = 0;
    /* Change the image of the player */
    if (game.player.image == imgPlayer) {
      game.player.image = imgPlayer2;
    }
    else {
      game.player.image = imgPlayer;
    }
  }
}

/* Affiche le nombre de vies restantes avec des coeurs remplies ou vides */
game.manageLifePlayer = function () {
  for (var i = 1; i <= maxNbLife; i++) {
    if (i <= game.player.life) {
      document.getElementById("life" + i).src = "images/life_fill.png";
    }
    else {
      document.getElementById("life" + i).src = "images/life_empty.png";
    }
  }
}



/* Bonus Functions */

game.spawnBonus =
  function (bonus_chosen = "none") {
    /* Pick a random location for the bonus */
    let x = Math.random() * (sWidth - 65);
    let y = Math.random() * (0.9 * sHeight - 65);

    if (bonus_chosen == "timer_bonus") {
      bonus = new TimerBonus(x, y);
    }
    else if (bonus_chosen == "heart") {
      /* Check if there is already a heart on the map */
      if (game.bonusOnMap.some(bonus => bonus.type == "heart")) {
        return;
      }
      bonus = new Heart(x, y);
    }

    else {
      /* If bag is full, do not spawn a bonus */
      if (game.inventory['items_in_bag'] >= 4) {
        return;
      }

      if (!this.canSpawnBonus) { //todo: does it work without that ?
        return;
      }

      /* If no bonus is chosen, pick a random one */
      let random = Math.random();
      /* If the bonus chosen is already in inventory or being used, spawn another one */
      if (random < 0.25) {
        if (game.inventory['shield'] > 0 || game.player.shieldActivated) {
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
        if (game.inventory['turbo'] > 0 || game.player.turboActivated) {
          game.spawnBonus();
        }
        else {
          bonus = new Turbo(x, y);
        }
      }
      else {
        if (game.inventory['super_shoot'] > 0 || game.player.superShootActivated) {
          game.spawnBonus();
        }
        else {
          bonus = new SuperShoot(x, y);
        }
      }

      this.canSpawnBonus = false;
    }
    game.bonusOnMap.push(bonus)
  }


game.manageBonus =
  function () {
    /* Ticking only if no bonus is activated */
    if (game.canSpawnBonus && game.player.bonusActivated == false) {
      game.bonusSpawnTick++;

      if (game.bonusSpawnTick > game.maxBonusSpawnTick) {
        game.bonusSpawnTick = 0;
        game.spawnBonus();
      }
    }
    game.checkCollisionBonus();



  }

game.catchingTimerBonus =
  function () {
    /* Timer is increased by 15 seconds */
    game.timer += 15;
    if (game.timer > maxGameTimer) {
      maxGameTimer = game.timer;
    }
  }

game.checkCollisionBonus =
  function () {
    game.bonusOnMap.forEach(async function (bonus) {
      if (bonus.type == 'trap_placed') {
        /* If it's a trap, check collision with ennemies */
        game.ennemies.forEach(function (ennemy) {
          if (ennemy.isColliding(bonus)) {
            /* Kill ennemy, play a sound, trap is used and add score */
            game.ennemies.splice(game.ennemies.indexOf(ennemy), 1);
            audioEnnemyDown.cloneNode(true).play();
            bonus.canStillGrabAmount--;
            game.addScoreEnnemy(ennemy);
            if (bonus.canStillGrabAmount == 0) {
              /* Remove the trap from the map */
              game.bonusOnMap.splice(game.bonusOnMap.indexOf(bonus), 1);
            }
          }
        }
        );
      }
      /* Check collision with player */
      else if (bonus.type == 'timer_bonus') {
        if (bonus.isColliding(game.player)) {
          audioBonusPicked.cloneNode(true).play();
          game.bonusOnMap.splice(game.bonusOnMap.indexOf(bonus), 1);
          game.catchingTimerBonus();
          await new Promise(resolve => setTimeout(resolve, 5000));
          game.spawnBonus("timer_bonus");
        }
      }
      else if (bonus.type == 'heart') {
        if (bonus.isColliding(game.player)) {
          audioBonusPicked.cloneNode(true).play();
          game.bonusOnMap.splice(game.bonusOnMap.indexOf(bonus), 1);
          game.player.life++;
        }
      }
      else {
        if (bonus.isColliding(game.player)) {
          audioBonusPicked.cloneNode(true).play();
          game.bonusOnMap.splice(game.bonusOnMap.indexOf(bonus), 1);
          game.canSpawnBonus = true;
          if (game.inventory[bonus.type] != 1) {
            game.inventory['items_in_bag']++;
          }
          game.inventory[bonus.type] = 1;
          showBonus(bonus.type);
        }
      }
    }
    );
  }

function hideAllBonus() {
  let div_bonus = document.getElementsByClassName("bonus_wrapper");
  for (const div of div_bonus) {
    div.style.display = "none";
  }
}

function showBonus(bonus) {
  document.getElementById("bonus_" + bonus + "_wrapper").style.display = "flex";
  document.getElementById("bonus_description_" + bonus).style.display = "block";
  document.getElementById("bar_wrapper_" + bonus).style.display = "none";
}


/* Functions in-game */

game.moveEnnemies =
  function () {
    /* move the ennemies */
    game.ennemies.forEach(function (ennemy) {
      ennemy.move();
      /* Check collision with player */
      if (game.player.shieldTimer != 0) { // if shield is activated
        if (ennemy.isColliding(game.player)) {
          game.player.shieldTimer = 1;  // shield is broken at next tick
          game.addScoreEnnemy(ennemy);
          audioEnnemyDown.cloneNode(true).play();
          game.ennemies.splice(game.ennemies.indexOf(ennemy), 1);
        }
      }
      else {
        if (ennemy.isColliding(game.player)) {
          game.player.life -= 1;
          game.addScoreEnnemy(ennemy);
          audioEnnemyDown.cloneNode(true).play();
          game.ennemies.splice(game.ennemies.indexOf(ennemy), 1);
        }
      }
    }
    );
  }


game.spawnEnnemies =
  function (wave) {
    /* Spawn a heart bonus every wave */
    // todo heart here, heart every 2 waves?
    game.spawnBonus("heart");

    /* Choose how many ennemies to spawn */
    let nbSimpleEnnemy = 1.3 * wave * 6 * (game.difficulty + 1);
    let nbTripleMail = 1.1 * wave ** 2 * 3 * (game.difficulty + 1);
    let nbShooterMail = 1.3 * wave * 2 * (game.difficulty + 1);
    /* Spawn Simple Ennemies */
    for (let i = 0; i < nbSimpleEnnemy; i++) {
      let x = Math.random() * (sWidth - 59);
      let y = Math.random() * (- 300 * (1 + wave * 0.4));
      let ennemy = new Ennemy(x, y, 58, 43, imgSimpleMail);
      game.ennemies.push(ennemy);
    }
    /* Spawn Triple Mail */
    for (let i = 0; i < nbTripleMail; i++) {
      let x = Math.random() * (sWidth - 59);
      let y = Math.random() * (- 300 * (1 + wave * 0.4));
      let ennemy = new TripleMail(x, y, 58, 43, imgTripleMail);
      game.ennemies.push(ennemy);
    }
    /* Spawn Shooter Mail */
    for (let i = 0; i < nbShooterMail; i++) {
      let x = Math.random() * (sWidth - 59);
      let y = Math.random() * (- 300 * (1 + wave * 0.4));
      let ennemy = new ShooterMail(x, y, 58, 43, imgShooterMail);
      game.ennemies.push(ennemy);
    }
  }

game.moveEnnemyLasers =
  function () {
    for (let laser of game.ennemyLasers) {
      laser.move(0, this.speed);
    }
  }




/* State management of the game */
game.isLvlFinished =
  function () {
    /* If there is no ennemy left, spawn new wave */
    if (game.ennemies.length == 0) {
      game.spawnEnnemies(game.wave);
      game.wave++;

    }
  }

game.checkGameOver =
  function () {
    if (game.player.life <= 0) {
      game.gameOver("life");
    }
    else if (game.timer <= 0) {
      game.gameOver("timer");
    }
  }

game.gameOver =
  function (reason_death) {
    /* Stop and clear the main loop */
    clearInterval(game.interval);
    let message;
    game.changeScreen('game_over_menu');
    /* Choose the message of death */
    switch (reason_death) {
      case "timer":
        message = "You ran out of time..";
        break;
      case "life":
        message = "You got destroyed..";
        break
      case "ennemy_down":
        message = "An ennemy got into your base.."
    }
    /* If it's a new highscore, say it */
    if (isHighscore(game.score)) {
      document.getElementById("score_title_game_over").innerHTML = "<h1 id='highscore_title'>Highscore!</h1>";
      document.getElementById("highscore_title").style.color = "red"; //todo put the good color
    }
    /* If not, put right properties */
    else {
      document.getElementById("score_title_game_over").innerHTML = "<h1>Score</h1>";
    }
    document.getElementById("reason_of_death").innerHTML = '<h1>' + message + '</h1>';

  }

/* Start the game */
game.initialize =
  function () {
    if (game.initialized == false) {
      /* do all the initilization stuff, todo: do it cleaner in only one game.instance object */
      hideAllBonus();
      game.canSpawnBonus = true;
      game.player = new Player();
      game.timer = 60;
      game.ennemyLasers = [];
      game.wave = 1;
      game.bonusOnMap = [];
      game.initialized = true;
      game.score = 0;
      game.onPause = false;
      game.canPressPause = true;
      game.spawnBonus("timer_bonus");
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



/* Classes */

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
    if (this.y + dy + this.height > game.canvas.height) {
    }
    if (this.x + dx + this.width > game.canvas.width) {

    }
    if (this.x + dx < 0) {
    }
    if (this.y + dy < 0) {
    }

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

class Heart extends Bonus {
  constructor(x, y) {
    super(x, y, 50, 50, imgHeart, "heart");
  }
}
class TimerBonus extends Bonus {
  constructor(x, y) {
    super(x, y, 48, 52, imgTimerBonus, 'timer_bonus');
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
    let laser = new LaserPlayer(this.x + this.width / 2, this.y, imgMissile);
    this.lasers.push(laser);
  }

  drawLasers() {
    /* draw the lasers */
    for (let laser of this.lasers) {
      laser.draw();
    }
  }
  moveLasers() {
    /* move the lasers */
    for (let laser of this.lasers) {
      laser.move(0, +laser.speed);
    }
  }
}

class Player extends Shooter {
  constructor() {
    super(400, 800, 27, 64.5, imgPlayer, speedPlayer);
    this.canShoot = true;
    this.life = 5;
    this.shieldTimer = 0;
    this.turboTimer = 0;
    this.superShootTimer = 0;
    this.shieldActivated = false;
    this.turboActivated = false;
    this.superShootActivated = false;
    this.bonusActivated = false;
  }

  shoot() {
    /* To play a new shoot sound before the previous one is finished, we need to create a clone */
    audioPlayerShoot.cloneNode(true).play();
    /* Shoot a laser */
    if (this.superShootActivated) {
      const newLaser = new LaserPlayer(
        this.x + this.width / 2 - 15, this.y - this.height / 2, imgSuperMissile);
      const newLaser2 = new LaserPlayer(
        this.x + this.width / 2 + 10, this.y - this.height / 2, imgSuperMissile);
      this.lasers.push(newLaser);
      this.lasers.push(newLaser2);
    }
    else {
      super.shoot();
    }
  }


  draw() {
    //todo normal si t'arrives pas à bien lire, je ferais ça plus clean mais on draw juste le player ainsi que les bonus qui sont sur lui
    /* draw the player over bonuses */
    game.ctx.globalCompositeOperation = 'source-over';
    super.draw();
    game.ctx.globalCompositeOperation = 'destination-over';
    /* Draw the shield if needed */
    //todo check si le shield est bien centré
    if (this.shieldTimer > 0 && this.shieldActivated) {
      game.ctx.drawImage(imgShieldInGame, this.x - this.height / 2.1, this.y - this.height / 3.5, this.height * 1.5, this.height * 1.5);
      this.shieldTimer--;
      const barTimer = document.getElementById('bar_wrapper_shield');
      let countBar = Math.round(this.shieldTimer / maxShieldTimer * 200);
      let barWidth = Math.round(countBar * 0.3);
      if (barWidth < 17) {
        barWidth = 17;
      }
      barTimer.style.width = barWidth + '%';
      barTimer.innerHTML = countBar / 10 + ' s';
      if (this.shieldTimer == 0) {
        game.player.shieldActivated = false;
        game.player.bonusActivated = false;
        document.getElementById('bonus_shield_wrapper').style.display = 'none';
      }
    }
    if (this.turboTimer > 0 && this.turboActivated) {
      this.turboTimer--;
      const barTimer = document.getElementById('bar_wrapper_turbo');
      let countBar = Math.round(this.turboTimer / maxTurboTimer * 100);
      let barWidth = Math.round(countBar * 0.6);
      if (barWidth < 17) {
        barWidth = 17;
      }
      barTimer.style.width = barWidth + '%';
      barTimer.innerHTML = countBar / 10 + ' s';
      if (this.turboTimer == 0) {
        game.player.turboActivated = false;
        game.player.bonusActivated = false;
        document.getElementById('bonus_turbo_wrapper').style.display = 'none';
        this.speed = speedPlayer;
      }
    }
    if (this.superShootTimer > 0 && this.superShootActivated) {
      this.superShootTimer--;
      const barTimer = document.getElementById('bar_wrapper_super_shoot');
      let countBar = Math.round(this.superShootTimer / maxSuperShootTimer * 100);
      let barWidth = Math.round(countBar * 0.6);
      if (barWidth < 17) {
        barWidth = 17;
      }
      barTimer.style.width = barWidth + '%';
      barTimer.innerHTML = countBar / 10 + ' s';
      if (this.superShootTimer == 0) {
        game.player.superShootActivated = false;
        game.player.bonusActivated = false;
        document.getElementById('bonus_super_shoot_wrapper').style.display = 'none';
      }
    }
  }
}

class Ennemy extends Shooter {
  constructor(x, y, width, height, image) {
    super(x, y, width, height, image);
    this.speed = 1.2;
    this.life = 1;
  }

  move() {
    /* move the ennemy */
    this.y += this.speed;
    if (this.y > game.canvas.height) {
      game.ennemies.splice(game.ennemies.indexOf(this), 1);
      game.gameOver("ennemy_down");
    }
  }
}

class TripleMail extends Ennemy {
  constructor(x, y, width, height, image) {
    super(x, y, width, height, image);
    this.life = 3;
    this.speed = 1;
    this.listImage = [imgSimpleMail, imgDoubleMail, imgSimpleMail];
  }
}

class ShooterMail extends Ennemy {
  constructor(x, y, width, height, image) {
    super(x, y, width, height, image);
    this.life = 1;
    this.speed = 1.2;
  }

  tryToShoot() {
    /* shoot a laser */
    let rand = Math.random();
    if (rand < 0.01) {
      this.shoot();
    }
  }

  shoot() {
    /* shoot a laser */
    let laser = new LaserMail(this.x + this.width / 2, this.y + this.height, imgMissileShooterMail);
    /* adding laser to array game.ennemyLasers */
    game.ennemyLasers.push(laser);
  }

  drawLasers() {
    /* draw the lasers */
    for (let laser of game.ennemyLasers) {
      laser.draw();
    }
  }

}

/* Laser classes */
class Laser extends PhysicalObject {
  constructor(x, y, width, height, speed, image) {
    super(x, y, width, height, image);
    this.speed = speed;
  }

  draw() {
    /* draw the laser */
    game.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  move(dx, dy) {
    /* move the laser */
    this.x += dx;
    this.y -= dy;

    if (this.offScreen(-5, 0)) {
      this.delete();
    }
    for (let ennemy of game.ennemies) {
      if (this.isColliding(ennemy)) {
        this.delete();
        ennemy.life--;
        if (ennemy.life == 0) {
          audioEnnemyDown.cloneNode(true).play();
          game.ennemies.splice(game.ennemies.indexOf(ennemy), 1);
          game.addScoreEnnemy(ennemy);
        }
        else {
          /* check if ennemy is a triple mail */
          if (ennemy.constructor.name === 'TripleMail') {
            ennemy.image = ennemy.listImage[ennemy.life - 1];
          }
        }
      }
    }
  }


  delete() {
    /* delete the laser */
    game.player.lasers.splice(game.player.lasers.indexOf(this), 1);
  }
}

class LaserPlayer extends Laser {
  constructor(x, y, image) {
    super(x, y, 14, 57, vitesseLaserPlayer, image);
  }

  draw() {
    /* draw the laser */
    if (game.player.superShootTimer > 0) {
      game.ctx.drawImage(imgSuperMissile, this.x, this.y, this.width, this.height);
    }
    else {
      super.draw();
    }
  }
}

class LaserMail extends Laser {
  constructor(x, y, image) {
    super(x, y, 42, 44, -vitesseLaserEnnemy, image);
  }

  move() {
    /* move the laser */
    this.x += 0;
    this.y -= this.speed;
    if (this.offScreen(-5, 0)) {
      this.delete();
    }
    if (this.isColliding(game.player)) {
      this.delete();
      game.player.life -= 1;
    }
  }

  delete() {
    /* delete the laser */
    game.ennemyLasers.splice(game.ennemyLasers.indexOf(this), 1);
  }
}


/* Main loop of the game */
function updateGame() {
  /* Manage events */
  game.doKeyboardEvents();
  if (game.onPause == false) {
    /* Reset the canvas */
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    /* Do all the drawings */
    game.player.draw(game.ctx);
    game.drawLasersEnnemies();
    game.manageImagePlayer();
    game.player.drawLasers();
    game.player.moveLasers();
    game.drawEnnemies();
    game.drawTimerBar();
    game.drawBonus();
    game.drawScore();

    /* Do all the in-game functions */
    game.moveEnnemyLasers();
    game.moveEnnemies();

    /* Game management */
    game.manageLifePlayer();
    game.isLvlFinished();
    game.checkGameOver();
    game.manageBonus();
  }
}




/* Get all the scores in localStorage and return them in an array sorted */
function getScoresInArray() {
  /* array of array key: values */
  let arrayKeyValues = Object.entries(localStorage);

  /* sort arrayKeyValues by score */
  arrayKeyValues.sort(function (a, b) {
    return b[1] - a[1];
  });
  return arrayKeyValues;
}

/* Check if it's a new high score */
function isHighscore(newScore) {
  let scores = getScoresInArray();
  if (!scores.length) return true;
  if (newScore > scores[0][1]) {
    return true;
  }
  return false;
}

/* Store the score in localStorage */
function setScore(name, score) {
  localStorage.setItem(name, score);
  let scores = getScoresInArray();
  /* Write the scores in the leaderboard menu */
  let n = (scores.length < 5) ? scores.length : 5;
  for (let i = 0; i < n; i++) {
    /* Write in the leaderboard menu */
    let h1 = $("#leaderboard_header_name h1:nth-child(" + (i + 2) + ")");
    h1.html(scores[i][0]);
    h1 = $("#leaderboard_header_score h1:nth-child(" + (i + 2) + ")");
    h1.html(scores[i][1]);
    h1 = $("#leaderboard_header_rank h1:nth-child(" + (i + 2) + ")");
    h1.html(i + 1);
  }
}

/* Button to save the score */
//todo : can click only once and then display "saved"
function toggleSaveScore() {
  let nameValue = document.getElementById("name_input").value;
  let scoreValue = game.score;
  setScore(nameValue, scoreValue);
}

setSoundClickHover();
game.changeScreen('start_menu');
//todo expliquer ça
localStorage.clear();