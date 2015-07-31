'user strict';

function Config () {
    var config = this;

    // Paths
    config.path = {
        src: './src',
        dest: './build',

        typings: './typings'
    };

    // Files
    config.files = {
        key: '.marvel'
    };


    // Vendors
    config.vendor = [
        'node_modules/angular/angular.js'
    ];


    // Main file
    config.main = config.path.src + '/index.html';


    // Server
    config.server = {
        port: 3000
    };
}

module.exports = (function () {
    return new Config();
})();