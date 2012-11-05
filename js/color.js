function rgbRandom() {
    function randomVal() {
        return Math.floor( 1000 * Math.random() ) % 256;
    }
    return 'rgb( ' + randomVal() + ', ' + randomVal() + ', ' + randomVal() + ' )';
}
