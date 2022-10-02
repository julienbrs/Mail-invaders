var panePlayer = $('#player_zone'),
    boxPlayer = $('#hitbox_player'),
    maxWidth = panePlayer.width() - boxPlayer.width(),  //max horizontal movement
    maxHeight = panePlayer.height() - boxPlayer.height(),   //max vertical movement
    dataKeyPressed = {},
    tickMovement = 10;

function newWidth(oldValue,key1,key2) {
    /* newPos is the new potential topleft */
    var newPos = parseInt(oldValue, 10) 
                - (dataKeyPressed[key1] ? tickMovement : 0) 
                + (dataKeyPressed[key2] ? tickMovement : 0);
    /* if n is less than 0 or greather than maxWidth, do nothing */
    return newPos < 0 ? 0 : (newPos > maxWidth ? maxWidth : newPos);
}

function newHeight(oldValue,key1,key2) {
    /* newPos is the new potential topleft */
    var newPos = parseInt(oldValue, 10) - (dataKeyPressed[key1] ? tickMovement : 0) + (dataKeyPressed[key2] ? tickMovement : 0);
    /* if n is less than 0 or greather than maxHeight, do nothing */
    return newPos < 0 ? 0 : (newPos > maxHeight ? maxHeight : newPos);
}

$(window).keydown(function(e) { dataKeyPressed[e.which] = true; }); // adding key to array when pressed
$(window).keyup(function(e) { dataKeyPressed[e.which] = false; });  // removing key from array when released



class Laser {
    constructor(x, y, width, height, color, speed, image) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
        this.image = image;
    }

    draw() {
        
    }

    update() {
        this.draw();
        this.x += this.speed;
    }
}

class Shooter {
    constructor(x, y, width, height, color, speed) {
        this.x = x;
        this.y = y;
        this.lasers = [];
    }

    draw(board) {
        /* board is the canvas */
        var canvas = document.getElementById(board);
        canvas.style.backgroundColor = 'red';
    }

    shoot() {
        var img = "assets/laser.png";
        const screenplay = document.getElementById("screenplay");
        const newLaser = document.createElement("div");
        newLaser.classList.add("laser");
        newLaser.style.zIndex = 1;
        screenplay.appendChild(newLaser);
        const imgLaser = document.createElement("img");
        imgLaser.src = img;
        newLaser.appendChild(imgLaser);
        this.lasers.push(new Laser(this.x, this.y, 10, 5, 'blue', 5));
    }
}

let player = new Shooter( $('#hitbox_player').x,  $('#hitbox_player').y,  $('#hitbox_player').width,  $('#hitbox_player').height,  'red',  10);


setInterval(function() {
    boxPlayer.css({
        left: function(i,oldValue) { return newWidth(oldValue, 37, 39); },
        top: function(i,oldValue) { return newHeight(oldValue, 38, 40); }
    });
    player.draw("hitbox_player");

}, 20); // 20ms is the refresh rate

player.shoot();
console.log(player.lasers);