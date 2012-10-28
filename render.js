var ARROW_HEAD_LENGTH = 10;
var ARROW_HEAD_ANGLE = Math.PI / 4;
var canvas = document.querySelector( 'canvas' );
var ctx = canvas.getContext( '2d' );

window.requestAnimationFrame = window.webkitRequestAnimationFrame;

var t = Date.now();
( function animate() {
    var MIN_DT = 0.05;

    ctx.clearRect( 0, 0, W, H );

    window.requestAnimationFrame( animate );

    var dt = ( Date.now() - t ) / 100;

    function integrateBalls( dt ) {
        balls.forEach( function( ball ) {
            ball.integrate( dt );
        } );
    }
    // iterative euler integration
    while ( dt > MIN_DT ) {
        integrateBalls( MIN_DT );
        dt -= MIN_DT;
    }
    integrateBalls( dt );

    balls.forEach( function( ball ) {
        ball.draw();
    } );

    if ( pendingBall !== false ) {
        pendingBall.draw();
        drawArrow( pendingBall.r, pendingBall.r.add( pendingBall.u ) );
    }

    t = Date.now();
} )();

function drawLine( start, end ) {
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo( start.x, start.y );
    ctx.lineTo( end.x, end.y );
    ctx.stroke();
}

function drawArrow( start, end ) {
    drawLine( start, end );
    drawLine( end, end.add( Vector.fromPolar( start.subtract( end ).angle() - ARROW_HEAD_ANGLE, ARROW_HEAD_LENGTH ) ) );
    drawLine( end, end.add( Vector.fromPolar( start.subtract( end ).angle() + ARROW_HEAD_ANGLE, ARROW_HEAD_LENGTH ) ) );
}
