function rgbRandom() {
    function randomVal() {
        return Math.floor( 256 * Math.random() );
    }
    return 'rgb( ' + randomVal() + ', ' + randomVal() + ', ' + randomVal() + ' )';
}
