import * as angular from 'angular';
import MarvelApi from './marvel.api';
import MarvelKeyInterceptorFactory from './marvel-key.interceptor';

export default angular
    .module('whiz.marvel', [])
    .config(MarvelKeyInterceptorFactory)
    .service('MarvelApi', MarvelApi);