function Vector( x, y ) {
    this.x = x;
    this.y = y;
}

Vector.fromPolar = function( angle, length ) {
    return new Vector(
        length * Math.cos( angle ),
        length * Math.sin( angle )
    );
};
Vector.fromMouse = function( e ) {
    return new Vector(
        e.clientX,
        e.clientY
    );
};
Vector.locationFromElement = function( element ) {
    return new Vector(
        element.offsetLeft + element.offsetWidth / 2,
        element.offsetTop + element.offsetHeight / 2
    );
};
Vector.halfSizeFromElement = function( element ) {
    return new Vector(
        element.offsetWidth / 2,
        element.offsetHeight / 2
    );
};

Vector.prototype = {
    constructor: 'Vector',
    add: function( v ) {
        return new Vector(
            this.x + v.x,
            this.y + v.y
        );
    },
    subtract: function( v ) {
        return this.add( v.negate() );
    },
    negate: function() {
        return this.scale( -1 );
    },
    scale: function( lambda ) {
        return new Vector(
            lambda * this.x,
            lambda * this.y
        );
    },
    length: function() {
        return Math.sqrt( this.x * this.x + this.y * this.y );
    },
    distance: function( v ) {
        return this.subtract( v ).length();
    },
    angle: function() {
        return Math.atan2( this.y, this.x );
    },
    normalize: function() {
        return this.scale( 1 / this.length() );
    },
    dot: function( v ) {
        return this.x * v.x + this.y * v.y;
    },
    clone: function() {
        return this.scale( 1 );
    },
    rotate: function( center, angle ) {
        var translated = this.subtract( center );
        return Vector.fromPolar(
            translated.angle() + angle,
            translated.length()
        ).add( center );
    }
};
