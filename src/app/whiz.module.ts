import * as angular from 'angular';
import MarvelModule from 'services/marvel/marvel.module';
import WhizComponent from './whiz.component';

export default angular
    .module('whiz.app', [
        MarvelModule.name
    ])
    .directive('whizApp', WhizComponent);