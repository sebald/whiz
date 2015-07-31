import './whiz.module';

// Bootstrap
angular.element(document).ready( () => {
    angular.bootstrap(document, ['whiz.app'], {
        strictDi: true
    })
});