var EPSILON_DISTANCE = 1;
var uid = 0;

var Ball = function( r, u, a, color ) {
    this.r = r;
    if ( typeof u == 'undefined' ) {
        u = new Vector( 0, 0 );
    }
    if ( typeof a == 'undefined' ) {
        a = new Vector( 0, 0 );
    }

    this.u = u;
    this.a = a;

    if ( typeof color == 'undefined' ) {
        color = rgbRandom();
    }
    this.color = color;
    this.uid = uid++;
};

Ball.prototype = {
    constructor: 'Ball',
    draw: function() {
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc( this.r.x, this.r.y, BALL_RADIUS, 0, 2 * Math.PI, false );
        ctx.stroke();
        ctx.fill();
    },
    collideWithBall: function( ball, newr ) {
        if ( ball.uid != this.uid ) {
            // circle/circle collision detection
            if ( ball.r.distance( newr ) < 2 * BALL_RADIUS ) {
                // collision determination
                pointOfCollision = ball.r.add( newr ).scale( 1 / 2 );
                return pointOfCollision;
            }
        }
        return false;
    },
    collideWithWall: function( newr ) {
        // collision detection only
        return newr.y + BALL_RADIUS > H
            || newr.y - BALL_RADIUS < 0
            || newr.x - BALL_RADIUS < 0
            || newr.x + BALL_RADIUS > W;
    },
    integrate: function( dt ) {
        var self = this;

        // Euler integration
        var newr = this.r.add( this.u.scale( dt ) );
        var newu = this.u.add( this.a.scale( dt ) ); 

        // collision
        // collisions with other balls, O( N^2 ) collision integration
        var collision = false;

        balls.forEach( function( ball ) {
            var pointOfCollision = self.collideWithBall( ball, newr );
            if ( pointOfCollision !== false ) {
                // collision resolution
                var selfToCollision = pointOfCollision.subtract( newr ).normalize();
                var ballToCollision = pointOfCollision.subtract( ball.r ).normalize();
                var c1 = selfToCollision.dot( self.u ),
                    c2 = ballToCollision.dot( ball.u );
                var c = Math.abs( DAMPING * ( c1 + c2 ) / 2 );
                
                // bounce
                newu = newu.subtract( selfToCollision.scale( c1 + c ) );
                ball.u = ball.u.subtract( ballToCollision.scale( c2 + c ) );
                var low = self.r;
                var high = newr;

                newr = ball.r.add( newr.subtract( ball.r ).normalize().scale( 2 * BALL_RADIUS ) );
                // newr = high;
            }
        } );
        // collision detection + response for walls
        // bottom wall
        if ( newr.y + BALL_RADIUS > H ) {
            if ( newr.y > H - BALL_RADIUS ) {
                collision = true;
                newr.y = H - BALL_RADIUS;
            }
            newu.y = -this.u.y * DAMPING;
            newu.x = this.u.x * FRICTION;
        }
        // top wall
        if ( newr.y - BALL_RADIUS < 0 ) {
            if ( newr.y < BALL_RADIUS ) {
                collision = true;
                newr.y = BALL_RADIUS;
            }
            newu.y = -this.u.y * DAMPING;
            newu.x = this.u.x * FRICTION;
        }
        // left wall
        if ( newr.x - BALL_RADIUS < 0 ) {
            if ( newr.x < BALL_RADIUS ) {
                collision = true;
                newr.x = BALL_RADIUS;
            }
            newu.x = -this.u.x * DAMPING;
            newu.y = this.u.y * FRICTION;
        }
        // right wall
        if ( newr.x + BALL_RADIUS > W ) {
            if ( newr.x > H - BALL_RADIUS ) {
                collision = true;
                newr.x = H - BALL_RADIUS;
            }
            newu.x = -this.u.x * DAMPING;
            newu.y = this.u.y * FRICTION;
        }
        this.r = newr;
        this.u = newu;
    },
    clone: function() {
        return new Ball(
            this.r.clone(), this.u.clone(), this.a.clone(), this.color
        );
    }
};
