import * as angular from 'angular';
import WhizApp from './whiz.module';

// Bootstrap
angular.element(document).ready( () => {
    angular.bootstrap(document, [WhizApp.name], {
        strictDi: true
    })
});