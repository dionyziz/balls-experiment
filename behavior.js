var pendingBall = false;

canvas.onmousedown = function( e ) {
    if ( e.which == 1 ) {
        pendingBall = new Ball(
            new Vector( e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop ),
            new Vector( 0, 0 ),
            GRAVITY
        );
    }
};
document.onmousemove = function( e ) {
    if ( e.which == 1 && pendingBall !== false ) {
        pendingBall.u = ( new Vector( e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop ) ).subtract( pendingBall.r );
    }
}
document.onmouseup = function( e ) {
    if ( e.which == 1 ) {
        balls.push( pendingBall.clone() );
        pendingBall = false;
    }
};
