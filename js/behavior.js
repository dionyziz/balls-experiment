var pendingBall = false;
var canvasHalf = new Vector( canvas.offsetWidth / 2, canvas.offsetHeight / 2 );

canvas.onmousedown = function( e ) {
    if ( e.which == 1 ) {
        var canvasLocation = Vector.locationFromElement( canvas );
        var canvasHalfSize = Vector.halfSizeFromElement( canvas );
        var mouseLocation = Vector.fromMouse( e );
        var newBallLocation = mouseLocation
            .rotate( canvasLocation, boxAngle )
            .subtract( canvasLocation.subtract( canvasHalfSize ) );

        pendingBall = new Ball(
            newBallLocation,
            new Vector( 0, 0 ),
            gravity
        );
    }
    return false;
};
var beginBoxAngle = 0;
var boxAngle = 0;
document.onmousemove = function( e ) {
    if ( e.which == 1 && pendingBall !== false ) {
        var mouseLocation = Vector.fromMouse( e );
        var canvasLocation = Vector.locationFromElement( canvas );
        var canvasHalfSize = Vector.halfSizeFromElement( canvas );

        pendingBall.u = mouseLocation
            .subtract( canvasLocation )
            .add( canvasHalfSize )
            .rotate( canvasHalfSize, boxAngle )
            .subtract( pendingBall.r );
    }
    if ( rotorDown !== false ) {
        var rotorMove = new Vector( e.clientX, e.clientY );
        var canvasCenter = new Vector( canvas.offsetLeft, canvas.offsetTop ).add( canvasHalf );
        boxAngle = beginBoxAngle + rotorDown.subtract( canvasCenter ).angle() - rotorMove.subtract( canvasCenter ).angle();
        var boxAngleDegrees = -Math.round( 360 * boxAngle / ( 2 * Math.PI ) );

        gravity = Vector.fromPolar( Math.PI / 2 + boxAngle, 5 );

        for ( i in balls ) {
            balls[ i ].a = gravity;
        }

        canvas.style.webkitTransform = 'rotate(' + boxAngleDegrees + 'deg)';
        resize();
    }
    return false;
}
document.onmouseup = function( e ) {
    if ( e.which == 1 && pendingBall !== false ) {
        balls.push( pendingBall.clone() );
        pendingBall = false;
    }
    if ( e.which == 1 ) {
        rotorDown = false;
        beginBoxAngle = boxAngle;
    }
    return false;
};

var rotor = document.getElementsByClassName( 'rotor' )[ 0 ];
function resize() {
    var rotorCenter = new Vector(
        canvas.offsetLeft + canvas.offsetWidth + rotor.offsetWidth / 2,
        canvas.offsetTop + canvas.offsetHeight + rotor.offsetHeight / 2
    );
    var canvasCenter = new Vector(
        canvas.offsetLeft + canvas.offsetWidth / 2,
        canvas.offsetTop + canvas.offsetHeight / 2
    );
    var toRotorCenter = rotorCenter.subtract( canvasCenter );

    toRotorCenter = Vector.fromPolar( toRotorCenter.angle() - boxAngle, toRotorCenter.length() );
    rotorCenter = toRotorCenter.add( canvasCenter );
    var rotorPos = rotorCenter.subtract( new Vector( rotor.offsetWidth / 2, rotor.offsetHeight /2  ) );

    rotor.style.left = Math.round( rotorPos.x ) + 'px';
    rotor.style.top = Math.round( rotorPos.y ) + 'px';
}

window.onresize = resize;
resize();

var rotorDown = false;

rotor.onmousedown = function( e ) {
    if ( e.which == 1 ) {
        rotorDown = new Vector( e.clientX, e.clientY );
        beginBoxAngle = boxAngle;
    }
    return false;
};
