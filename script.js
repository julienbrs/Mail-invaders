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

setInterval(function() {
    boxPlayer.css({
        left: function(i,oldValue) { return newWidth(oldValue, 37, 39); },
        top: function(i,oldValue) { return newHeight(oldValue, 38, 40); }
    });
}, 20); // 20ms is the refresh rate

