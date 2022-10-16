var panePlayer = $('#player_zone'), boxPlayer = $('#hitbox_player'),
    maxWidth =
        panePlayer.width() - boxPlayer.width(),  // max horizontal movement
    maxHeight =
        panePlayer.height() - boxPlayer.height(),  // max vertical movement
    dataKeyPressed = {}, tickMovement = 10;


const canvas = document.getElementById('screenplay');
const context = canvas.getContext('2d');

function newWidth(oldValue, key1, key2) {
  /* newPos is the new potential topleft */
  var newPos = parseInt(oldValue, 10) -
      (dataKeyPressed[key1] ? tickMovement : 0) +
      (dataKeyPressed[key2] ? tickMovement : 0);
  /* if n is less than 0 or greather than maxWidth, do nothing */
  return newPos < 0 ? 0 : (newPos > maxWidth ? maxWidth : newPos);
}

function newHeight(oldValue, key1, key2) {
  /* newPos is the new potential topleft */
  var newPos = parseInt(oldValue, 10) -
      (dataKeyPressed[key1] ? tickMovement : 0) +
      (dataKeyPressed[key2] ? tickMovement : 0);
  /* if n is less than 0 or greather than maxHeight, do nothing */
  return newPos < 0 ? 0 : (newPos > maxHeight ? maxHeight : newPos);
}

document.addEventListener('keydown', (e) => {
  if (e.repeat) {
    return
  };  // do nothing
  const {key} = e;

  switch (key) {
    case ' ':  // spacebar
      console.log('SHOOTING');
      player.shoot();
      break;
    default:
      console.log(key);
  }
});



$(window).keydown(function(e) {
  if (e.which == 32) {
    return;  // do nothing when spacebar
  } else {   // adding key to array when pressed
    dataKeyPressed[e.which] = true;
  }
});

$(window).keyup(function(e) {
  dataKeyPressed[e.which] = false;
});  // removing key from array when released


function getTopLeft(element) {
  var rect = element.getBoundingClientRect();
  return {x: rect.left + window.scrollX, y: rect.top + window.scrollY};
}

function updatePositionPlayer() {
  var elem = document.getElementById('hitbox_player');
  var pos = getTopLeft(elem);
  player.x = pos.x;
  player.y = pos.y;
}


class Laser {
  constructor(x, y, width, height, color, speed, elem) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.speed = speed;
    this.elem = elem;
  }

  draw() {}

  update() {
    this.elem.style.position = 'absolute';
    // this.style.left = this.x + "px";
    this.elem.style.top = parseInt(this.elem.style.top) - 2 + 'px';
    // this.x += this.speed;
  }
}

class Shooter {
  constructor(x, y, color, speed) {
    this.x = x;
    this.y = y;
    this.lasers = [];
  }

  draw(board) {
    /* board is the canvas */
    // var canvas = document.getElementById(board);
    // canvas.style.backgroundColor = 'red';
  }

  shoot() {
    /* html of the new laser */
    var img = 'assets/laser.png';
    const newLaser = document.createElement('div');
    newLaser.classList.add('laser');
    const screenplay = document.getElementById('screenplay');
    screenplay.appendChild(newLaser);
    const imgLaser = document.createElement('img');
    imgLaser.src = img;
    newLaser.appendChild(imgLaser);
    this.lasers.push(new Laser(this.x, this.y, 10, 5, 'blue', 5, newLaser));
    /* CSS of the new laser */
    newLaser.style.zIndex = 5;
    newLaser.style.position = 'absolute';
    newLaser.style.left = this.x + 'px';
    newLaser.style.top = this.y + 'px';

    console.log(newLaser);
  }

  moveLaser() {
    this.lasers.forEach(laser => {
      laser.update();
    });
  }
}

let player = new Shooter(
    /* getTopLeft(document.getElementById('hitbox_player')).x,
    getTopLeft(document.getElementById('hitbox_player')).y */
    250, 250, 'red', 10);


setInterval(function() {
  boxPlayer.css({
    left: function(i, oldValue) {
      return newWidth(oldValue, 37, 39);
    },
    top: function(i, oldValue) {
      return newHeight(oldValue, 38, 40);
    }
  });
  player.draw('hitbox_player');
  updatePositionPlayer();
  if (dataKeyPressed[32]) {
    player.shoot();
  }
  player.moveLaser();
}, 20);  // 20ms is the refresh rate
